/* ============================================
   AIM-ROBOTICS - Animations JavaScript
   Advanced animations and effects
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initParallax();
    initTextAnimations();
    initHoverEffects();
    initCursorEffects();
    initScrollProgress();
});

/* ============================================
   PARALLAX EFFECTS
   ============================================ */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-parallax') || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/* ============================================
   TEXT ANIMATIONS
   ============================================ */
function initTextAnimations() {
    // Split text into spans for animation
    const animatedTexts = document.querySelectorAll('.animate-text');
    
    animatedTexts.forEach(text => {
        const content = text.textContent;
        text.innerHTML = '';
        
        content.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = (index * 50) + 'ms';
            text.appendChild(span);
        });
    });
}

/* ============================================
   HOVER EFFECTS
   ============================================ */
function initHoverEffects() {
    // Magnetic hover effect for buttons
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-accent');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', function(e) {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        el.addEventListener('mouseleave', function() {
            el.style.transform = 'translate(0, 0)';
        });
    });
    
    // Tilt effect for cards
    const tiltCards = document.querySelectorAll('.dienst-card, .project-card, .robot-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    // Glow effect follow cursor
    const glowCards = document.querySelectorAll('.dienst-card');
    
    glowCards.forEach(card => {
        const glow = card.querySelector('.card-glow');
        if (!glow) return;
        
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 212, 255, 0.15) 0%, transparent 50%)`;
            glow.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', function() {
            glow.style.opacity = '0';
        });
    });
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */
function initCursorEffects() {
    // Only enable on desktop
    if (window.innerWidth < 1024) return;
    
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
    document.body.appendChild(cursor);
    
    // Add cursor styles
    const cursorStyles = document.createElement('style');
    cursorStyles.textContent = `
        .custom-cursor {
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 99999;
            mix-blend-mode: difference;
        }
        
        .cursor-dot {
            position: absolute;
            width: 8px;
            height: 8px;
            background: #fff;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease;
        }
        
        .cursor-ring {
            position: absolute;
            width: 40px;
            height: 40px;
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: all 0.15s ease-out;
        }
        
        .custom-cursor.hover .cursor-ring {
            width: 60px;
            height: 60px;
            border-color: var(--primary);
        }
        
        .custom-cursor.hover .cursor-dot {
            transform: translate(-50%, -50%) scale(1.5);
            background: var(--primary);
        }
        
        .custom-cursor.click .cursor-ring {
            transform: translate(-50%, -50%) scale(0.9);
        }
        
        body {
            cursor: none;
        }
        
        a, button, input, select, textarea, .btn {
            cursor: none;
        }
    `;
    document.head.appendChild(cursorStyles);
    
    // Track cursor position
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        const speed = 0.2;
        
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, input, select, textarea, .btn, .dienst-card, .project-card');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            cursor.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', function() {
            cursor.classList.remove('hover');
        });
    });
    
    // Click effect
    document.addEventListener('mousedown', function() {
        cursor.classList.add('click');
    });
    
    document.addEventListener('mouseup', function() {
        cursor.classList.remove('click');
    });
}

/* ============================================
   SCROLL PROGRESS
   ============================================ */
function initScrollProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // Add styles
    const progressStyles = document.createElement('style');
    progressStyles.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: var(--gradient-primary);
            z-index: 10001;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(progressStyles);
    
    // Update on scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

/* ============================================
   INTERSECTION OBSERVER ANIMATIONS
   ============================================ */
function initIntersectionAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '-50px',
        threshold: 0.2
    };
    
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const animation = el.getAttribute('data-animation');
                const delay = el.getAttribute('data-delay') || 0;
                
                setTimeout(function() {
                    el.classList.add('animated', animation);
                }, delay);
                
                animationObserver.unobserve(el);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[data-animation]').forEach(el => {
        animationObserver.observe(el);
    });
}

/* ============================================
   SMOOTH REVEAL ANIMATIONS
   ============================================ */
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 150;
        
        if (revealTop < windowHeight - revealPoint) {
            reveal.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

/* ============================================
   NUMBER COUNTING ANIMATION
   ============================================ */
function animateNumbers() {
    const numbers = document.querySelectorAll('.animate-number');
    
    numbers.forEach(number => {
        const target = parseInt(number.getAttribute('data-target'));
        const duration = parseInt(number.getAttribute('data-duration')) || 2000;
        const start = 0;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            
            number.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    });
}

/* ============================================
   STAGGERED ANIMATIONS
   ============================================ */
function staggeredAnimation(selector, animationClass, delay = 100) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((el, index) => {
        setTimeout(function() {
            el.classList.add(animationClass);
        }, index * delay);
    });
}

/* ============================================
   MORPHING SHAPES
   ============================================ */
function createMorphingShape(container) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.innerHTML = `
        <defs>
            <linearGradient id="morphGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color: var(--primary); stop-opacity: 0.3" />
                <stop offset="100%" style="stop-color: var(--accent); stop-opacity: 0.3" />
            </linearGradient>
        </defs>
        <path fill="url(#morphGradient)" d="">
            <animate 
                attributeName="d" 
                dur="10s" 
                repeatCount="indefinite"
                values="
                    M100,10 C150,10 190,50 190,100 C190,150 150,190 100,190 C50,190 10,150 10,100 C10,50 50,10 100,10;
                    M100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 C20,60 60,20 100,20;
                    M100,10 C150,10 190,50 190,100 C190,150 150,190 100,190 C50,190 10,150 10,100 C10,50 50,10 100,10
                "
            />
        </path>
    `;
    container.appendChild(svg);
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/* ============================================
   MOUSE TRAIL EFFECT
   ============================================ */
function initMouseTrail() {
    const trail = [];
    const trailLength = 10;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.cssText = `
            position: fixed;
            width: ${10 - i}px;
            height: ${10 - i}px;
            background: var(--primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            opacity: ${1 - (i / trailLength)};
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        let x = mouseX;
        let y = mouseY;
        
        trail.forEach((dot, index) => {
            const nextDot = trail[index + 1] || trail[0];
            
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            
            x += (parseFloat(nextDot.style.left) - x) * 0.3;
            y += (parseFloat(nextDot.style.top) - y) * 0.3;
        });
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

/* ============================================
   EXPORT FUNCTIONS
   ============================================ */
window.AIMAnimations = {
    typeWriter,
    staggeredAnimation,
    animateNumbers,
    createMorphingShape,
    initMouseTrail
};
