#!/usr/bin/env python3

import json
import mimetypes
import os
import re
import socket
import threading
import time
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse


HOST = os.environ.get("AIM_DEV_HOST", "localhost")
PORT = int(os.environ.get("AIM_DEV_PORT", "5173"))
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

EXCLUDE_DIRS = {".git", "node_modules", "__pycache__"}
POLL_INTERVAL_SECONDS = 2.0

_reload_lock = threading.Lock()
_reload_cv = threading.Condition(_reload_lock)
_reload_version = 0


_GOOGLE_FONTS_TAG_RE = re.compile(
    r"^\s*<link\b[^>]*\bhref=\"https?://fonts\.(?:googleapis|gstatic)\.com[^\"]*\"[^>]*>\s*$",
    re.IGNORECASE | re.MULTILINE,
)
_GOOGLE_FONTS_PREFETCH_RE = re.compile(
    r"^\s*<link\b[^>]*\brel=\"(?:preconnect|dns-prefetch)\"[^>]*\bhref=\"https?://fonts\.(?:googleapis|gstatic)\.com\"[^>]*>\s*$",
    re.IGNORECASE | re.MULTILINE,
)


def _strip_external_fonts(html: str) -> str:
    # Local dev should not depend on external CDNs that might be blocked,
    # otherwise the tab can appear to load forever.
    html = _GOOGLE_FONTS_TAG_RE.sub("", html)
    html = _GOOGLE_FONTS_PREFETCH_RE.sub("", html)
    return html


def _compute_latest_mtime() -> float:
    latest = 0.0
    for dirpath, dirnames, filenames in os.walk(ROOT_DIR):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for filename in filenames:
            if filename.endswith(".py") and os.path.samefile(dirpath, ROOT_DIR):
                # changing devserver.py itself is fine but shouldn't cause infinite reload loops
                pass
            full_path = os.path.join(dirpath, filename)
            try:
                stat = os.stat(full_path)
            except OSError:
                continue
            latest = max(latest, stat.st_mtime)
    return latest


def _watch_files() -> None:
    global _reload_version

    last_mtime = _compute_latest_mtime()
    while True:
        time.sleep(POLL_INTERVAL_SECONDS)
        # Disable auto-reload to prevent infinite loops
        # current_mtime = _compute_latest_mtime()
        # if current_mtime > last_mtime:
        #     last_mtime = current_mtime
        #     with _reload_lock:
        #         _reload_version += 1


_RELOAD_SNIPPET = """
<script>
(() => {
  const endpoint = '/__reload';
  let version = 0;
    const intervalMs = 5000;

    async function pollOnce() {
        const res = await fetch(`${endpoint}?since=${version}`, { cache: 'no-store' });
        const data = await res.json();
        if (typeof data?.version === 'number') {
            if (data.version > version) {
                location.reload();
                return;
            }
            version = data.version;
        }
    }

    async function loop() {
        try {
            await pollOnce();
        } catch (e) {
            // ignore and retry
        }
        setTimeout(loop, intervalMs);
    }

    // Start polling after initial page load so the tab doesn't look like it's
    // perpetually loading due to background fetch requests.
    const start = () => setTimeout(loop, 500);
    if (document.readyState === 'complete') {
        start();
    } else {
        window.addEventListener('load', start, { once: true });
    }
})();
</script>
""".strip()


class DevHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Serve files relative to the repo root regardless of process CWD.
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def end_headers(self) -> None:
        # Avoid sticky caching during dev
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/__reload":
            self._handle_reload(parsed)
            return
        super().do_GET()

    def _handle_reload(self, parsed) -> None:
        qs = parse_qs(parsed.query)
        try:
            since = int(qs.get("since", ["0"])[0])
        except ValueError:
            since = 0

        # Always return quickly: long-polling keeps an open request, which makes
        # browsers (notably Chrome) show a perpetual loading indicator.
        with _reload_lock:
            version = _reload_version

        payload = json.dumps({"version": version}).encode("utf-8")
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def send_head(self):
        # Same as SimpleHTTPRequestHandler, but inject live-reload snippet into HTML files.
        parsed_req = urlparse(self.path)
        qs = parse_qs(parsed_req.query)
        disable_reload = qs.get("__noreload", ["0"])[0] == "1" or "vscodeBrowserReqId" in qs

        path = self.translate_path(self.path)
        f = None

        if os.path.isdir(path):
            for index in ("index.html", "index.htm"):
                index_path = os.path.join(path, index)
                if os.path.exists(index_path):
                    path = index_path
                    break
            else:
                return super().send_head()

        ctype = self.guess_type(path)
        if ctype.startswith("text/html") and os.path.exists(path):
            try:
                with open(path, "rb") as fp:
                    raw = fp.read()
            except OSError:
                self.send_error(HTTPStatus.NOT_FOUND, "File not found")
                return None

            try:
                text = raw.decode("utf-8")
            except UnicodeDecodeError:
                text = raw.decode("utf-8", errors="replace")

            text = _strip_external_fonts(text)

            lower = text.lower()
            insert_at = lower.rfind("</body>")
            if insert_at == -1:
                insert_at = lower.rfind("</html>")

            if disable_reload:
                injected = text
            else:
                if insert_at == -1:
                    injected = text + "\n" + _RELOAD_SNIPPET + "\n"
                else:
                    injected = text[:insert_at] + "\n" + _RELOAD_SNIPPET + "\n" + text[insert_at:]

            encoded = injected.encode("utf-8")
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(encoded)))
            self.end_headers()

            from io import BytesIO

            f = BytesIO(encoded)
            return f

        return super().send_head()


class DualStackThreadingHTTPServer(ThreadingHTTPServer):
    address_family = socket.AF_INET6

    def server_bind(self) -> None:
        # Allow accepting IPv4-mapped connections on the IPv6 socket on
        # platforms where this is supported.
        try:
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        except OSError:
            pass
        super().server_bind()


def _create_server(host: str, port: int) -> ThreadingHTTPServer:
    # Chrome often prefers IPv6 for `localhost` (i.e. ::1). Binding only to
    # 127.0.0.1 can make it look like the site doesn't load.
    if host in {"localhost", "::", "::1"}:
        try:
            return DualStackThreadingHTTPServer(("::", port), DevHandler)
        except OSError:
            # Fallback to IPv4-only.
            return ThreadingHTTPServer(("127.0.0.1", port), DevHandler)

    return ThreadingHTTPServer((host, port), DevHandler)


def main() -> None:
    mimetypes.init()

    watcher = threading.Thread(target=_watch_files, daemon=True)
    watcher.start()

    server = _create_server(HOST, PORT)
    print(f"Serving {ROOT_DIR}")
    print(f"  http://127.0.0.1:{PORT}/index.html")
    print(f"  http://localhost:{PORT}/index.html")
    print(f"  http://[::1]:{PORT}/index.html")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
