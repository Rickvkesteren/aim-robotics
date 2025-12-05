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
                <button class="admin-btn admin-btn-reset" title="Alle wijzigingen ongedaan maken">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                    </svg>
                    <span>Reset</span>
                </button>
                <button class="admin-btn admin-btn-export" title="Wijzigingen exporteren">
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
        panel.querySelector('.admin-btn-reset').addEventListener('click', () => this.resetChanges());
        panel.querySelector('.admin-btn-export').addEventListener('click', () => this.exportChanges());
        panel.querySelector('.admin-btn-close').addEventListener('click', () => this.toggleEditMode());
        
        // Bind add element buttons
        panel.querySelectorAll('.add-element-btn').forEach(btn => {
            btn.addEventListener('click', () => this.addElement(btn.dataset.type));
        });
        
        // Bind drag mode button
        panel.querySelector('#toggleDragMode').addEventListener('click', () => {
            if (window.dragEditor) {
                window.dragEditor.toggleDragMode(true);
                this.showNotification('🎨 Drag & Drop Editor geactiveerd!', 'success');
            }
        });
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
        
        this.showNotification(`✅ ${textChanges + imgChanges} wijzigingen opgeslagen!`, 'success');
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
