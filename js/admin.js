/**
 * AIM-Robotics Live Editor / Admin Panel
 * Allows real-time text and image editing on the website
 */

class LiveEditor {
    constructor() {
        this.isEditMode = false;
        this.editableElements = [];
        this.editableImages = [];
        this.changes = {};
        this.imageChanges = {};
        this.originalContent = {};
        this.originalImages = {};
        this.adminPassword = 'aim2024'; // Change this!
        
        this.init();
    }
    
    init() {
        this.createAdminPanel();
        this.createAdminToggle();
        this.createLoginModal();
        this.createImageModal();
        this.loadSavedContent();
        this.loadSavedImages();
        this.bindKeyboardShortcut();
    }
    
    // Create floating admin toggle button
    createAdminToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'admin-toggle';
        toggle.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
        `;
        toggle.title = 'Admin Panel (Ctrl+Shift+E)';
        toggle.addEventListener('click', () => this.showLoginModal());
        document.body.appendChild(toggle);
    }
    
    // Create login modal
    createLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'admin-login-modal';
        modal.innerHTML = `
            <div class="admin-login-content">
                <div class="admin-login-header">
                    <h3>🔐 Admin Login</h3>
                    <button class="admin-login-close">&times;</button>
                </div>
                <div class="admin-login-body">
                    <p>Voer het admin wachtwoord in om de live editor te activeren.</p>
                    <input type="password" class="admin-password-input" placeholder="Wachtwoord..." autocomplete="off">
                    <div class="admin-login-error"></div>
                </div>
                <div class="admin-login-footer">
                    <button class="admin-login-btn">Inloggen</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Event listeners
        const closeBtn = modal.querySelector('.admin-login-close');
        const loginBtn = modal.querySelector('.admin-login-btn');
        const passwordInput = modal.querySelector('.admin-password-input');
        const errorDiv = modal.querySelector('.admin-login-error');
        
        closeBtn.addEventListener('click', () => this.hideLoginModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.hideLoginModal();
        });
        
        loginBtn.addEventListener('click', () => {
            if (passwordInput.value === this.adminPassword) {
                this.hideLoginModal();
                this.toggleEditMode();
                passwordInput.value = '';
                errorDiv.textContent = '';
            } else {
                errorDiv.textContent = 'Onjuist wachtwoord!';
                passwordInput.classList.add('shake');
                setTimeout(() => passwordInput.classList.remove('shake'), 500);
            }
        });
        
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loginBtn.click();
        });
    }
    
    showLoginModal() {
        if (this.isEditMode) {
            this.toggleEditMode();
            return;
        }
        const modal = document.querySelector('.admin-login-modal');
        modal.classList.add('active');
        modal.querySelector('.admin-password-input').focus();
    }
    
    hideLoginModal() {
        const modal = document.querySelector('.admin-login-modal');
        modal.classList.remove('active');
    }
    
    // Create image edit modal
    createImageModal() {
        const modal = document.createElement('div');
        modal.className = 'admin-image-modal';
        modal.innerHTML = `
            <div class="admin-image-content">
                <div class="admin-image-header">
                    <h3>🖼️ Afbeelding Bewerken</h3>
                    <button class="admin-image-close">&times;</button>
                </div>
                <div class="admin-image-body">
                    <div class="image-preview-container">
                        <img class="image-preview" src="" alt="Preview">
                        <div class="image-overlay">
                            <span>Klik om nieuwe afbeelding te selecteren</span>
                        </div>
                    </div>
                    <input type="file" class="image-file-input" accept="image/*" hidden>
                    
                    <div class="image-tabs">
                        <button class="image-tab active" data-tab="source">Bron</button>
                        <button class="image-tab" data-tab="adjust">Aanpassen</button>
                        <button class="image-tab" data-tab="filters">Filters</button>
                    </div>
                    
                    <div class="image-tab-content active" data-tab="source">
                        <div class="image-option-group">
                            <label>Of voer een URL in:</label>
                            <input type="text" class="image-url-input" placeholder="https://example.com/image.jpg">
                        </div>
                        
                        <div class="image-option-group">
                            <label>Alt tekst (SEO):</label>
                            <input type="text" class="image-alt-input" placeholder="Beschrijving van de afbeelding">
                        </div>
                    </div>
                    
                    <div class="image-tab-content" data-tab="adjust">
                        <div class="image-slider-group">
                            <label>Breedte: <span class="slider-value" id="widthValue">100</span>%</label>
                            <input type="range" class="image-slider" id="imgWidth" min="25" max="150" value="100">
                        </div>
                        <div class="image-slider-group">
                            <label>Hoogte: <span class="slider-value" id="heightValue">auto</span></label>
                            <input type="range" class="image-slider" id="imgHeight" min="25" max="150" value="100">
                            <label class="checkbox-label">
                                <input type="checkbox" id="autoHeight" checked> Auto hoogte
                            </label>
                        </div>
                        <div class="image-slider-group">
                            <label>Object Fit:</label>
                            <select class="image-select" id="imgObjectFit">
                                <option value="cover">Cover (vullend)</option>
                                <option value="contain">Contain (passend)</option>
                                <option value="fill">Fill (uitrekken)</option>
                                <option value="none">None (origineel)</option>
                            </select>
                        </div>
                        <div class="image-slider-group">
                            <label>Object Positie:</label>
                            <select class="image-select" id="imgObjectPosition">
                                <option value="center">Midden</option>
                                <option value="top">Boven</option>
                                <option value="bottom">Onder</option>
                                <option value="left">Links</option>
                                <option value="right">Rechts</option>
                            </select>
                        </div>
                        <div class="image-slider-group">
                            <label>Rand Radius: <span class="slider-value" id="radiusValue">0</span>px</label>
                            <input type="range" class="image-slider" id="imgRadius" min="0" max="50" value="0">
                        </div>
                    </div>
                    
                    <div class="image-tab-content" data-tab="filters">
                        <div class="image-slider-group">
                            <label>Helderheid: <span class="slider-value" id="brightnessValue">100</span>%</label>
                            <input type="range" class="image-slider" id="imgBrightness" min="0" max="200" value="100">
                        </div>
                        <div class="image-slider-group">
                            <label>Contrast: <span class="slider-value" id="contrastValue">100</span>%</label>
                            <input type="range" class="image-slider" id="imgContrast" min="0" max="200" value="100">
                        </div>
                        <div class="image-slider-group">
                            <label>Saturatie: <span class="slider-value" id="saturateValue">100</span>%</label>
                            <input type="range" class="image-slider" id="imgSaturate" min="0" max="200" value="100">
                        </div>
                        <div class="image-slider-group">
                            <label>Blur: <span class="slider-value" id="blurValue">0</span>px</label>
                            <input type="range" class="image-slider" id="imgBlur" min="0" max="20" value="0">
                        </div>
                        <div class="image-slider-group">
                            <label>Grayscale: <span class="slider-value" id="grayscaleValue">0</span>%</label>
                            <input type="range" class="image-slider" id="imgGrayscale" min="0" max="100" value="0">
                        </div>
                        <button class="admin-btn admin-btn-reset-filters">Reset Filters</button>
                    </div>
                    
                    <div class="image-info">
                        <span class="image-dimensions"></span>
                        <span class="image-size"></span>
                    </div>
                </div>
                <div class="admin-image-footer">
                    <button class="admin-btn admin-btn-cancel">Annuleren</button>
                    <button class="admin-btn admin-btn-apply">Toepassen</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Store reference to current editing image
        this.currentEditingImage = null;
        this.currentImageStyles = {};
        
        // Event listeners
        const closeBtn = modal.querySelector('.admin-image-close');
        const cancelBtn = modal.querySelector('.admin-btn-cancel');
        const applyBtn = modal.querySelector('.admin-btn-apply');
        const fileInput = modal.querySelector('.image-file-input');
        const urlInput = modal.querySelector('.image-url-input');
        const previewContainer = modal.querySelector('.image-preview-container');
        const preview = modal.querySelector('.image-preview');
        
        closeBtn.addEventListener('click', () => this.hideImageModal());
        cancelBtn.addEventListener('click', () => this.hideImageModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.hideImageModal();
        });
        
        // Tab switching
        modal.querySelectorAll('.image-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                modal.querySelectorAll('.image-tab').forEach(t => t.classList.remove('active'));
                modal.querySelectorAll('.image-tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                modal.querySelector(`.image-tab-content[data-tab="${tab.dataset.tab}"]`).classList.add('active');
            });
        });
        
        // Slider bindings
        this.bindImageSliders(modal, preview);
        
        // Reset filters button
        modal.querySelector('.admin-btn-reset-filters').addEventListener('click', () => {
            this.resetImageFilters(modal, preview);
        });
        
        // Click preview to select file
        previewContainer.addEventListener('click', () => fileInput.click());
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.previewImageFile(file, preview, modal);
            }
        });
        
        // URL input change
        urlInput.addEventListener('input', (e) => {
            const url = e.target.value.trim();
            if (url) {
                preview.src = url;
                preview.onload = () => {
                    this.updateImageInfo(modal, preview);
                };
            }
        });
        
        // Apply button
        applyBtn.addEventListener('click', () => this.applyImageChange(modal));
        
        // Drag and drop
        previewContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            previewContainer.classList.add('drag-over');
        });
        
        previewContainer.addEventListener('dragleave', () => {
            previewContainer.classList.remove('drag-over');
        });
        
        previewContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            previewContainer.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.previewImageFile(file, preview, modal);
            }
        });
    }
    
    // Bind image adjustment sliders
    bindImageSliders(modal, preview) {
        const sliders = {
            imgWidth: { value: 'widthValue', unit: '%', style: 'width' },
            imgHeight: { value: 'heightValue', unit: '%', style: 'height' },
            imgRadius: { value: 'radiusValue', unit: 'px', style: 'borderRadius' },
            imgBrightness: { value: 'brightnessValue', unit: '%', filter: 'brightness' },
            imgContrast: { value: 'contrastValue', unit: '%', filter: 'contrast' },
            imgSaturate: { value: 'saturateValue', unit: '%', filter: 'saturate' },
            imgBlur: { value: 'blurValue', unit: 'px', filter: 'blur' },
            imgGrayscale: { value: 'grayscaleValue', unit: '%', filter: 'grayscale' }
        };
        
        Object.entries(sliders).forEach(([id, config]) => {
            const slider = modal.querySelector(`#${id}`);
            const valueEl = modal.querySelector(`#${config.value}`);
            
            if (slider) {
                slider.addEventListener('input', () => {
                    valueEl.textContent = slider.value;
                    this.updatePreviewStyles(modal, preview);
                });
            }
        });
        
        // Auto height checkbox
        const autoHeight = modal.querySelector('#autoHeight');
        const heightSlider = modal.querySelector('#imgHeight');
        const heightValue = modal.querySelector('#heightValue');
        
        autoHeight?.addEventListener('change', () => {
            if (autoHeight.checked) {
                heightSlider.disabled = true;
                heightValue.textContent = 'auto';
            } else {
                heightSlider.disabled = false;
                heightValue.textContent = heightSlider.value;
            }
            this.updatePreviewStyles(modal, preview);
        });
        
        // Object fit & position
        modal.querySelector('#imgObjectFit')?.addEventListener('change', () => {
            this.updatePreviewStyles(modal, preview);
        });
        
        modal.querySelector('#imgObjectPosition')?.addEventListener('change', () => {
            this.updatePreviewStyles(modal, preview);
        });
    }
    
    // Update preview with current styles
    updatePreviewStyles(modal, preview) {
        const width = modal.querySelector('#imgWidth').value;
        const height = modal.querySelector('#imgHeight').value;
        const autoHeight = modal.querySelector('#autoHeight').checked;
        const radius = modal.querySelector('#imgRadius').value;
        const objectFit = modal.querySelector('#imgObjectFit').value;
        const objectPosition = modal.querySelector('#imgObjectPosition').value;
        
        // Filters
        const brightness = modal.querySelector('#imgBrightness').value;
        const contrast = modal.querySelector('#imgContrast').value;
        const saturate = modal.querySelector('#imgSaturate').value;
        const blur = modal.querySelector('#imgBlur').value;
        const grayscale = modal.querySelector('#imgGrayscale').value;
        
        // Store current styles
        this.currentImageStyles = {
            width: `${width}%`,
            height: autoHeight ? 'auto' : `${height}%`,
            borderRadius: `${radius}px`,
            objectFit,
            objectPosition,
            filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blur}px) grayscale(${grayscale}%)`
        };
        
        // Apply to preview
        Object.assign(preview.style, this.currentImageStyles);
    }
    
    // Reset image filters to default
    resetImageFilters(modal, preview) {
        const defaults = {
            imgBrightness: 100,
            imgContrast: 100,
            imgSaturate: 100,
            imgBlur: 0,
            imgGrayscale: 0
        };
        
        Object.entries(defaults).forEach(([id, value]) => {
            const slider = modal.querySelector(`#${id}`);
            if (slider) {
                slider.value = value;
                const valueId = id.replace('img', '').toLowerCase() + 'Value';
                const valueEl = modal.querySelector(`#${valueId}`);
                if (valueEl) valueEl.textContent = value;
            }
        });
        
        this.updatePreviewStyles(modal, preview);
        this.showNotification('🔄 Filters gereset', 'info');
    }
    
    // Preview image file
    previewImageFile(file, preview, modal) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            this.updateImageInfo(modal, preview, file);
            modal.querySelector('.image-url-input').value = '';
        };
        reader.readAsDataURL(file);
    }
    
    // Update image info display
    updateImageInfo(modal, preview, file = null) {
        const dimensionsEl = modal.querySelector('.image-dimensions');
        const sizeEl = modal.querySelector('.image-size');
        
        preview.onload = () => {
            dimensionsEl.textContent = `${preview.naturalWidth} × ${preview.naturalHeight}px`;
        };
        
        if (file) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            sizeEl.textContent = `${sizeMB} MB`;
        } else {
            sizeEl.textContent = '';
        }
    }
    
    // Show image modal
    showImageModal(imgElement) {
        this.currentEditingImage = imgElement;
        const modal = document.querySelector('.admin-image-modal');
        const preview = modal.querySelector('.image-preview');
        const altInput = modal.querySelector('.image-alt-input');
        const urlInput = modal.querySelector('.image-url-input');
        
        // Set current values
        preview.src = imgElement.src;
        altInput.value = imgElement.alt || '';
        urlInput.value = '';
        
        // Load existing styles from element
        this.loadImageStyles(modal, imgElement);
        
        // Reset to first tab
        modal.querySelectorAll('.image-tab').forEach(t => t.classList.remove('active'));
        modal.querySelectorAll('.image-tab-content').forEach(c => c.classList.remove('active'));
        modal.querySelector('.image-tab[data-tab="source"]').classList.add('active');
        modal.querySelector('.image-tab-content[data-tab="source"]').classList.add('active');
        
        this.updateImageInfo(modal, preview);
        modal.classList.add('active');
    }
    
    // Load existing styles into modal
    loadImageStyles(modal, imgElement) {
        // Get computed styles
        const computed = window.getComputedStyle(imgElement);
        
        // Reset sliders to defaults first
        modal.querySelector('#imgWidth').value = 100;
        modal.querySelector('#widthValue').textContent = '100';
        modal.querySelector('#imgHeight').value = 100;
        modal.querySelector('#heightValue').textContent = 'auto';
        modal.querySelector('#autoHeight').checked = true;
        modal.querySelector('#imgHeight').disabled = true;
        modal.querySelector('#imgRadius').value = parseInt(computed.borderRadius) || 0;
        modal.querySelector('#radiusValue').textContent = parseInt(computed.borderRadius) || 0;
        modal.querySelector('#imgObjectFit').value = computed.objectFit || 'cover';
        modal.querySelector('#imgObjectPosition').value = computed.objectPosition?.split(' ')[0] || 'center';
        
        // Reset filters
        modal.querySelector('#imgBrightness').value = 100;
        modal.querySelector('#brightnessValue').textContent = '100';
        modal.querySelector('#imgContrast').value = 100;
        modal.querySelector('#contrastValue').textContent = '100';
        modal.querySelector('#imgSaturate').value = 100;
        modal.querySelector('#saturateValue').textContent = '100';
        modal.querySelector('#imgBlur').value = 0;
        modal.querySelector('#blurValue').textContent = '0';
        modal.querySelector('#imgGrayscale').value = 0;
        modal.querySelector('#grayscaleValue').textContent = '0';
        
        // Reset preview styles
        const preview = modal.querySelector('.image-preview');
        preview.style.cssText = '';
    }
    
    // Hide image modal
    hideImageModal() {
        const modal = document.querySelector('.admin-image-modal');
        modal.classList.remove('active');
        this.currentEditingImage = null;
        this.currentImageStyles = {};
    }
    
    // Apply image change
    applyImageChange(modal) {
        if (!this.currentEditingImage) return;
        
        const preview = modal.querySelector('.image-preview');
        const altInput = modal.querySelector('.image-alt-input');
        const imgElement = this.currentEditingImage;
        const editId = imgElement.dataset.imageEditId;
        
        // Store original if not stored
        if (!this.originalImages[editId]) {
            this.originalImages[editId] = {
                src: imgElement.src,
                alt: imgElement.alt,
                style: imgElement.getAttribute('style') || ''
            };
        }
        
        // Apply changes
        imgElement.src = preview.src;
        imgElement.alt = altInput.value;
        
        // Apply styles
        if (Object.keys(this.currentImageStyles).length > 0) {
            Object.assign(imgElement.style, this.currentImageStyles);
        }
        
        // Track change
        this.imageChanges[editId] = {
            original: this.originalImages[editId],
            current: {
                src: preview.src,
                alt: altInput.value
            },
            timestamp: new Date().toISOString()
        };
        
        // Mark as unsaved
        imgElement.closest('.editable-image-wrapper')?.classList.add('unsaved');
        
        this.updateStats();
        this.hideImageModal();
        this.showNotification('🖼️ Afbeelding gewijzigd!', 'success');
    }
    
    // Create the admin panel
    createAdminPanel() {
        const panel = document.createElement('div');
        panel.className = 'admin-panel';
        panel.innerHTML = `
            <div class="admin-panel-header">
                <div class="admin-panel-title">
                    <span class="admin-icon">✏️</span>
                    <span>Live Editor</span>
                </div>
                <div class="admin-panel-status">
                    <span class="status-dot"></span>
                    <span class="status-text">Actief</span>
                </div>
            </div>
            <div class="admin-panel-body">
                <div class="admin-info">
                    <p>Klik op tekst of afbeelding om te bewerken</p>
                    <small>Wijzigingen worden lokaal opgeslagen</small>
                </div>
                <div class="admin-stats">
                    <div class="stat">
                        <span class="stat-value" id="changesCount">0</span>
                        <span class="stat-label">Wijzigingen</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value" id="editableCount">0</span>
                        <span class="stat-label">Bewerkbaar</span>
                    </div>
                </div>
                
                <div class="admin-add-section">
                    <h4>➕ Element Toevoegen</h4>
                    <div class="add-element-buttons">
                        <button class="add-element-btn" data-type="heading" title="Koptekst">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 12h8M4 18V6M12 18V6M20 7v11M16 7h8"/>
                            </svg>
                            <span>Koptekst</span>
                        </button>
                        <button class="add-element-btn" data-type="paragraph" title="Paragraaf">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <line x1="3" y1="12" x2="21" y2="12"/>
                                <line x1="3" y1="18" x2="15" y2="18"/>
                            </svg>
                            <span>Paragraaf</span>
                        </button>
                        <button class="add-element-btn" data-type="image" title="Afbeelding">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21,15 16,10 5,21"/>
                            </svg>
                            <span>Afbeelding</span>
                        </button>
                        <button class="add-element-btn" data-type="button" title="Knop">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="8" width="18" height="8" rx="2"/>
                                <line x1="8" y1="12" x2="16" y2="12"/>
                            </svg>
                            <span>Knop</span>
                        </button>
                        <button class="add-element-btn" data-type="divider" title="Scheidingslijn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="3" y1="12" x2="21" y2="12"/>
                            </svg>
                            <span>Lijn</span>
                        </button>
                        <button class="add-element-btn" data-type="card" title="Card">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <line x1="3" y1="9" x2="21" y2="9"/>
                            </svg>
                            <span>Card</span>
                        </button>
                    </div>
                </div>
                
                <div class="admin-section-title">📦 Custom Blokken</div>
                <div class="admin-blocks-grid">
                    <button class="add-block-btn" data-block="hero" title="Hero sectie">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="3" width="20" height="14" rx="2"/>
                            <line x1="8" y1="21" x2="16" y2="21"/>
                            <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                        <span>Hero</span>
                    </button>
                    <button class="add-block-btn" data-block="cta" title="Call-to-Action">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22,4 12,14.01 9,11.01"/>
                        </svg>
                        <span>CTA</span>
                    </button>
                    <button class="add-block-btn" data-block="features" title="Features Grid">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="7" height="7"/>
                            <rect x="14" y="3" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/>
                            <rect x="3" y="14" width="7" height="7"/>
                        </svg>
                        <span>Features</span>
                    </button>
                    <button class="add-block-btn" data-block="testimonial" title="Testimonial">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        <span>Quote</span>
                    </button>
                    <button class="add-block-btn" data-block="stats" title="Statistieken">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="20" x2="18" y2="10"/>
                            <line x1="12" y1="20" x2="12" y2="4"/>
                            <line x1="6" y1="20" x2="6" y2="14"/>
                        </svg>
                        <span>Stats</span>
                    </button>
                    <button class="add-block-btn" data-block="contact" title="Contact formulier">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        <span>Contact</span>
                    </button>
                    <button class="add-block-btn" data-block="gallery" title="Afbeeldingen gallerij">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21,15 16,10 5,21"/>
                        </svg>
                        <span>Gallerij</span>
                    </button>
                    <button class="add-block-btn" data-block="video" title="Video sectie">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5,3 19,12 5,21"/>
                        </svg>
                        <span>Video</span>
                    </button>
                </div>
                
                <div class="admin-drag-section">
                    <button class="admin-btn-drag-mode" id="toggleDragMode">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 9l-3 3 3 3"/>
                            <path d="M9 5l3-3 3 3"/>
                            <path d="M15 19l-3 3-3-3"/>
                            <path d="M19 9l3 3-3 3"/>
                            <path d="M2 12h20"/>
                            <path d="M12 2v20"/>
                        </svg>
                        <span>🎨 Drag & Drop Editor</span>
                    </button>
                    <small>Versleep, vergroot en pas alles aan</small>
                </div>
                
                <div class="admin-section-title">📊 Optimalisatie & Analytics</div>
                <div class="admin-optimization-grid">
                    <button class="optimization-btn" data-action="analytics" title="Google Analytics 4 instellen">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 20V10"/>
                            <path d="M12 20V4"/>
                            <path d="M6 20v-6"/>
                        </svg>
                        <span>Analytics</span>
                        <small>GA4 Tracking</small>
                    </button>
                    <button class="optimization-btn" data-action="heatmap" title="Heatmap tracking instellen">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <circle cx="12" cy="12" r="6"/>
                            <circle cx="12" cy="12" r="2"/>
                        </svg>
                        <span>Heatmaps</span>
                        <small>Microsoft Clarity</small>
                    </button>
                    <button class="optimization-btn" data-action="conversion" title="Conversie tracking">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span>Conversies</span>
                        <small>Form tracking</small>
                    </button>
                    <button class="optimization-btn" data-action="bundle-css" title="CSS bestanden bundelen">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <path d="M8 7h8"/>
                            <path d="M8 11h8"/>
                            <path d="M8 15h5"/>
                        </svg>
                        <span>CSS Bundle</span>
                        <small>10+ bestanden</small>
                    </button>
                    <button class="optimization-btn" data-action="add-video" title="Video toevoegen aan project">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5,3 19,12 5,21"/>
                        </svg>
                        <span>Video</span>
                        <small>Project media</small>
                    </button>
                    <button class="optimization-btn" data-action="performance" title="Performance check">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                        </svg>
                        <span>Snelheid</span>
                        <small>Performance</small>
                    </button>
                </div>
            </div>
            <div class="admin-panel-actions">
                <button class="admin-btn admin-btn-save" title="Wijzigingen opslaan">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                        <polyline points="17,21 17,13 7,13 7,21"/>
                        <polyline points="7,3 7,8 15,8"/>
                    </svg>
                    <span>Opslaan</span>
                </button>
                <button class="admin-btn admin-btn-publish" title="Publiceren naar GitHub">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                    </svg>
                    <span>Publiceren</span>
                </button>
                <button class="admin-btn admin-btn-share" title="Deel HTML bestand">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="18" cy="5" r="3"/>
                        <circle cx="6" cy="12" r="3"/>
                        <circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    <span>Delen</span>
                </button>
                <button class="admin-btn admin-btn-reset" title="Alle wijzigingen ongedaan maken">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                    </svg>
                    <span>Reset</span>
                </button>
                <button class="admin-btn admin-btn-export" title="Wijzigingen exporteren als JSON">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span>Export</span>
                </button>
                <button class="admin-btn admin-btn-close" title="Editor sluiten">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    <span>Sluiten</span>
                </button>
            </div>
        `;
        document.body.appendChild(panel);
        
        // Bind button events
        panel.querySelector('.admin-btn-save').addEventListener('click', () => this.saveChanges());
        panel.querySelector('.admin-btn-publish').addEventListener('click', () => this.publishToGitHub());
        panel.querySelector('.admin-btn-share').addEventListener('click', () => this.shareHTML());
        panel.querySelector('.admin-btn-reset').addEventListener('click', () => this.resetChanges());
        panel.querySelector('.admin-btn-export').addEventListener('click', () => this.exportChanges());
        panel.querySelector('.admin-btn-close').addEventListener('click', () => this.toggleEditMode());
        
        // Bind add element buttons
        panel.querySelectorAll('.add-element-btn').forEach(btn => {
            btn.addEventListener('click', () => this.addElement(btn.dataset.type));
        });
        
        // Bind add block buttons
        panel.querySelectorAll('.add-block-btn').forEach(btn => {
            btn.addEventListener('click', () => this.addBlock(btn.dataset.block));
        });
        
        // Bind drag mode button
        panel.querySelector('#toggleDragMode').addEventListener('click', () => {
            if (window.dragEditor) {
                window.dragEditor.toggleDragMode(true);
                this.showNotification('🎨 Drag & Drop Editor geactiveerd!', 'success');
            }
        });
        
        // Bind optimization buttons
        panel.querySelectorAll('.optimization-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleOptimization(btn.dataset.action));
        });
    }
    
    // Handle optimization actions
    handleOptimization(action) {
        switch(action) {
            case 'analytics':
                this.showAnalyticsModal();
                break;
            case 'heatmap':
                this.showHeatmapModal();
                break;
            case 'conversion':
                this.showConversionModal();
                break;
            case 'bundle-css':
                this.showCSSBundleModal();
                break;
            case 'add-video':
                this.showVideoModal();
                break;
            case 'performance':
                this.showPerformanceCheck();
                break;
        }
    }
    
    // Analytics Modal
    showAnalyticsModal() {
        const modal = this.createOptimizationModal('analytics', '📊 Google Analytics 4', `
            <div class="opt-modal-intro">
                <p>Voeg Google Analytics 4 toe om bezoekersgedrag te meten.</p>
            </div>
            <div class="opt-form-group">
                <label>GA4 Measurement ID</label>
                <input type="text" id="ga4-id" placeholder="G-XXXXXXXXXX" class="opt-input">
                <small>Vind je ID in Google Analytics → Admin → Data Streams</small>
            </div>
            <div class="opt-form-group">
                <label>Track Events</label>
                <div class="opt-checkbox-group">
                    <label><input type="checkbox" checked> Paginaweergaven</label>
                    <label><input type="checkbox" checked> Klik events</label>
                    <label><input type="checkbox" checked> Scroll diepte</label>
                    <label><input type="checkbox" checked> Formulier submits</label>
                </div>
            </div>
            <div class="opt-code-preview">
                <label>Code Preview:</label>
                <pre><code>&lt;!-- Google Analytics 4 --&gt;
&lt;script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"&gt;&lt;/script&gt;
&lt;script&gt;
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
&lt;/script&gt;</code></pre>
            </div>
        `);
        
        modal.querySelector('.opt-modal-apply').addEventListener('click', () => {
            const gaId = modal.querySelector('#ga4-id').value.trim();
            if (gaId && gaId.startsWith('G-')) {
                this.installGA4(gaId);
                this.closeOptimizationModal(modal);
            } else {
                this.showNotification('⚠️ Voer een geldig GA4 ID in (G-XXXXXXXXXX)', 'error');
            }
        });
    }
    
    // Heatmap Modal
    showHeatmapModal() {
        const modal = this.createOptimizationModal('heatmap', '🎯 Heatmaps & Sessie Recordings', `
            <div class="opt-modal-intro">
                <p>Zie waar bezoekers klikken en hoe ze door je site navigeren.</p>
            </div>
            <div class="opt-tabs">
                <button class="opt-tab active" data-provider="clarity">Microsoft Clarity (Gratis)</button>
                <button class="opt-tab" data-provider="hotjar">Hotjar</button>
            </div>
            <div class="opt-tab-content active" data-provider="clarity">
                <div class="opt-form-group">
                    <label>Clarity Project ID</label>
                    <input type="text" id="clarity-id" placeholder="xxxxxxxxxx" class="opt-input">
                    <small>Gratis tool van Microsoft. <a href="https://clarity.microsoft.com" target="_blank">Maak account aan →</a></small>
                </div>
                <div class="opt-features">
                    <div class="opt-feature">✓ Heatmaps</div>
                    <div class="opt-feature">✓ Session recordings</div>
                    <div class="opt-feature">✓ Scroll maps</div>
                    <div class="opt-feature">✓ 100% Gratis</div>
                </div>
            </div>
            <div class="opt-tab-content" data-provider="hotjar">
                <div class="opt-form-group">
                    <label>Hotjar Site ID</label>
                    <input type="text" id="hotjar-id" placeholder="1234567" class="opt-input">
                    <small><a href="https://hotjar.com" target="_blank">Hotjar.com →</a> (Beperkt gratis plan)</small>
                </div>
            </div>
        `);
        
        // Tab switching
        modal.querySelectorAll('.opt-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                modal.querySelectorAll('.opt-tab').forEach(t => t.classList.remove('active'));
                modal.querySelectorAll('.opt-tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                modal.querySelector(`.opt-tab-content[data-provider="${tab.dataset.provider}"]`).classList.add('active');
            });
        });
        
        modal.querySelector('.opt-modal-apply').addEventListener('click', () => {
            const activeTab = modal.querySelector('.opt-tab.active').dataset.provider;
            if (activeTab === 'clarity') {
                const clarityId = modal.querySelector('#clarity-id').value.trim();
                if (clarityId) {
                    this.installClarity(clarityId);
                    this.closeOptimizationModal(modal);
                } else {
                    this.showNotification('⚠️ Voer een Clarity Project ID in', 'error');
                }
            } else {
                const hotjarId = modal.querySelector('#hotjar-id').value.trim();
                if (hotjarId) {
                    this.installHotjar(hotjarId);
                    this.closeOptimizationModal(modal);
                } else {
                    this.showNotification('⚠️ Voer een Hotjar Site ID in', 'error');
                }
            }
        });
    }
    
    // Conversion Tracking Modal
    showConversionModal() {
        const modal = this.createOptimizationModal('conversion', '✓ Conversie Tracking', `
            <div class="opt-modal-intro">
                <p>Track wanneer bezoekers belangrijke acties uitvoeren.</p>
            </div>
            <div class="opt-form-group">
                <label>Te tracken conversies:</label>
                <div class="opt-checkbox-group">
                    <label><input type="checkbox" id="conv-form" checked> Contactformulier verzonden</label>
                    <label><input type="checkbox" id="conv-phone" checked> Telefoonnummer geklikt</label>
                    <label><input type="checkbox" id="conv-email" checked> E-mail geklikt</label>
                    <label><input type="checkbox" id="conv-cta" checked> CTA button geklikt</label>
                    <label><input type="checkbox" id="conv-download"> PDF/bestand gedownload</label>
                </div>
            </div>
            <div class="opt-info-box">
                <strong>💡 Tip:</strong> Zorg dat Google Analytics 4 eerst is geïnstalleerd voor conversie tracking.
            </div>
        `);
        
        modal.querySelector('.opt-modal-apply').addEventListener('click', () => {
            this.installConversionTracking({
                form: modal.querySelector('#conv-form').checked,
                phone: modal.querySelector('#conv-phone').checked,
                email: modal.querySelector('#conv-email').checked,
                cta: modal.querySelector('#conv-cta').checked,
                download: modal.querySelector('#conv-download').checked
            });
            this.closeOptimizationModal(modal);
        });
    }
    
    // CSS Bundle Modal
    showCSSBundleModal() {
        const cssFiles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
            .map(link => link.href.split('/').pop())
            .filter(name => name && !name.includes('fonts.googleapis'));
        
        const modal = this.createOptimizationModal('css-bundle', '📦 CSS Bundelen', `
            <div class="opt-modal-intro">
                <p>Je hebt momenteel <strong>${cssFiles.length} CSS bestanden</strong>. Bundelen verbetert laadtijd.</p>
            </div>
            <div class="opt-form-group">
                <label>Huidige CSS bestanden:</label>
                <div class="opt-file-list">
                    ${cssFiles.map(f => `<div class="opt-file-item"><span>📄</span> ${f}</div>`).join('')}
                </div>
            </div>
            <div class="opt-info-box warning">
                <strong>⚠️ Let op:</strong> CSS bundelen vereist een build process. Dit genereert instructies voor handmatige implementatie.
            </div>
            <div class="opt-form-group">
                <label>Bundle opties:</label>
                <div class="opt-checkbox-group">
                    <label><input type="checkbox" id="css-minify" checked> Minify CSS (verkleinen)</label>
                    <label><input type="checkbox" id="css-critical" checked> Critical CSS extraheren</label>
                    <label><input type="checkbox" id="css-unused"> Unused CSS verwijderen</label>
                </div>
            </div>
        `);
        
        modal.querySelector('.opt-modal-apply').addEventListener('click', () => {
            this.generateCSSBundleInstructions({
                files: cssFiles,
                minify: modal.querySelector('#css-minify').checked,
                critical: modal.querySelector('#css-critical').checked,
                unused: modal.querySelector('#css-unused').checked
            });
            this.closeOptimizationModal(modal);
        });
    }
    
    // Video Modal
    showVideoModal() {
        const modal = this.createOptimizationModal('video', '🎬 Video Toevoegen', `
            <div class="opt-modal-intro">
                <p>Voeg een video toe aan een project of pagina.</p>
            </div>
            <div class="opt-form-group">
                <label>Video Bron</label>
                <div class="opt-radio-group">
                    <label><input type="radio" name="video-source" value="youtube" checked> YouTube</label>
                    <label><input type="radio" name="video-source" value="vimeo"> Vimeo</label>
                    <label><input type="radio" name="video-source" value="local"> Lokaal bestand</label>
                </div>
            </div>
            <div class="opt-form-group">
                <label>Video URL of ID</label>
                <input type="text" id="video-url" placeholder="https://youtube.com/watch?v=... of video ID" class="opt-input">
            </div>
            <div class="opt-form-group">
                <label>Titel / Alt tekst</label>
                <input type="text" id="video-title" placeholder="Freesrobot in actie - Tunnel project" class="opt-input">
            </div>
            <div class="opt-form-group">
                <label>Toevoegen aan:</label>
                <select id="video-location" class="opt-select">
                    <option value="freesrobot">Projecten → Freesrobot</option>
                    <option value="current">Huidige pagina</option>
                    <option value="custom">Aangepaste locatie</option>
                </select>
            </div>
            <div class="opt-form-group">
                <label>Weergave stijl:</label>
                <select id="video-style" class="opt-select">
                    <option value="embedded">Embedded (in pagina)</option>
                    <option value="lightbox">Lightbox (popup)</option>
                    <option value="background">Background video (muted)</option>
                </select>
            </div>
        `);
        
        modal.querySelector('.opt-modal-apply').addEventListener('click', () => {
            const videoUrl = modal.querySelector('#video-url').value.trim();
            const videoTitle = modal.querySelector('#video-title').value.trim();
            const location = modal.querySelector('#video-location').value;
            const style = modal.querySelector('#video-style').value;
            const source = modal.querySelector('input[name="video-source"]:checked').value;
            
            if (videoUrl) {
                this.addVideoToPage({ url: videoUrl, title: videoTitle, location, style, source });
                this.closeOptimizationModal(modal);
            } else {
                this.showNotification('⚠️ Voer een video URL in', 'error');
            }
        });
    }
    
    // Performance Check
    showPerformanceCheck() {
        const modal = this.createOptimizationModal('performance', '⚡ Performance Check', `
            <div class="opt-modal-intro">
                <p>Analyseer de prestaties van deze pagina.</p>
            </div>
            <div class="opt-loading">
                <div class="opt-spinner"></div>
                <p>Analyseren...</p>
            </div>
            <div class="opt-results" style="display:none;">
                <div class="opt-score-container">
                    <div class="opt-score" id="perf-score">--</div>
                    <span>Performance Score</span>
                </div>
                <div class="opt-metrics">
                    <div class="opt-metric">
                        <span class="opt-metric-label">DOM Elementen</span>
                        <span class="opt-metric-value" id="metric-dom">--</span>
                    </div>
                    <div class="opt-metric">
                        <span class="opt-metric-label">CSS Bestanden</span>
                        <span class="opt-metric-value" id="metric-css">--</span>
                    </div>
                    <div class="opt-metric">
                        <span class="opt-metric-label">JS Bestanden</span>
                        <span class="opt-metric-value" id="metric-js">--</span>
                    </div>
                    <div class="opt-metric">
                        <span class="opt-metric-label">Afbeeldingen</span>
                        <span class="opt-metric-value" id="metric-img">--</span>
                    </div>
                    <div class="opt-metric">
                        <span class="opt-metric-label">Lazy Loading</span>
                        <span class="opt-metric-value" id="metric-lazy">--</span>
                    </div>
                </div>
                <div class="opt-recommendations" id="perf-recommendations"></div>
            </div>
        `);
        
        // Run performance check
        setTimeout(() => {
            this.runPerformanceCheck(modal);
        }, 500);
        
        modal.querySelector('.opt-modal-apply').textContent = 'Sluiten';
        modal.querySelector('.opt-modal-apply').addEventListener('click', () => {
            this.closeOptimizationModal(modal);
        });
    }
    
    // Create optimization modal template
    createOptimizationModal(type, title, content) {
        const existingModal = document.querySelector('.opt-modal');
        if (existingModal) existingModal.remove();
        
        const modal = document.createElement('div');
        modal.className = 'opt-modal';
        modal.innerHTML = `
            <div class="opt-modal-content">
                <div class="opt-modal-header">
                    <h3>${title}</h3>
                    <button class="opt-modal-close">&times;</button>
                </div>
                <div class="opt-modal-body">
                    ${content}
                </div>
                <div class="opt-modal-footer">
                    <button class="opt-modal-cancel">Annuleren</button>
                    <button class="opt-modal-apply">Toepassen</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Close handlers
        modal.querySelector('.opt-modal-close').addEventListener('click', () => this.closeOptimizationModal(modal));
        modal.querySelector('.opt-modal-cancel').addEventListener('click', () => this.closeOptimizationModal(modal));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeOptimizationModal(modal);
        });
        
        setTimeout(() => modal.classList.add('active'), 10);
        return modal;
    }
    
    closeOptimizationModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
    
    // Installation functions
    installGA4(gaId) {
        const code = `
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${gaId}');
</script>`;
        
        localStorage.setItem('aim_ga4_code', code);
        localStorage.setItem('aim_ga4_id', gaId);
        this.showNotification('✅ GA4 code opgeslagen! Voeg toe aan <head> van alle pagina\'s.', 'success');
        
        // Show code to copy
        this.showCodeCopyModal('Google Analytics 4', code);
    }
    
    installClarity(clarityId) {
        const code = `
<!-- Microsoft Clarity -->
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${clarityId}");
</script>`;
        
        localStorage.setItem('aim_clarity_code', code);
        localStorage.setItem('aim_clarity_id', clarityId);
        this.showNotification('✅ Clarity code opgeslagen!', 'success');
        this.showCodeCopyModal('Microsoft Clarity', code);
    }
    
    installHotjar(hotjarId) {
        const code = `
<!-- Hotjar Tracking -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${hotjarId},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>`;
        
        localStorage.setItem('aim_hotjar_code', code);
        this.showNotification('✅ Hotjar code opgeslagen!', 'success');
        this.showCodeCopyModal('Hotjar', code);
    }
    
    installConversionTracking(options) {
        let code = `
<!-- Conversie Tracking -->
<script>
document.addEventListener('DOMContentLoaded', function() {`;
        
        if (options.form) {
            code += `
    // Form submit tracking
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'conversion',
                    'event_label': this.id || 'contact_form'
                });
            }
        });
    });`;
        }
        
        if (options.phone) {
            code += `
    // Phone click tracking
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_click', {
                    'event_category': 'conversion',
                    'event_label': this.href
                });
            }
        });
    });`;
        }
        
        if (options.email) {
            code += `
    // Email click tracking
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'email_click', {
                    'event_category': 'conversion',
                    'event_label': this.href
                });
            }
        });
    });`;
        }
        
        if (options.cta) {
            code += `
    // CTA button tracking
    document.querySelectorAll('.btn-primary, .cta-button, [class*="cta"]').forEach(btn => {
        btn.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    'event_category': 'conversion',
                    'event_label': this.textContent.trim()
                });
            }
        });
    });`;
        }
        
        code += `
});
</script>`;
        
        localStorage.setItem('aim_conversion_code', code);
        this.showNotification('✅ Conversie tracking code opgeslagen!', 'success');
        this.showCodeCopyModal('Conversie Tracking', code);
    }
    
    generateCSSBundleInstructions(options) {
        const instructions = `
# CSS Bundle Instructies

## Huidige bestanden (${options.files.length}):
${options.files.map(f => `- ${f}`).join('\n')}

## Aanbevolen aanpak:

### Optie 1: Handmatig bundelen
1. Combineer alle CSS in één bestand: \`css/bundle.css\`
2. Verwijder individuele <link> tags
3. Voeg toe: \`<link rel="stylesheet" href="css/bundle.css">\`

### Optie 2: Build tool (aanbevolen)
\`\`\`bash
# Installeer PostCSS
npm install postcss postcss-cli postcss-import cssnano

# Maak postcss.config.js
module.exports = {
  plugins: [
    require('postcss-import'),
    ${options.minify ? "require('cssnano')({ preset: 'default' })" : ''}
  ]
}

# Bundle command
npx postcss css/main.css -o css/bundle.min.css
\`\`\`

${options.critical ? `### Critical CSS
Gebruik https://www.npmjs.com/package/critical voor above-the-fold CSS.` : ''}

${options.unused ? `### Unused CSS
Gebruik PurgeCSS: https://purgecss.com/` : ''}
`;
        
        this.showNotification('📋 CSS bundle instructies gegenereerd!', 'success');
        this.showCodeCopyModal('CSS Bundle Instructies', instructions, 'markdown');
    }
    
    addVideoToPage(options) {
        let embedCode = '';
        
        if (options.source === 'youtube') {
            const videoId = this.extractYouTubeId(options.url);
            if (options.style === 'embedded') {
                embedCode = `
<div class="video-container">
    <iframe 
        src="https://www.youtube.com/embed/${videoId}" 
        title="${options.title}"
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
    </iframe>
</div>`;
            } else if (options.style === 'lightbox') {
                embedCode = `
<a href="https://www.youtube.com/watch?v=${videoId}" class="video-lightbox" data-title="${options.title}">
    <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" alt="${options.title}">
    <span class="play-button">▶</span>
</a>`;
            }
        } else if (options.source === 'vimeo') {
            const vimeoId = options.url.match(/\d+/)?.[0] || options.url;
            embedCode = `
<div class="video-container">
    <iframe 
        src="https://player.vimeo.com/video/${vimeoId}" 
        title="${options.title}"
        frameborder="0" 
        allow="autoplay; fullscreen; picture-in-picture" 
        allowfullscreen>
    </iframe>
</div>`;
        } else {
            embedCode = `
<video controls class="video-player">
    <source src="${options.url}" type="video/mp4">
    Je browser ondersteunt geen video.
</video>`;
        }
        
        const cssCode = `
/* Video Container Styles */
.video-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    height: 0;
    overflow: hidden;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    margin: 24px 0;
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.video-lightbox {
    position: relative;
    display: block;
    border-radius: 16px;
    overflow: hidden;
}

.video-lightbox img {
    width: 100%;
    transition: transform 0.3s ease;
}

.video-lightbox:hover img {
    transform: scale(1.02);
}

.video-lightbox .play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    background: rgba(0,102,204,0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: white;
    transition: all 0.3s ease;
}

.video-lightbox:hover .play-button {
    background: #0066CC;
    transform: translate(-50%, -50%) scale(1.1);
}`;
        
        localStorage.setItem('aim_video_html', embedCode);
        localStorage.setItem('aim_video_css', cssCode);
        
        this.showNotification('🎬 Video code gegenereerd!', 'success');
        this.showCodeCopyModal('Video Embed Code', `<!-- HTML -->\n${embedCode}\n\n<!-- CSS -->\n${cssCode}`, 'html');
    }
    
    extractYouTubeId(url) {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : url;
    }
    
    runPerformanceCheck(modal) {
        const domElements = document.querySelectorAll('*').length;
        const cssFiles = document.querySelectorAll('link[rel="stylesheet"]').length;
        const jsFiles = document.querySelectorAll('script[src]').length;
        const images = document.querySelectorAll('img').length;
        const lazyImages = document.querySelectorAll('img[loading="lazy"]').length;
        
        // Calculate score
        let score = 100;
        if (domElements > 1500) score -= 15;
        else if (domElements > 1000) score -= 10;
        if (cssFiles > 5) score -= 10;
        if (jsFiles > 5) score -= 10;
        if (images > 20 && lazyImages < images * 0.5) score -= 15;
        
        // Update UI
        modal.querySelector('.opt-loading').style.display = 'none';
        modal.querySelector('.opt-results').style.display = 'block';
        
        const scoreEl = modal.querySelector('#perf-score');
        scoreEl.textContent = score;
        scoreEl.className = 'opt-score ' + (score >= 80 ? 'good' : score >= 60 ? 'medium' : 'poor');
        
        modal.querySelector('#metric-dom').textContent = domElements;
        modal.querySelector('#metric-css').textContent = cssFiles;
        modal.querySelector('#metric-js').textContent = jsFiles;
        modal.querySelector('#metric-img').textContent = images;
        modal.querySelector('#metric-lazy').textContent = `${lazyImages}/${images}`;
        
        // Recommendations
        let recommendations = [];
        if (cssFiles > 5) recommendations.push('📦 Bundle CSS bestanden voor snellere laadtijd');
        if (images > 10 && lazyImages < images * 0.8) recommendations.push('🖼️ Voeg lazy loading toe aan meer afbeeldingen');
        if (domElements > 1000) recommendations.push('🔧 Verminder DOM complexiteit');
        if (!document.querySelector('link[rel="preconnect"]')) recommendations.push('🔗 Voeg preconnect toe voor externe resources');
        
        const recEl = modal.querySelector('#perf-recommendations');
        if (recommendations.length > 0) {
            recEl.innerHTML = '<h4>Aanbevelingen:</h4><ul>' + 
                recommendations.map(r => `<li>${r}</li>`).join('') + '</ul>';
        } else {
            recEl.innerHTML = '<p class="opt-success">✅ Geen kritieke problemen gevonden!</p>';
        }
    }
    
    showCodeCopyModal(title, code, type = 'html') {
        const modal = document.createElement('div');
        modal.className = 'opt-modal code-modal';
        modal.innerHTML = `
            <div class="opt-modal-content">
                <div class="opt-modal-header">
                    <h3>📋 ${title} - Code</h3>
                    <button class="opt-modal-close">&times;</button>
                </div>
                <div class="opt-modal-body">
                    <p>Kopieer onderstaande code en voeg toe aan je HTML:</p>
                    <pre class="code-block"><code>${this.escapeHtml(code)}</code></pre>
                </div>
                <div class="opt-modal-footer">
                    <button class="opt-modal-copy">📋 Kopieer naar klembord</button>
                    <button class="opt-modal-close-btn">Sluiten</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('.opt-modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.opt-modal-close-btn').addEventListener('click', () => modal.remove());
        modal.querySelector('.opt-modal-copy').addEventListener('click', () => {
            navigator.clipboard.writeText(code).then(() => {
                this.showNotification('📋 Code gekopieerd!', 'success');
            });
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Keyboard shortcut (Ctrl+Shift+E)
    bindKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'E') {
                e.preventDefault();
                if (this.isEditMode) {
                    this.toggleEditMode();
                } else {
                    this.showLoginModal();
                }
            }
            // Escape to close edit mode
            if (e.key === 'Escape' && this.isEditMode) {
                this.toggleEditMode();
            }
        });
    }
    
    // Toggle edit mode
    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        document.body.classList.toggle('admin-edit-mode', this.isEditMode);
        document.querySelector('.admin-panel').classList.toggle('active', this.isEditMode);
        document.querySelector('.admin-toggle').classList.toggle('active', this.isEditMode);
        
        if (this.isEditMode) {
            this.enableEditing();
            this.enableImageEditing();
            this.showNotification('✏️ Edit mode geactiveerd', 'success');
        } else {
            this.disableEditing();
            this.disableImageEditing();
            this.showNotification('👁️ View mode geactiveerd', 'info');
        }
    }
    
    // Enable image editing
    enableImageEditing() {
        // More comprehensive selectors to catch ALL images
        const images = document.querySelectorAll('img');
        
        images.forEach((img, index) => {
            // Skip admin elements and preview images only
            if (img.closest('.admin-panel') || 
                img.closest('.admin-login-modal') || 
                img.closest('.admin-image-modal') ||
                img.closest('.add-element-modal') ||
                img.classList.contains('image-preview') ||
                img.classList.contains('new-image-preview') ||
                img.classList.contains('admin-img')) return;
            
            // Skip tiny icons (but allow images that haven't loaded yet)
            if (img.complete && img.naturalWidth > 0 && img.naturalWidth < 30) return;
            
            // Skip if already wrapped
            if (img.closest('.editable-image-wrapper')) {
                // Just make sure overlay is visible
                const overlay = img.closest('.editable-image-wrapper').querySelector('.image-edit-overlay');
                if (overlay) overlay.style.display = '';
                return;
            }
            
            // Generate unique ID
            if (!img.dataset.imageEditId) {
                img.dataset.imageEditId = `img-${index}-${Date.now()}`;
            }
            
            // Store original
            if (!this.originalImages[img.dataset.imageEditId]) {
                this.originalImages[img.dataset.imageEditId] = {
                    src: img.src,
                    alt: img.alt,
                    style: img.getAttribute('style') || ''
                };
            }
            
            // Get parent element to preserve layout
            const parent = img.parentNode;
            const parentStyles = window.getComputedStyle(parent);
            
            // Create wrapper that inherits parent's display context
            const wrapper = document.createElement('div');
            wrapper.className = 'editable-image-wrapper';
            
            // Copy relevant styles from image's container
            wrapper.style.position = 'relative';
            wrapper.style.display = parentStyles.display === 'flex' ? 'flex' : 'block';
            wrapper.style.width = '100%';
            wrapper.style.height = '100%';
            
            // Insert wrapper
            parent.insertBefore(wrapper, img);
            wrapper.appendChild(img);
            
            // Create always-visible edit badge
            const badge = document.createElement('div');
            badge.className = 'image-edit-badge';
            badge.innerHTML = `
                <svg viewBox="0 0 24 24" stroke-width="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
            `;
            badge.title = 'Afbeelding bewerken';
            badge.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.showImageModal(img);
            });
            wrapper.appendChild(badge);
            
            // Create edit overlay (shown on hover)
            const overlay = document.createElement('div');
            overlay.className = 'image-edit-overlay';
            overlay.innerHTML = `
                <div class="image-edit-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    <span>Bewerken</span>
                </div>
                <div class="image-edit-actions">
                    <button class="img-action-btn img-replace" title="Vervangen">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21,15 16,10 5,21"/>
                        </svg>
                    </button>
                    <button class="img-action-btn img-url" title="URL invoeren">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                        </svg>
                    </button>
                    <button class="img-action-btn img-reset" title="Reset naar origineel">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/>
                            <path d="M3 3v5h5"/>
                        </svg>
                    </button>
                </div>
            `;
            wrapper.appendChild(overlay);
            
            // Click to open modal
            overlay.querySelector('.image-edit-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.showImageModal(img);
            });
            
            // Replace button - direct file select
            overlay.querySelector('.img-replace').addEventListener('click', (e) => {
                e.stopPropagation();
                this.quickReplaceImage(img);
            });
            
            // URL button
            overlay.querySelector('.img-url').addEventListener('click', (e) => {
                e.stopPropagation();
                this.quickUrlImage(img);
            });
            
            // Reset button
            overlay.querySelector('.img-reset').addEventListener('click', (e) => {
                e.stopPropagation();
                this.resetImage(img);
            });
            
            this.editableImages.push(img);
        });
        
        this.updateStats();
        console.log(`✅ ${this.editableImages.length} afbeeldingen bewerkbaar gemaakt`);
    }
    
    // Quick replace image via file dialog
    quickReplaceImage(img) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const editId = img.dataset.imageEditId;
                    
                    // Store original if not stored
                    if (!this.originalImages[editId]) {
                        this.originalImages[editId] = { src: img.src, alt: img.alt };
                    }
                    
                    img.src = e.target.result;
                    
                    // Track change
                    this.imageChanges[editId] = {
                        original: this.originalImages[editId],
                        current: { src: img.src, alt: img.alt },
                        timestamp: new Date().toISOString()
                    };
                    
                    img.closest('.editable-image-wrapper')?.classList.add('unsaved');
                    this.updateStats();
                    this.showNotification('🖼️ Afbeelding vervangen!', 'success');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }
    
    // Quick URL image change
    quickUrlImage(img) {
        const url = prompt('Voer de afbeelding URL in:', '');
        if (url && url.trim()) {
            const editId = img.dataset.imageEditId;
            
            // Store original if not stored
            if (!this.originalImages[editId]) {
                this.originalImages[editId] = { src: img.src, alt: img.alt };
            }
            
            img.src = url.trim();
            
            // Track change
            this.imageChanges[editId] = {
                original: this.originalImages[editId],
                current: { src: img.src, alt: img.alt },
                timestamp: new Date().toISOString()
            };
            
            img.closest('.editable-image-wrapper')?.classList.add('unsaved');
            this.updateStats();
            this.showNotification('🖼️ Afbeelding URL gewijzigd!', 'success');
        }
    }
    
    // Reset image to original
    resetImage(img) {
        const editId = img.dataset.imageEditId;
        const original = this.originalImages[editId];
        
        if (original) {
            img.src = original.src;
            img.alt = original.alt;
            delete this.imageChanges[editId];
            img.closest('.editable-image-wrapper')?.classList.remove('unsaved');
            this.updateStats();
            this.showNotification('🔄 Afbeelding gereset', 'info');
        }
    }
    
    // Disable image editing
    disableImageEditing() {
        document.querySelectorAll('.editable-image-wrapper').forEach(wrapper => {
            const overlay = wrapper.querySelector('.image-edit-overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        });
        this.editableImages = [];
    }
    
    // Enable editing on elements
    enableEditing() {
        // Define selectors for editable content
        const editableSelectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p:not(.admin-info p):not(.admin-login-body p)',
            '.hero-subtitle',
            '.btn-text',
            '.stat-number',
            '.stat-label',
            '.dienst-card h3',
            '.dienst-card p',
            '.project-info h3',
            '.project-info p',
            '.project-category',
            '.step-title',
            '.step-desc',
            '.industry-card h3',
            '.industry-card p',
            '.team-name',
            '.team-role',
            '.testimonial-text',
            '.testimonial-name',
            '.testimonial-role',
            '.footer-description',
            '.nav-link',
            'li:not(.admin-panel li)',
            'span:not(.admin-panel span):not(.status-dot)',
            'label'
        ];
        
        const elements = document.querySelectorAll(editableSelectors.join(', '));
        
        elements.forEach((el, index) => {
            // Skip admin panel elements and empty elements
            if (el.closest('.admin-panel') || el.closest('.admin-login-modal') || el.closest('.admin-toggle')) return;
            if (!el.textContent.trim()) return;
            
            // Generate unique ID if not exists
            if (!el.dataset.editId) {
                el.dataset.editId = `edit-${index}-${Date.now()}`;
            }
            
            // Store original content
            if (!this.originalContent[el.dataset.editId]) {
                this.originalContent[el.dataset.editId] = el.innerHTML;
            }
            
            // Make editable
            el.setAttribute('contenteditable', 'true');
            el.classList.add('editable');
            this.editableElements.push(el);
            
            // Add event listeners
            el.addEventListener('focus', this.handleFocus.bind(this));
            el.addEventListener('blur', this.handleBlur.bind(this));
            el.addEventListener('input', this.handleInput.bind(this));
        });
        
        // Update stats
        this.updateStats();
    }
    
    // Disable editing
    disableEditing() {
        this.editableElements.forEach(el => {
            el.setAttribute('contenteditable', 'false');
            el.classList.remove('editable', 'editing');
        });
        this.editableElements = [];
    }
    
    // Handle focus on editable element
    handleFocus(e) {
        e.target.classList.add('editing');
        
        // Create inline toolbar
        this.showInlineToolbar(e.target);
    }
    
    // Handle blur
    handleBlur(e) {
        e.target.classList.remove('editing');
        
        // Hide inline toolbar after delay
        setTimeout(() => {
            const toolbar = document.querySelector('.inline-toolbar');
            if (toolbar && !toolbar.matches(':hover')) {
                toolbar.remove();
            }
        }, 200);
    }
    
    // Handle input changes
    handleInput(e) {
        const el = e.target;
        const editId = el.dataset.editId;
        
        // Track change
        this.changes[editId] = {
            original: this.originalContent[editId],
            current: el.innerHTML,
            selector: this.getSelector(el),
            timestamp: new Date().toISOString()
        };
        
        // Update stats
        this.updateStats();
        
        // Auto-save indicator
        el.classList.add('unsaved');
    }
    
    // Show inline formatting toolbar
    showInlineToolbar(element) {
        // Remove existing toolbar
        const existingToolbar = document.querySelector('.inline-toolbar');
        if (existingToolbar) existingToolbar.remove();
        
        const toolbar = document.createElement('div');
        toolbar.className = 'inline-toolbar';
        toolbar.innerHTML = `
            <button data-command="bold" title="Vet (Ctrl+B)"><b>B</b></button>
            <button data-command="italic" title="Cursief (Ctrl+I)"><i>I</i></button>
            <button data-command="underline" title="Onderstrepen (Ctrl+U)"><u>U</u></button>
            <div class="toolbar-divider"></div>
            <button data-command="removeFormat" title="Opmaak verwijderen">✕</button>
        `;
        
        // Position toolbar
        const rect = element.getBoundingClientRect();
        toolbar.style.top = `${rect.top + window.scrollY - 50}px`;
        toolbar.style.left = `${rect.left + (rect.width / 2)}px`;
        
        document.body.appendChild(toolbar);
        
        // Bind toolbar buttons
        toolbar.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                document.execCommand(btn.dataset.command, false, null);
            });
        });
    }
    
    // Get unique CSS selector for element
    getSelector(el) {
        if (el.id) return `#${el.id}`;
        
        let path = [];
        while (el && el.nodeType === Node.ELEMENT_NODE) {
            let selector = el.nodeName.toLowerCase();
            if (el.className && typeof el.className === 'string') {
                selector += '.' + el.className.trim().split(/\s+/).filter(c => !c.startsWith('editable') && !c.startsWith('editing')).join('.');
            }
            path.unshift(selector);
            el = el.parentNode;
        }
        return path.join(' > ');
    }
    
    // Update stats in admin panel
    updateStats() {
        const textChanges = Object.keys(this.changes).length;
        const imgChanges = Object.keys(this.imageChanges).length;
        const totalChanges = textChanges + imgChanges;
        const totalEditable = this.editableElements.length + this.editableImages.length;
        
        document.getElementById('changesCount').textContent = totalChanges;
        document.getElementById('editableCount').textContent = totalEditable;
        
        // Update panel state
        const panel = document.querySelector('.admin-panel');
        panel.classList.toggle('has-changes', totalChanges > 0);
    }
    
    // Save changes to localStorage
    saveChanges() {
        const textChanges = Object.keys(this.changes).length;
        const imgChanges = Object.keys(this.imageChanges).length;
        
        if (textChanges === 0 && imgChanges === 0) {
            this.showNotification('Geen wijzigingen om op te slaan', 'info');
            return;
        }
        
        // Save text changes
        if (textChanges > 0) {
            localStorage.setItem('aim-editor-changes', JSON.stringify(this.changes));
        }
        
        // Save image changes
        if (imgChanges > 0) {
            localStorage.setItem('aim-editor-images', JSON.stringify(this.imageChanges));
        }
        
        localStorage.setItem('aim-editor-timestamp', new Date().toISOString());
        
        // Remove unsaved indicators
        document.querySelectorAll('.unsaved').forEach(el => el.classList.remove('unsaved'));
        
        this.showNotification(`✅ ${textChanges + imgChanges} wijzigingen opgeslagen! Pagina wordt ververst...`, 'success');
        
        // Refresh page after short delay to show notification
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
    
    // Load saved content from localStorage
    loadSavedContent() {
        const savedChanges = localStorage.getItem('aim-editor-changes');
        if (!savedChanges) return;
        
        try {
            this.changes = JSON.parse(savedChanges);
            
            // Apply saved changes
            Object.entries(this.changes).forEach(([editId, change]) => {
                const el = document.querySelector(`[data-edit-id="${editId}"]`);
                if (el) {
                    el.innerHTML = change.current;
                }
            });
            
            console.log(`✅ ${Object.keys(this.changes).length} opgeslagen tekst wijzigingen geladen`);
        } catch (e) {
            console.error('Error loading saved content:', e);
        }
    }
    
    // Load saved images from localStorage
    loadSavedImages() {
        const savedImages = localStorage.getItem('aim-editor-images');
        if (!savedImages) return;
        
        try {
            this.imageChanges = JSON.parse(savedImages);
            
            // Apply saved image changes after a short delay to ensure images are loaded
            setTimeout(() => {
                Object.entries(this.imageChanges).forEach(([editId, change]) => {
                    const img = document.querySelector(`[data-image-edit-id="${editId}"]`);
                    if (img && change.current) {
                        img.src = change.current.src;
                        img.alt = change.current.alt || '';
                    }
                });
                console.log(`✅ ${Object.keys(this.imageChanges).length} opgeslagen afbeelding wijzigingen geladen`);
            }, 500);
        } catch (e) {
            console.error('Error loading saved images:', e);
        }
    }
    
    // Reset all changes
    resetChanges() {
        const textChanges = Object.keys(this.changes).length;
        const imgChanges = Object.keys(this.imageChanges).length;
        
        if (textChanges === 0 && imgChanges === 0) {
            this.showNotification('Geen wijzigingen om te resetten', 'info');
            return;
        }
        
        if (!confirm('Weet je zeker dat je alle wijzigingen wilt terugzetten naar origineel?')) {
            return;
        }
        
        // Restore original text content
        Object.entries(this.originalContent).forEach(([editId, content]) => {
            const el = document.querySelector(`[data-edit-id="${editId}"]`);
            if (el) {
                el.innerHTML = content;
            }
        });
        
        // Restore original images
        Object.entries(this.originalImages).forEach(([editId, original]) => {
            const img = document.querySelector(`[data-image-edit-id="${editId}"]`);
            if (img) {
                img.src = original.src;
                img.alt = original.alt || '';
            }
        });
        
        // Clear changes
        this.changes = {};
        this.imageChanges = {};
        localStorage.removeItem('aim-editor-changes');
        localStorage.removeItem('aim-editor-images');
        localStorage.removeItem('aim-editor-timestamp');
        
        // Remove unsaved indicators
        document.querySelectorAll('.unsaved').forEach(el => el.classList.remove('unsaved'));
        
        this.updateStats();
        this.showNotification('🔄 Alle wijzigingen gereset', 'warning');
    }
    
    // Export changes as JSON
    exportChanges() {
        const textChanges = Object.keys(this.changes).length;
        const imgChanges = Object.keys(this.imageChanges).length;
        
        if (textChanges === 0 && imgChanges === 0) {
            this.showNotification('Geen wijzigingen om te exporteren', 'info');
            return;
        }
        
        const exportData = {
            timestamp: new Date().toISOString(),
            website: 'AIM-Robotics',
            summary: {
                textChanges: textChanges,
                imageChanges: imgChanges,
                totalChanges: textChanges + imgChanges
            },
            textContent: this.changes,
            images: this.imageChanges
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aim-content-changes-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('📥 Wijzigingen geëxporteerd!', 'success');
    }
    
    // Share HTML - creates a complete shareable HTML file
    async shareHTML() {
        // First save changes
        this.saveChangesWithoutRefresh();
        
        this.showNotification('📦 Standalone HTML wordt gegenereerd...', 'info');
        
        // Get standalone HTML with inlined CSS/JS
        const html = await this.generateStandaloneHTML();
        
        // Download with friendly name
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().split('T')[0];
        a.download = `AIM-Robotics-Website-${date}.html`;
        a.click();
        URL.revokeObjectURL(url);
        
        // Show share modal
        this.showShareModal();
    }
    
    // Show share modal with instructions
    showShareModal() {
        const existing = document.querySelector('.publish-modal');
        if (existing) existing.remove();
        
        const modal = document.createElement('div');
        modal.className = 'publish-modal';
        modal.innerHTML = `
            <div class="publish-modal-content" style="max-width: 480px;">
                <div class="publish-modal-header">
                    <h3>📤 Website Delen</h3>
                    <button class="publish-modal-close">&times;</button>
                </div>
                <div class="publish-modal-body">
                    <div class="publish-success">
                        <div class="publish-icon">✅</div>
                        <p><strong>HTML bestand gedownload!</strong></p>
                    </div>
                    
                    <div style="margin-top: 1.5rem; color: rgba(255,255,255,0.8); line-height: 1.6;">
                        <p style="margin-bottom: 1rem;"><strong>Dit bestand kun je delen via:</strong></p>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <li style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                                📧 <strong>E-mail</strong> - Stuur als bijlage
                            </li>
                            <li style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                                💬 <strong>Teams/Slack</strong> - Upload in chat
                            </li>
                            <li style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                                ☁️ <strong>OneDrive/Dropbox</strong> - Deel via link
                            </li>
                            <li style="padding: 8px 0;">
                                💾 <strong>USB stick</strong> - Kopieer het bestand
                            </li>
                        </ul>
                        
                        <p style="margin-top: 1.5rem; padding: 12px; background: rgba(6,182,212,0.1); border-radius: 8px; font-size: 0.9rem;">
                            💡 <strong>Tip:</strong> De ontvanger kan het bestand gewoon openen in een browser om de website te bekijken!
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.publish-modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
        requestAnimationFrame(() => modal.classList.add('active'));
    }
    
    // Publish to GitHub - exports complete HTML
    async publishToGitHub() {
        // First save changes
        this.saveChangesWithoutRefresh();
        
        // Get clean HTML without editor elements
        const html = this.generateCleanHTML();
        
        // Check if we have a GitHub token stored
        const githubToken = localStorage.getItem('aim-github-token');
        
        if (githubToken) {
            // Try automatic push to GitHub
            try {
                await this.pushToGitHubAPI(html, githubToken);
                return;
            } catch (err) {
                console.error('GitHub API push failed:', err);
                // Token might be invalid, remove it
                if (err.message.includes('401') || err.message.includes('403')) {
                    localStorage.removeItem('aim-github-token');
                }
            }
        }
        
        // Show modal to either setup token or use manual method
        this.showPublishOptionsModal(html);
    }
    
    // Push directly to GitHub using API
    async pushToGitHubAPI(html, token) {
        const owner = 'Rickvkesteren';
        const repo = 'aim-robotics';
        const path = 'index.html';
        const branch = 'main';
        
        // First, get the current file to get its SHA
        const getResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!getResponse.ok && getResponse.status !== 404) {
            throw new Error(`GitHub API error: ${getResponse.status}`);
        }
        
        let sha = null;
        if (getResponse.ok) {
            const fileData = await getResponse.json();
            sha = fileData.sha;
        }
        
        // Now update/create the file
        const content = btoa(unescape(encodeURIComponent(html))); // Base64 encode
        
        const updateResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Update website content via Live Editor',
                content: content,
                sha: sha,
                branch: branch
            })
        });
        
        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            throw new Error(`GitHub API error: ${updateResponse.status} - ${errorData.message}`);
        }
        
        // Success!
        this.showPublishSuccessModal();
    }
    
    // Show publish success modal
    showPublishSuccessModal() {
        const existing = document.querySelector('.publish-modal');
        if (existing) existing.remove();
        
        const modal = document.createElement('div');
        modal.className = 'publish-modal';
        modal.innerHTML = `
            <div class="publish-modal-content">
                <div class="publish-modal-header">
                    <h3>🎉 Gepubliceerd!</h3>
                    <button class="publish-modal-close">&times;</button>
                </div>
                <div class="publish-modal-body">
                    <div class="publish-success">
                        <div class="publish-icon" style="font-size: 4rem;">🚀</div>
                        <p style="font-size: 1.2rem; margin-top: 1rem;"><strong>Je website is bijgewerkt!</strong></p>
                        <p style="color: rgba(255,255,255,0.6); margin-top: 0.5rem;">De wijzigingen zijn automatisch naar GitHub gepusht.</p>
                    </div>
                    
                    <div class="publish-step" style="margin-top: 1.5rem; text-align: center;">
                        <p>Binnen 1-2 minuten live op:</p>
                        <a href="https://rickvkesteren.github.io/aim-robotics/" target="_blank" class="live-link" style="display: inline-block; margin-top: 0.5rem;">
                            🌐 rickvkesteren.github.io/aim-robotics
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.publish-modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
        requestAnimationFrame(() => modal.classList.add('active'));
    }
    
    // Show publish options modal
    showPublishOptionsModal(html) {
        const existing = document.querySelector('.publish-modal');
        if (existing) existing.remove();
        
        const modal = document.createElement('div');
        modal.className = 'publish-modal';
        modal.innerHTML = `
            <div class="publish-modal-content" style="max-width: 500px;">
                <div class="publish-modal-header">
                    <h3>🚀 Publiceren naar GitHub</h3>
                    <button class="publish-modal-close">&times;</button>
                </div>
                <div class="publish-modal-body">
                    <div class="publish-tabs">
                        <button class="publish-tab active" data-tab="auto">⚡ Automatisch</button>
                        <button class="publish-tab" data-tab="manual">📋 Handmatig</button>
                    </div>
                    
                    <div class="publish-tab-content active" id="tab-auto">
                        <p style="margin-bottom: 1rem; color: rgba(255,255,255,0.7);">
                            Stel eenmalig een GitHub token in om met 1 klik te publiceren.
                        </p>
                        
                        <div class="token-setup">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">GitHub Personal Access Token:</label>
                            <input type="password" class="github-token-input" placeholder="ghp_xxxxxxxxxxxx" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: white; font-family: monospace;">
                            
                            <details style="margin-top: 1rem; color: rgba(255,255,255,0.6); font-size: 0.85rem;">
                                <summary style="cursor: pointer; color: var(--primary-cyan);">Hoe maak ik een token?</summary>
                                <ol style="margin-top: 0.5rem; padding-left: 1.2rem; line-height: 1.6;">
                                    <li>Ga naar <a href="https://github.com/settings/tokens/new" target="_blank" style="color: var(--primary-cyan);">github.com/settings/tokens/new</a></li>
                                    <li>Geef een naam (bijv. "AIM Website Editor")</li>
                                    <li>Selecteer scope: <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">repo</code></li>
                                    <li>Klik "Generate token" en kopieer de code</li>
                                </ol>
                            </details>
                            
                            <button class="save-token-btn" style="margin-top: 1rem; width: 100%; padding: 12px; background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer;">
                                💾 Token Opslaan & Publiceren
                            </button>
                        </div>
                    </div>
                    
                    <div class="publish-tab-content" id="tab-manual">
                        <p style="margin-bottom: 1rem; color: rgba(255,255,255,0.7);">
                            Download het bestand en push handmatig naar GitHub.
                        </p>
                        
                        <button class="download-html-btn" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; margin-bottom: 1rem;">
                            📥 Download index.html
                        </button>
                        
                        <div class="publish-step">
                            <span class="step-number">1</span>
                            <div class="step-content">
                                <strong>Vervang index.html in je project map</strong>
                            </div>
                        </div>
                        
                        <div class="publish-step">
                            <span class="step-number">2</span>
                            <div class="step-content">
                                <strong>Push naar GitHub:</strong>
                                <div class="code-block-wrapper">
                                    <code class="code-block">git add . && git commit -m "Update" && git push</code>
                                    <button class="copy-btn" onclick="navigator.clipboard.writeText('git add . && git commit -m \\'Update\\' && git push'); this.textContent='✓'">📋</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Tab switching
        modal.querySelectorAll('.publish-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                modal.querySelectorAll('.publish-tab').forEach(t => t.classList.remove('active'));
                modal.querySelectorAll('.publish-tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                modal.querySelector(`#tab-${tab.dataset.tab}`).classList.add('active');
            });
        });
        
        // Save token and publish
        modal.querySelector('.save-token-btn').addEventListener('click', async () => {
            const tokenInput = modal.querySelector('.github-token-input');
            const token = tokenInput.value.trim();
            
            if (!token) {
                tokenInput.style.borderColor = '#ef4444';
                return;
            }
            
            const btn = modal.querySelector('.save-token-btn');
            btn.textContent = '⏳ Publiceren...';
            btn.disabled = true;
            
            try {
                await this.pushToGitHubAPI(html, token);
                localStorage.setItem('aim-github-token', token);
                modal.remove();
            } catch (err) {
                btn.textContent = '❌ Fout - Controleer token';
                btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                setTimeout(() => {
                    btn.textContent = '💾 Token Opslaan & Publiceren';
                    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                    btn.disabled = false;
                }, 2000);
            }
        });
        
        // Download button
        modal.querySelector('.download-html-btn').addEventListener('click', () => {
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'index.html';
            a.click();
            URL.revokeObjectURL(url);
        });
        
        // Close handlers
        modal.querySelector('.publish-modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
        requestAnimationFrame(() => modal.classList.add('active'));
    }
    
    // Save without page refresh
    saveChangesWithoutRefresh() {
        const textChanges = Object.keys(this.changes).length;
        const imgChanges = Object.keys(this.imageChanges).length;
        
        if (textChanges > 0) {
            localStorage.setItem('aim-editor-changes', JSON.stringify(this.changes));
        }
        if (imgChanges > 0) {
            localStorage.setItem('aim-editor-images', JSON.stringify(this.imageChanges));
        }
        localStorage.setItem('aim-editor-timestamp', new Date().toISOString());
    }
    
    // Generate clean HTML without editor elements
    generateCleanHTML() {
        // Clone the document
        const clone = document.cloneNode(true);
        
        // Remove all editor-related elements
        const removeSelectors = [
            '.admin-panel',
            '.admin-toggle',
            '.admin-login-modal',
            '.admin-image-modal',
            '.admin-notification',
            '.add-element-modal',
            '.drag-toolbar',
            '.property-panel',
            '.drag-context-menu',
            '.selection-box',
            '.image-edit-overlay',
            '.image-edit-badge',
            '.editable-image-wrapper > .image-edit-overlay',
            '.editable-image-wrapper > .image-edit-badge',
            '.publish-modal',
            'script[src*="admin.js"]',
            'script[src*="drag-editor.js"]',
            'link[href*="admin.css"]'
        ];
        
        removeSelectors.forEach(selector => {
            clone.querySelectorAll(selector).forEach(el => el.remove());
        });
        
        // Remove editor classes
        clone.querySelectorAll('.editable').forEach(el => {
            el.classList.remove('editable', 'unsaved');
            el.removeAttribute('contenteditable');
        });
        
        clone.querySelectorAll('.drag-selectable').forEach(el => {
            el.classList.remove('drag-selectable', 'drag-selected');
        });
        
        clone.querySelectorAll('.editable-image-wrapper').forEach(wrapper => {
            const img = wrapper.querySelector('img');
            if (img) {
                wrapper.parentNode.insertBefore(img, wrapper);
                wrapper.remove();
            }
        });
        
        // Remove admin-edit-mode class from body
        clone.body.classList.remove('admin-edit-mode', 'drag-mode-active');
        
        // Remove data attributes used by editor
        clone.querySelectorAll('[data-image-edit-id]').forEach(el => {
            el.removeAttribute('data-image-edit-id');
        });
        clone.querySelectorAll('[data-original-src]').forEach(el => {
            el.removeAttribute('data-original-src');
        });
        
        // Get the HTML
        return '<!DOCTYPE html>\n' + clone.documentElement.outerHTML;
    }
    
    // Generate standalone HTML with all CSS inlined
    async generateStandaloneHTML() {
        const clone = document.cloneNode(true);
        
        // Remove all editor-related elements
        const removeSelectors = [
            '.admin-panel',
            '.admin-toggle',
            '.admin-login-modal',
            '.admin-image-modal',
            '.admin-notification',
            '.add-element-modal',
            '.drag-toolbar',
            '.property-panel',
            '.drag-context-menu',
            '.selection-box',
            '.image-edit-overlay',
            '.image-edit-badge',
            '.editable-image-wrapper > .image-edit-overlay',
            '.editable-image-wrapper > .image-edit-badge',
            '.publish-modal',
            'script[src*="admin.js"]',
            'script[src*="drag-editor.js"]',
            'link[href*="admin.css"]'
        ];
        
        removeSelectors.forEach(selector => {
            clone.querySelectorAll(selector).forEach(el => el.remove());
        });
        
        // Remove editor classes and attributes
        clone.querySelectorAll('.editable').forEach(el => {
            el.classList.remove('editable', 'unsaved');
            el.removeAttribute('contenteditable');
        });
        clone.querySelectorAll('.drag-selectable').forEach(el => {
            el.classList.remove('drag-selectable', 'drag-selected');
        });
        clone.querySelectorAll('.editable-image-wrapper').forEach(wrapper => {
            const img = wrapper.querySelector('img');
            if (img) {
                wrapper.parentNode.insertBefore(img, wrapper);
                wrapper.remove();
            }
        });
        clone.body.classList.remove('admin-edit-mode', 'drag-mode-active');
        clone.querySelectorAll('[data-image-edit-id]').forEach(el => el.removeAttribute('data-image-edit-id'));
        clone.querySelectorAll('[data-original-src]').forEach(el => el.removeAttribute('data-original-src'));
        
        // Inline main.css
        try {
            const mainCssLink = clone.querySelector('link[href*="main.css"]');
            if (mainCssLink) {
                const response = await fetch('css/main.css');
                if (response.ok) {
                    const cssText = await response.text();
                    const styleEl = clone.createElement('style');
                    styleEl.textContent = cssText;
                    mainCssLink.parentNode.insertBefore(styleEl, mainCssLink);
                    mainCssLink.remove();
                }
            }
        } catch (e) {
            console.log('Could not inline CSS:', e);
        }
        
        // Inline main.js
        try {
            const mainJsScript = clone.querySelector('script[src*="main.js"]');
            if (mainJsScript) {
                const response = await fetch('js/main.js');
                if (response.ok) {
                    const jsText = await response.text();
                    const scriptEl = clone.createElement('script');
                    scriptEl.textContent = jsText;
                    mainJsScript.parentNode.insertBefore(scriptEl, mainJsScript);
                    mainJsScript.remove();
                }
            }
        } catch (e) {
            console.log('Could not inline JS:', e);
        }
        
        return '<!DOCTYPE html>\n' + clone.documentElement.outerHTML;
    }
    
    // Show publish modal with instructions
    showPublishModal() {
        const existing = document.querySelector('.publish-modal');
        if (existing) existing.remove();
        
        const modal = document.createElement('div');
        modal.className = 'publish-modal';
        modal.innerHTML = `
            <div class="publish-modal-content">
                <div class="publish-modal-header">
                    <h3>🚀 Publiceren naar GitHub</h3>
                    <button class="publish-modal-close">&times;</button>
                </div>
                <div class="publish-modal-body">
                    <div class="publish-success">
                        <div class="publish-icon">📥</div>
                        <p><strong>index.html</strong> is gedownload!</p>
                    </div>
                    
                    <div class="publish-steps">
                        <h4>Volg deze stappen:</h4>
                        
                        <div class="publish-step">
                            <span class="step-number">1</span>
                            <div class="step-content">
                                <strong>Vervang het bestand</strong>
                                <p>Kopieer de gedownloade <code>index.html</code> naar je project folder en overschrijf het bestaande bestand:</p>
                                <code class="code-block">c:\\Users\\RVK\\Documents\\VS_Code\\AIM robotics\\</code>
                            </div>
                        </div>
                        
                        <div class="publish-step">
                            <span class="step-number">2</span>
                            <div class="step-content">
                                <strong>Open terminal in VS Code</strong>
                                <p>Druk <kbd>Ctrl</kbd> + <kbd>\`</kbd> of ga naar Terminal → New Terminal</p>
                            </div>
                        </div>
                        
                        <div class="publish-step">
                            <span class="step-number">3</span>
                            <div class="step-content">
                                <strong>Voer deze commando's uit:</strong>
                                <div class="code-block-wrapper">
                                    <code class="code-block">git add .
git commit -m "Update website content"
git push</code>
                                    <button class="copy-btn" onclick="navigator.clipboard.writeText('git add . && git commit -m \\'Update website content\\' && git push')">📋 Kopieer</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="publish-step">
                            <span class="step-number">4</span>
                            <div class="step-content">
                                <strong>Klaar!</strong>
                                <p>Binnen 1-2 minuten is je website live op:</p>
                                <a href="https://rickvkesteren.github.io/aim-robotics/" target="_blank" class="live-link">
                                    🌐 rickvkesteren.github.io/aim-robotics
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button
        modal.querySelector('.publish-modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Show with animation
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
    }
    
    // Show simplified modal when file was saved directly
    showPublishModalAuto() {
        const existing = document.querySelector('.publish-modal');
        if (existing) existing.remove();
        
        const modal = document.createElement('div');
        modal.className = 'publish-modal';
        modal.innerHTML = `
            <div class="publish-modal-content">
                <div class="publish-modal-header">
                    <h3>🚀 Publiceren naar GitHub</h3>
                    <button class="publish-modal-close">&times;</button>
                </div>
                <div class="publish-modal-body">
                    <div class="publish-success">
                        <div class="publish-icon">✅</div>
                        <p><strong>index.html</strong> is opgeslagen!</p>
                    </div>
                    
                    <div class="publish-steps">
                        <h4>Laatste stap - Push naar GitHub:</h4>
                        
                        <div class="publish-step">
                            <span class="step-number">1</span>
                            <div class="step-content">
                                <strong>Voer dit commando uit in VS Code terminal:</strong>
                                <div class="code-block-wrapper">
                                    <code class="code-block">git add . && git commit -m "Update website content" && git push</code>
                                    <button class="copy-btn" onclick="navigator.clipboard.writeText('git add . && git commit -m \\'Update website content\\' && git push'); this.textContent='✓ Gekopieerd!'">📋 Kopieer</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="publish-step">
                            <span class="step-number">2</span>
                            <div class="step-content">
                                <strong>Klaar!</strong>
                                <p>Binnen 1-2 minuten is je website live op:</p>
                                <a href="https://rickvkesteren.github.io/aim-robotics/" target="_blank" class="live-link">
                                    🌐 rickvkesteren.github.io/aim-robotics
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button
        modal.querySelector('.publish-modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Show with animation
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        const existing = document.querySelector('.admin-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
    
    // Add new element to page
    addElement(type) {
        if (!this.isEditMode) {
            this.showNotification('Activeer eerst edit mode', 'warning');
            return;
        }
        
        // Show element placement modal
        this.showAddElementModal(type);
    }
    
    // Add custom block
    addBlock(blockType) {
        if (!this.isEditMode) {
            this.showNotification('❌ Schakel eerst de edit modus in', 'error');
            return;
        }
        
        this.showAddBlockModal(blockType);
    }
    
    // Show modal to configure and place custom block
    showAddBlockModal(blockType) {
        document.querySelector('.add-element-modal')?.remove();
        
        const blockNames = {
            hero: 'Hero Sectie',
            cta: 'Call-to-Action',
            features: 'Features Grid',
            testimonial: 'Testimonial / Quote',
            stats: 'Statistieken',
            contact: 'Contact Formulier',
            gallery: 'Afbeeldingen Gallerij',
            video: 'Video Sectie'
        };
        
        const modal = document.createElement('div');
        modal.className = 'add-element-modal active';
        
        modal.innerHTML = `
            <div class="add-element-content" style="max-width: 600px;">
                <div class="add-element-header">
                    <h3>📦 ${blockNames[blockType]} Toevoegen</h3>
                    <button class="add-element-close">&times;</button>
                </div>
                <div class="add-element-body">
                    ${this.getBlockForm(blockType)}
                    
                    <div class="placement-section">
                        <h4>Plaatsing</h4>
                        <select class="placement-select" id="placementSection">
                            <option value="">-- Selecteer waar het blok komt --</option>
                            <option value="after:.hero">Na Hero</option>
                            <option value="after:#diensten">Na Diensten</option>
                            <option value="after:#projecten">Na Projecten</option>
                            <option value="after:#industrieen">Na Industrieën</option>
                            <option value="after:#over-ons">Na Over Ons</option>
                            <option value="before:#contact">Voor Contact</option>
                            <option value="before:.footer">Voor Footer</option>
                        </select>
                    </div>
                </div>
                <div class="add-element-footer">
                    <button class="admin-btn admin-btn-cancel">Annuleren</button>
                    <button class="admin-btn admin-btn-add-element" id="addBlockBtn">Blok Toevoegen</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close handlers
        modal.querySelector('.add-element-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.admin-btn-cancel').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Add block handler
        modal.querySelector('#addBlockBtn').addEventListener('click', () => {
            const placement = modal.querySelector('#placementSection').value;
            if (!placement) {
                this.showNotification('❌ Selecteer een plaatsing', 'error');
                return;
            }
            
            const blockHTML = this.generateBlockHTML(blockType, modal);
            const [position, selector] = placement.split(':');
            const targetEl = document.querySelector(selector);
            
            if (targetEl) {
                const newSection = document.createElement('div');
                newSection.innerHTML = blockHTML;
                const sectionEl = newSection.firstElementChild;
                
                if (position === 'after') {
                    targetEl.after(sectionEl);
                } else {
                    targetEl.before(sectionEl);
                }
                
                // Make it editable
                sectionEl.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, li').forEach(el => {
                    if (!el.closest('nav') && !el.closest('.admin-panel')) {
                        el.classList.add('editable');
                        el.contentEditable = true;
                    }
                });
                
                this.showNotification(`✅ ${blockNames[blockType]} toegevoegd!`, 'success');
                modal.remove();
                
                // Scroll to new section
                sectionEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
    
    // Get block configuration form
    getBlockForm(blockType) {
        switch(blockType) {
            case 'hero':
                return `
                    <div class="form-group">
                        <label>Titel</label>
                        <input type="text" id="block-title" class="admin-input" value="Jouw Headline Hier" placeholder="Hoofdtitel">
                    </div>
                    <div class="form-group">
                        <label>Subtitel</label>
                        <input type="text" id="block-subtitle" class="admin-input" value="Beschrijving van je dienst of product" placeholder="Subtitel">
                    </div>
                    <div class="form-group">
                        <label>Knop tekst</label>
                        <input type="text" id="block-btn" class="admin-input" value="Meer informatie" placeholder="Knop tekst">
                    </div>
                    <div class="form-group">
                        <label>Achtergrond</label>
                        <select id="block-bg" class="admin-input">
                            <option value="gradient">Gradient (donker)</option>
                            <option value="light">Licht</option>
                            <option value="primary">Primair blauw</option>
                        </select>
                    </div>
                `;
            
            case 'cta':
                return `
                    <div class="form-group">
                        <label>Titel</label>
                        <input type="text" id="block-title" class="admin-input" value="Klaar om te beginnen?" placeholder="CTA titel">
                    </div>
                    <div class="form-group">
                        <label>Beschrijving</label>
                        <input type="text" id="block-subtitle" class="admin-input" value="Neem vandaag nog contact op" placeholder="Beschrijving">
                    </div>
                    <div class="form-group">
                        <label>Knop tekst</label>
                        <input type="text" id="block-btn" class="admin-input" value="Contact opnemen" placeholder="Knop tekst">
                    </div>
                `;
            
            case 'features':
                return `
                    <div class="form-group">
                        <label>Aantal features</label>
                        <select id="block-count" class="admin-input">
                            <option value="3">3 features</option>
                            <option value="4">4 features</option>
                            <option value="6">6 features</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Sectie titel</label>
                        <input type="text" id="block-title" class="admin-input" value="Onze Voordelen" placeholder="Sectie titel">
                    </div>
                `;
            
            case 'testimonial':
                return `
                    <div class="form-group">
                        <label>Quote tekst</label>
                        <textarea id="block-quote" class="admin-input" rows="3" placeholder="Quote tekst">Uitstekende service en kwaliteit. Aanrader!</textarea>
                    </div>
                    <div class="form-group">
                        <label>Naam</label>
                        <input type="text" id="block-name" class="admin-input" value="Jan de Vries" placeholder="Naam">
                    </div>
                    <div class="form-group">
                        <label>Functie / Bedrijf</label>
                        <input type="text" id="block-role" class="admin-input" value="Directeur, Bedrijf B.V." placeholder="Functie">
                    </div>
                `;
            
            case 'stats':
                return `
                    <div class="form-group">
                        <label>Statistieken (komma gescheiden)</label>
                        <input type="text" id="block-stats" class="admin-input" value="50+,10+,100%" placeholder="bijv: 50+,10+,99%">
                    </div>
                    <div class="form-group">
                        <label>Labels (komma gescheiden)</label>
                        <input type="text" id="block-labels" class="admin-input" value="Projecten,Jaar ervaring,Klanttevredenheid" placeholder="Labels">
                    </div>
                `;
            
            case 'contact':
                return `
                    <div class="form-group">
                        <label>Titel</label>
                        <input type="text" id="block-title" class="admin-input" value="Neem contact op" placeholder="Titel">
                    </div>
                    <div class="form-group">
                        <label>Stijl</label>
                        <select id="block-style" class="admin-input">
                            <option value="simple">Simpel</option>
                            <option value="full">Met contactgegevens</option>
                        </select>
                    </div>
                `;
            
            case 'gallery':
                return `
                    <div class="form-group">
                        <label>Titel</label>
                        <input type="text" id="block-title" class="admin-input" value="Onze Projecten" placeholder="Gallerij titel">
                    </div>
                    <div class="form-group">
                        <label>Aantal placeholders</label>
                        <select id="block-count" class="admin-input">
                            <option value="4">4 afbeeldingen</option>
                            <option value="6">6 afbeeldingen</option>
                            <option value="8">8 afbeeldingen</option>
                        </select>
                    </div>
                `;
            
            case 'video':
                return `
                    <div class="form-group">
                        <label>Video URL (YouTube embed)</label>
                        <input type="text" id="block-video" class="admin-input" placeholder="https://www.youtube.com/embed/...">
                    </div>
                    <div class="form-group">
                        <label>Titel</label>
                        <input type="text" id="block-title" class="admin-input" value="Bekijk onze video" placeholder="Titel boven video">
                    </div>
                `;
            
            default:
                return '<p>Configuratie niet beschikbaar</p>';
        }
    }
    
    // Generate block HTML
    generateBlockHTML(blockType, modal) {
        const getValue = (id) => modal.querySelector(`#${id}`)?.value || '';
        
        switch(blockType) {
            case 'hero':
                const heroBg = getValue('block-bg');
                const bgClass = heroBg === 'light' ? 'bg-light' : heroBg === 'primary' ? 'bg-primary' : 'bg-gradient-dark';
                return `
                    <section class="section custom-hero ${bgClass}" style="padding: 100px 0; text-align: center;">
                        <div class="container">
                            <h2 style="font-size: 3rem; margin-bottom: 1rem; color: ${heroBg === 'light' ? 'var(--text-dark)' : 'white'};">${getValue('block-title')}</h2>
                            <p style="font-size: 1.25rem; margin-bottom: 2rem; color: ${heroBg === 'light' ? 'var(--text-body)' : 'rgba(255,255,255,0.8)'};">${getValue('block-subtitle')}</p>
                            <a href="#contact" class="btn btn-primary">${getValue('block-btn')}</a>
                        </div>
                    </section>
                `;
            
            case 'cta':
                return `
                    <section class="section custom-cta" style="padding: 80px 0; background: var(--gradient-primary); text-align: center;">
                        <div class="container">
                            <h2 style="font-size: 2.5rem; color: white; margin-bottom: 1rem;">${getValue('block-title')}</h2>
                            <p style="font-size: 1.125rem; color: rgba(255,255,255,0.9); margin-bottom: 2rem;">${getValue('block-subtitle')}</p>
                            <a href="#contact" class="btn" style="background: white; color: var(--primary); padding: 16px 32px; border-radius: 8px; font-weight: 600;">${getValue('block-btn')}</a>
                        </div>
                    </section>
                `;
            
            case 'features':
                const featCount = parseInt(getValue('block-count')) || 3;
                let featItems = '';
                for (let i = 0; i < featCount; i++) {
                    featItems += `
                        <div class="feature-item" style="background: white; padding: 30px; border-radius: 12px; box-shadow: var(--shadow-md); text-align: center;">
                            <div style="width: 60px; height: 60px; background: var(--gradient-primary); border-radius: 12px; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center;">
                                <span style="color: white; font-size: 1.5rem;">✓</span>
                            </div>
                            <h4 style="margin-bottom: 0.5rem;">Feature ${i + 1}</h4>
                            <p style="color: var(--text-muted);">Beschrijving van deze feature</p>
                        </div>
                    `;
                }
                return `
                    <section class="section custom-features" style="padding: 80px 0; background: var(--bg-light);">
                        <div class="container">
                            <h2 style="text-align: center; margin-bottom: 3rem;">${getValue('block-title')}</h2>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">
                                ${featItems}
                            </div>
                        </div>
                    </section>
                `;
            
            case 'testimonial':
                return `
                    <section class="section custom-testimonial" style="padding: 80px 0; background: var(--bg-light);">
                        <div class="container" style="max-width: 800px;">
                            <blockquote style="text-align: center;">
                                <p style="font-size: 1.5rem; font-style: italic; color: var(--text-body); margin-bottom: 1.5rem; line-height: 1.6;">"${getValue('block-quote')}"</p>
                                <footer style="color: var(--text-muted);">
                                    <strong style="color: var(--text-dark);">${getValue('block-name')}</strong><br>
                                    ${getValue('block-role')}
                                </footer>
                            </blockquote>
                        </div>
                    </section>
                `;
            
            case 'stats':
                const stats = getValue('block-stats').split(',');
                const labels = getValue('block-labels').split(',');
                let statItems = '';
                stats.forEach((stat, i) => {
                    statItems += `
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; font-weight: 800; color: var(--primary); margin-bottom: 0.5rem;">${stat.trim()}</div>
                            <div style="color: var(--text-muted);">${labels[i]?.trim() || ''}</div>
                        </div>
                    `;
                });
                return `
                    <section class="section custom-stats" style="padding: 60px 0; background: white;">
                        <div class="container">
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px;">
                                ${statItems}
                            </div>
                        </div>
                    </section>
                `;
            
            case 'contact':
                return `
                    <section class="section custom-contact" style="padding: 80px 0;">
                        <div class="container" style="max-width: 600px;">
                            <h2 style="text-align: center; margin-bottom: 2rem;">${getValue('block-title')}</h2>
                            <form style="background: white; padding: 40px; border-radius: 16px; box-shadow: var(--shadow-lg);">
                                <div style="margin-bottom: 1rem;">
                                    <input type="text" placeholder="Je naam" style="width: 100%; padding: 14px; border: 2px solid var(--border-light); border-radius: 8px;">
                                </div>
                                <div style="margin-bottom: 1rem;">
                                    <input type="email" placeholder="Je e-mail" style="width: 100%; padding: 14px; border: 2px solid var(--border-light); border-radius: 8px;">
                                </div>
                                <div style="margin-bottom: 1rem;">
                                    <textarea placeholder="Je bericht" rows="4" style="width: 100%; padding: 14px; border: 2px solid var(--border-light); border-radius: 8px;"></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary" style="width: 100%;">Versturen</button>
                            </form>
                        </div>
                    </section>
                `;
            
            case 'gallery':
                const galleryCount = parseInt(getValue('block-count')) || 4;
                let galleryItems = '';
                for (let i = 0; i < galleryCount; i++) {
                    galleryItems += `
                        <div style="aspect-ratio: 4/3; background: linear-gradient(135deg, var(--bg-light), var(--border-light)); border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <span style="color: var(--text-muted);">Klik om afbeelding toe te voegen</span>
                        </div>
                    `;
                }
                return `
                    <section class="section custom-gallery" style="padding: 80px 0;">
                        <div class="container">
                            <h2 style="text-align: center; margin-bottom: 3rem;">${getValue('block-title')}</h2>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                                ${galleryItems}
                            </div>
                        </div>
                    </section>
                `;
            
            case 'video':
                const videoUrl = getValue('block-video');
                return `
                    <section class="section custom-video" style="padding: 80px 0; background: var(--bg-dark);">
                        <div class="container" style="max-width: 900px;">
                            <h2 style="text-align: center; color: white; margin-bottom: 2rem;">${getValue('block-title')}</h2>
                            <div style="aspect-ratio: 16/9; background: black; border-radius: 16px; overflow: hidden;">
                                ${videoUrl ? `<iframe src="${videoUrl}" style="width: 100%; height: 100%; border: none;" allowfullscreen></iframe>` : '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white;">Video placeholder - voer YouTube URL in</div>'}
                            </div>
                        </div>
                    </section>
                `;
            
            default:
                return '<div>Blok niet gevonden</div>';
        }
    }
    
    // Show modal to configure and place new element
    showAddElementModal(type) {
        // Remove existing modal
        document.querySelector('.add-element-modal')?.remove();
        
        const modal = document.createElement('div');
        modal.className = 'add-element-modal active';
        
        const typeLabels = {
            heading: 'Koptekst',
            paragraph: 'Paragraaf',
            image: 'Afbeelding',
            button: 'Knop',
            divider: 'Scheidingslijn',
            card: 'Card'
        };
        
        modal.innerHTML = `
            <div class="add-element-content">
                <div class="add-element-header">
                    <h3>➕ ${typeLabels[type]} Toevoegen</h3>
                    <button class="add-element-close">&times;</button>
                </div>
                <div class="add-element-body">
                    ${this.getElementForm(type)}
                    
                    <div class="placement-section">
                        <h4>Plaatsing</h4>
                        <p class="placement-hint">Klik op een sectie in de pagina om het element daar te plaatsen</p>
                        <select class="placement-select" id="placementSection">
                            <option value="">-- Selecteer sectie --</option>
                            <option value=".hero-content">Hero</option>
                            <option value=".diensten .container">Diensten</option>
                            <option value=".projecten .container">Projecten</option>
                            <option value=".about-content">Over Ons</option>
                            <option value=".contact .container">Contact</option>
                            <option value=".footer-content">Footer</option>
                        </select>
                        <div class="placement-position">
                            <label>
                                <input type="radio" name="position" value="append" checked> Onderaan sectie
                            </label>
                            <label>
                                <input type="radio" name="position" value="prepend"> Bovenaan sectie
                            </label>
                        </div>
                    </div>
                </div>
                <div class="add-element-footer">
                    <button class="admin-btn admin-btn-cancel">Annuleren</button>
                    <button class="admin-btn admin-btn-add-element">Toevoegen</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelector('.add-element-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.admin-btn-cancel').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Add element button
        modal.querySelector('.admin-btn-add-element').addEventListener('click', () => {
            this.createElement(type, modal);
        });
        
        // Image file input
        if (type === 'image') {
            const fileInput = modal.querySelector('.new-image-file');
            const preview = modal.querySelector('.new-image-preview');
            
            modal.querySelector('.new-image-upload').addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }
    
    // Get form HTML for element type
    getElementForm(type) {
        switch (type) {
            case 'heading':
                return `
                    <div class="element-form">
                        <div class="form-group">
                            <label>Tekst:</label>
                            <input type="text" id="newHeadingText" placeholder="Uw koptekst hier..." value="Nieuwe Koptekst">
                        </div>
                        <div class="form-group">
                            <label>Niveau:</label>
                            <select id="newHeadingLevel">
                                <option value="h2">H2 - Sectie titel</option>
                                <option value="h3">H3 - Subtitel</option>
                                <option value="h4">H4 - Kleinere titel</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Stijl:</label>
                            <select id="newHeadingStyle">
                                <option value="gradient">Gradient tekst</option>
                                <option value="normal">Normaal</option>
                                <option value="light">Licht</option>
                            </select>
                        </div>
                    </div>
                `;
            case 'paragraph':
                return `
                    <div class="element-form">
                        <div class="form-group">
                            <label>Tekst:</label>
                            <textarea id="newParagraphText" rows="4" placeholder="Uw tekst hier...">Dit is een nieuwe paragraaf met uw eigen tekst. U kunt deze tekst aanpassen naar wens.</textarea>
                        </div>
                        <div class="form-group">
                            <label>Tekstgrootte:</label>
                            <select id="newParagraphSize">
                                <option value="normal">Normaal</option>
                                <option value="large">Groot</option>
                                <option value="small">Klein</option>
                            </select>
                        </div>
                    </div>
                `;
            case 'image':
                return `
                    <div class="element-form">
                        <div class="form-group">
                            <label>Afbeelding:</label>
                            <div class="new-image-container">
                                <img class="new-image-preview" src="" alt="Preview" style="display:none;">
                                <button class="admin-btn new-image-upload">📁 Bestand kiezen</button>
                                <input type="file" class="new-image-file" accept="image/*" hidden>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Of URL:</label>
                            <input type="text" id="newImageUrl" placeholder="https://example.com/image.jpg">
                        </div>
                        <div class="form-group">
                            <label>Alt tekst:</label>
                            <input type="text" id="newImageAlt" placeholder="Beschrijving van afbeelding">
                        </div>
                        <div class="form-group">
                            <label>Breedte:</label>
                            <select id="newImageWidth">
                                <option value="100%">Volledige breedte</option>
                                <option value="75%">75%</option>
                                <option value="50%">50%</option>
                                <option value="auto">Automatisch</option>
                            </select>
                        </div>
                    </div>
                `;
            case 'button':
                return `
                    <div class="element-form">
                        <div class="form-group">
                            <label>Tekst:</label>
                            <input type="text" id="newButtonText" placeholder="Klik hier" value="Meer Info">
                        </div>
                        <div class="form-group">
                            <label>Link URL:</label>
                            <input type="text" id="newButtonUrl" placeholder="#sectie of https://...">
                        </div>
                        <div class="form-group">
                            <label>Stijl:</label>
                            <select id="newButtonStyle">
                                <option value="primary">Primair (blauw)</option>
                                <option value="secondary">Secundair (outline)</option>
                                <option value="accent">Accent (oranje)</option>
                            </select>
                        </div>
                    </div>
                `;
            case 'divider':
                return `
                    <div class="element-form">
                        <div class="form-group">
                            <label>Stijl:</label>
                            <select id="newDividerStyle">
                                <option value="gradient">Gradient lijn</option>
                                <option value="solid">Vaste lijn</option>
                                <option value="dashed">Stippellijn</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Breedte:</label>
                            <select id="newDividerWidth">
                                <option value="100%">Volledige breedte</option>
                                <option value="50%">Halve breedte</option>
                                <option value="200px">200px</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Marge:</label>
                            <select id="newDividerMargin">
                                <option value="40px">Groot</option>
                                <option value="20px">Medium</option>
                                <option value="10px">Klein</option>
                            </select>
                        </div>
                    </div>
                `;
            case 'card':
                return `
                    <div class="element-form">
                        <div class="form-group">
                            <label>Titel:</label>
                            <input type="text" id="newCardTitle" placeholder="Card titel" value="Nieuwe Card">
                        </div>
                        <div class="form-group">
                            <label>Beschrijving:</label>
                            <textarea id="newCardDesc" rows="3" placeholder="Beschrijving...">Dit is een nieuwe card met uw eigen content.</textarea>
                        </div>
                        <div class="form-group">
                            <label>Icon (emoji):</label>
                            <input type="text" id="newCardIcon" placeholder="🚀" value="⭐">
                        </div>
                        <div class="form-group">
                            <label>Stijl:</label>
                            <select id="newCardStyle">
                                <option value="glass">Glassmorphism</option>
                                <option value="solid">Solid</option>
                                <option value="gradient">Gradient border</option>
                            </select>
                        </div>
                    </div>
                `;
            default:
                return '<p>Onbekend element type</p>';
        }
    }
    
    // Create and insert new element
    createElement(type, modal) {
        const sectionSelector = modal.querySelector('#placementSection').value;
        const position = modal.querySelector('input[name="position"]:checked').value;
        
        if (!sectionSelector) {
            this.showNotification('Selecteer eerst een sectie', 'warning');
            return;
        }
        
        const section = document.querySelector(sectionSelector);
        if (!section) {
            this.showNotification('Sectie niet gevonden', 'error');
            return;
        }
        
        let newElement;
        
        switch (type) {
            case 'heading':
                const headingLevel = modal.querySelector('#newHeadingLevel').value;
                const headingText = modal.querySelector('#newHeadingText').value;
                const headingStyle = modal.querySelector('#newHeadingStyle').value;
                
                newElement = document.createElement(headingLevel);
                newElement.textContent = headingText;
                newElement.className = 'admin-added-element';
                if (headingStyle === 'gradient') {
                    newElement.classList.add('gradient-text');
                } else if (headingStyle === 'light') {
                    newElement.style.color = '#9ca3af';
                }
                break;
                
            case 'paragraph':
                const paragraphText = modal.querySelector('#newParagraphText').value;
                const paragraphSize = modal.querySelector('#newParagraphSize').value;
                
                newElement = document.createElement('p');
                newElement.textContent = paragraphText;
                newElement.className = 'admin-added-element';
                if (paragraphSize === 'large') {
                    newElement.style.fontSize = '1.25rem';
                } else if (paragraphSize === 'small') {
                    newElement.style.fontSize = '0.875rem';
                }
                break;
                
            case 'image':
                const preview = modal.querySelector('.new-image-preview');
                const imageUrl = modal.querySelector('#newImageUrl').value;
                const imageAlt = modal.querySelector('#newImageAlt').value;
                const imageWidth = modal.querySelector('#newImageWidth').value;
                
                const imgSrc = preview.src && preview.style.display !== 'none' ? preview.src : imageUrl;
                
                if (!imgSrc) {
                    this.showNotification('Selecteer een afbeelding of voer een URL in', 'warning');
                    return;
                }
                
                newElement = document.createElement('div');
                newElement.className = 'admin-added-element admin-added-image';
                newElement.innerHTML = `<img src="${imgSrc}" alt="${imageAlt}" style="width: ${imageWidth}; border-radius: 12px;">`;
                break;
                
            case 'button':
                const buttonText = modal.querySelector('#newButtonText').value;
                const buttonUrl = modal.querySelector('#newButtonUrl').value;
                const buttonStyle = modal.querySelector('#newButtonStyle').value;
                
                newElement = document.createElement('a');
                newElement.href = buttonUrl || '#';
                newElement.textContent = buttonText;
                newElement.className = `btn admin-added-element`;
                if (buttonStyle === 'primary') {
                    newElement.classList.add('btn-primary');
                } else if (buttonStyle === 'secondary') {
                    newElement.classList.add('btn-secondary');
                } else {
                    newElement.style.background = 'linear-gradient(135deg, #ff6b00 0%, #ff8533 100%)';
                    newElement.style.color = 'white';
                }
                break;
                
            case 'divider':
                const dividerStyle = modal.querySelector('#newDividerStyle').value;
                const dividerWidth = modal.querySelector('#newDividerWidth').value;
                const dividerMargin = modal.querySelector('#newDividerMargin').value;
                
                newElement = document.createElement('hr');
                newElement.className = 'admin-added-element admin-divider';
                newElement.style.width = dividerWidth;
                newElement.style.margin = `${dividerMargin} auto`;
                newElement.style.border = 'none';
                newElement.style.height = '2px';
                
                if (dividerStyle === 'gradient') {
                    newElement.style.background = 'linear-gradient(90deg, transparent, #0066cc, transparent)';
                } else if (dividerStyle === 'solid') {
                    newElement.style.background = 'rgba(255,255,255,0.2)';
                } else {
                    newElement.style.borderTop = '2px dashed rgba(255,255,255,0.2)';
                    newElement.style.background = 'none';
                }
                break;
                
            case 'card':
                const cardTitle = modal.querySelector('#newCardTitle').value;
                const cardDesc = modal.querySelector('#newCardDesc').value;
                const cardIcon = modal.querySelector('#newCardIcon').value;
                const cardStyle = modal.querySelector('#newCardStyle').value;
                
                newElement = document.createElement('div');
                newElement.className = `admin-added-element admin-card admin-card-${cardStyle}`;
                newElement.innerHTML = `
                    <div class="admin-card-icon">${cardIcon}</div>
                    <h4>${cardTitle}</h4>
                    <p>${cardDesc}</p>
                `;
                break;
        }
        
        if (newElement) {
            // Add delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'element-delete-btn';
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.title = 'Element verwijderen';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Element verwijderen?')) {
                    newElement.remove();
                    this.showNotification('🗑️ Element verwijderd', 'info');
                }
            });
            
            newElement.style.position = 'relative';
            newElement.appendChild(deleteBtn);
            
            // Insert element
            if (position === 'prepend') {
                section.insertBefore(newElement, section.firstChild);
            } else {
                section.appendChild(newElement);
            }
            
            // Make editable
            if (type !== 'image' && type !== 'divider') {
                newElement.setAttribute('contenteditable', 'true');
                newElement.classList.add('editable');
            }
            
            modal.remove();
            this.showNotification(`✅ ${type} toegevoegd!`, 'success');
            
            // Scroll to element
            newElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.liveEditor = new LiveEditor();
});
