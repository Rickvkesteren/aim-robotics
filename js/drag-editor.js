/**
 * AIM-Robotics Drag & Drop Editor
 * Full visual customization with drag, resize, and modify capabilities
 */

class DragEditor {
    constructor() {
        this.isDragMode = false;
        this.selectedElement = null;
        this.draggedElement = null;
        this.resizing = false;
        this.resizeHandle = null;
        this.startX = 0;
        this.startY = 0;
        this.startWidth = 0;
        this.startHeight = 0;
        this.startLeft = 0;
        this.startTop = 0;
        this.elementStyles = {};
        this.history = [];
        this.historyIndex = -1;
        
        this.init();
    }
    
    init() {
        this.createDragToolbar();
        this.createPropertyPanel();
        this.createContextMenu();
        this.bindGlobalEvents();
        this.loadSavedStyles();
    }
    
    // Create floating toolbar for drag mode
    createDragToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'drag-toolbar';
        toolbar.innerHTML = `
            <div class="drag-toolbar-content">
                <button class="drag-tool-btn" data-tool="select" title="Selecteren (V)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
                        <path d="M13 13l6 6"/>
                    </svg>
                </button>
                <button class="drag-tool-btn" data-tool="move" title="Verplaatsen (M)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 9l-3 3 3 3"/>
                        <path d="M9 5l3-3 3 3"/>
                        <path d="M15 19l-3 3-3-3"/>
                        <path d="M19 9l3 3-3 3"/>
                        <path d="M2 12h20"/>
                        <path d="M12 2v20"/>
                    </svg>
                </button>
                <button class="drag-tool-btn" data-tool="resize" title="Formaat (R)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 21H3V3"/>
                        <path d="M21 15v6h-6"/>
                        <path d="M15 15l6 6"/>
                    </svg>
                </button>
                <div class="drag-tool-divider"></div>
                <button class="drag-tool-btn" data-tool="duplicate" title="Dupliceren (D)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2"/>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                </button>
                <button class="drag-tool-btn" data-tool="delete" title="Verwijderen (Del)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                </button>
                <div class="drag-tool-divider"></div>
                <button class="drag-tool-btn" data-tool="undo" title="Ongedaan maken (Ctrl+Z)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 7v6h6"/>
                        <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/>
                    </svg>
                </button>
                <button class="drag-tool-btn" data-tool="redo" title="Opnieuw (Ctrl+Y)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 7v6h-6"/>
                        <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/>
                    </svg>
                </button>
                <div class="drag-tool-divider"></div>
                <button class="drag-tool-btn drag-save-btn" data-tool="save" title="Opslaan (Ctrl+S)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                        <polyline points="17,21 17,13 7,13 7,21"/>
                        <polyline points="7,3 7,8 15,8"/>
                    </svg>
                    <span>Opslaan</span>
                </button>
                <button class="drag-tool-btn drag-close-btn" data-tool="close" title="Sluiten">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        `;
        
        toolbar.style.display = 'none';
        document.body.appendChild(toolbar);
        this.toolbar = toolbar;
        
        // Bind toolbar events
        toolbar.querySelectorAll('.drag-tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = btn.dataset.tool;
                this.handleToolAction(tool);
            });
        });
    }
    
    // Create property panel for editing styles
    createPropertyPanel() {
        const panel = document.createElement('div');
        panel.className = 'property-panel';
        panel.innerHTML = `
            <div class="property-panel-header">
                <span class="property-title">Eigenschappen</span>
                <button class="property-close">&times;</button>
            </div>
            <div class="property-panel-body">
                <div class="property-section">
                    <div class="property-section-title">Positie & Grootte</div>
                    <div class="property-grid">
                        <div class="property-item">
                            <label>X</label>
                            <input type="number" id="prop-x" class="property-input">
                        </div>
                        <div class="property-item">
                            <label>Y</label>
                            <input type="number" id="prop-y" class="property-input">
                        </div>
                        <div class="property-item">
                            <label>Breedte</label>
                            <input type="text" id="prop-width" class="property-input" placeholder="auto">
                        </div>
                        <div class="property-item">
                            <label>Hoogte</label>
                            <input type="text" id="prop-height" class="property-input" placeholder="auto">
                        </div>
                    </div>
                </div>
                
                <div class="property-section">
                    <div class="property-section-title">Spacing</div>
                    <div class="property-grid">
                        <div class="property-item">
                            <label>Padding</label>
                            <input type="text" id="prop-padding" class="property-input" placeholder="0px">
                        </div>
                        <div class="property-item">
                            <label>Margin</label>
                            <input type="text" id="prop-margin" class="property-input" placeholder="0px">
                        </div>
                    </div>
                </div>
                
                <div class="property-section">
                    <div class="property-section-title">Tekst</div>
                    <div class="property-grid">
                        <div class="property-item full">
                            <label>Font</label>
                            <select id="prop-font" class="property-select">
                                <option value="inherit">Standaard</option>
                                <option value="'Inter', sans-serif">Inter</option>
                                <option value="'Space Grotesk', sans-serif">Space Grotesk</option>
                                <option value="Arial, sans-serif">Arial</option>
                                <option value="Georgia, serif">Georgia</option>
                            </select>
                        </div>
                        <div class="property-item">
                            <label>Grootte</label>
                            <input type="text" id="prop-font-size" class="property-input" placeholder="16px">
                        </div>
                        <div class="property-item">
                            <label>Gewicht</label>
                            <select id="prop-font-weight" class="property-select">
                                <option value="300">Light</option>
                                <option value="400">Normal</option>
                                <option value="500">Medium</option>
                                <option value="600">Semibold</option>
                                <option value="700">Bold</option>
                                <option value="800">Extra Bold</option>
                            </select>
                        </div>
                        <div class="property-item">
                            <label>Kleur</label>
                            <input type="color" id="prop-color" class="property-color">
                        </div>
                        <div class="property-item">
                            <label>Uitlijning</label>
                            <select id="prop-text-align" class="property-select">
                                <option value="left">Links</option>
                                <option value="center">Midden</option>
                                <option value="right">Rechts</option>
                                <option value="justify">Uitvullen</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="property-section">
                    <div class="property-section-title">Achtergrond</div>
                    <div class="property-grid">
                        <div class="property-item">
                            <label>Kleur</label>
                            <input type="color" id="prop-bg-color" class="property-color">
                        </div>
                        <div class="property-item">
                            <label>Opacity</label>
                            <input type="range" id="prop-opacity" min="0" max="100" value="100" class="property-range">
                        </div>
                    </div>
                </div>
                
                <div class="property-section">
                    <div class="property-section-title">Rand</div>
                    <div class="property-grid">
                        <div class="property-item">
                            <label>Dikte</label>
                            <input type="text" id="prop-border-width" class="property-input" placeholder="0px">
                        </div>
                        <div class="property-item">
                            <label>Kleur</label>
                            <input type="color" id="prop-border-color" class="property-color">
                        </div>
                        <div class="property-item">
                            <label>Radius</label>
                            <input type="text" id="prop-border-radius" class="property-input" placeholder="0px">
                        </div>
                        <div class="property-item">
                            <label>Stijl</label>
                            <select id="prop-border-style" class="property-select">
                                <option value="none">Geen</option>
                                <option value="solid">Solid</option>
                                <option value="dashed">Dashed</option>
                                <option value="dotted">Dotted</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="property-section">
                    <div class="property-section-title">Afbeelding</div>
                    <div class="property-grid" id="image-properties" style="display: none;">
                        <div class="property-item">
                            <label>Passend</label>
                            <select id="prop-object-fit" class="property-select">
                                <option value="cover">Vullen (Cover)</option>
                                <option value="contain">Passend (Contain)</option>
                                <option value="fill">Uitrekken (Fill)</option>
                                <option value="none">Origineel</option>
                                <option value="scale-down">Schaal Omlaag</option>
                            </select>
                        </div>
                        <div class="property-item">
                            <label>Positie H</label>
                            <select id="prop-object-pos-x" class="property-select">
                                <option value="left">Links</option>
                                <option value="center">Midden</option>
                                <option value="right">Rechts</option>
                            </select>
                        </div>
                        <div class="property-item">
                            <label>Positie V</label>
                            <select id="prop-object-pos-y" class="property-select">
                                <option value="top">Boven</option>
                                <option value="center">Midden</option>
                                <option value="bottom">Onder</option>
                            </select>
                        </div>
                        <div class="property-item">
                            <label>Container</label>
                            <select id="prop-img-align" class="property-select">
                                <option value="none">Geen</option>
                                <option value="left">Links uitlijnen</option>
                                <option value="center">Centreren</option>
                                <option value="right">Rechts uitlijnen</option>
                            </select>
                        </div>
                        <div class="property-item">
                            <label>Aspect Ratio</label>
                            <select id="prop-aspect-ratio" class="property-select">
                                <option value="auto">Automatisch</option>
                                <option value="1/1">1:1 Vierkant</option>
                                <option value="4/3">4:3</option>
                                <option value="16/9">16:9 Breed</option>
                                <option value="3/2">3:2</option>
                                <option value="2/3">2:3 Portret</option>
                            </select>
                        </div>
                        <div class="property-item">
                            <label>Max Breedte</label>
                            <input type="text" id="prop-max-width" class="property-input" placeholder="100%">
                        </div>
                    </div>
                </div>
                
                <div class="property-section">
                    <div class="property-section-title">Effecten</div>
                    <div class="property-grid">
                        <div class="property-item full">
                            <label>Schaduw</label>
                            <select id="prop-shadow" class="property-select">
                                <option value="none">Geen</option>
                                <option value="0 2px 4px rgba(0,0,0,0.1)">Subtiel</option>
                                <option value="0 4px 12px rgba(0,0,0,0.15)">Medium</option>
                                <option value="0 10px 30px rgba(0,0,0,0.2)">Groot</option>
                                <option value="0 20px 50px rgba(0,0,0,0.3)">Extra Groot</option>
                                <option value="0 0 30px rgba(0,102,204,0.3)">Glow Blauw</option>
                            </select>
                        </div>
                        <div class="property-item">
                            <label>Rotatie</label>
                            <input type="range" id="prop-rotate" min="-180" max="180" value="0" class="property-range">
                        </div>
                        <div class="property-item">
                            <label>Schaal</label>
                            <input type="range" id="prop-scale" min="50" max="150" value="100" class="property-range">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        panel.style.display = 'none';
        document.body.appendChild(panel);
        this.propertyPanel = panel;
        
        // Close button
        panel.querySelector('.property-close').addEventListener('click', () => {
            this.deselectElement();
        });
        
        // Bind property change events
        this.bindPropertyEvents();
    }
    
    // Bind property input events
    bindPropertyEvents() {
        const panel = this.propertyPanel;
        
        // Number inputs
        ['prop-x', 'prop-y'].forEach(id => {
            panel.querySelector(`#${id}`).addEventListener('input', (e) => {
                this.updateElementPosition();
            });
        });
        
        // Size inputs
        ['prop-width', 'prop-height', 'prop-padding', 'prop-margin'].forEach(id => {
            panel.querySelector(`#${id}`).addEventListener('input', (e) => {
                this.updateElementSize();
            });
        });
        
        // Text properties
        panel.querySelector('#prop-font').addEventListener('change', (e) => {
            if (this.selectedElement) {
                this.selectedElement.style.fontFamily = e.target.value;
                this.saveState();
            }
        });
        
        panel.querySelector('#prop-font-size').addEventListener('input', (e) => {
            if (this.selectedElement) {
                this.selectedElement.style.fontSize = e.target.value;
                this.saveState();
            }
        });
        
        panel.querySelector('#prop-font-weight').addEventListener('change', (e) => {
            if (this.selectedElement) {
                this.selectedElement.style.fontWeight = e.target.value;
                this.saveState();
            }
        });
        
        panel.querySelector('#prop-color').addEventListener('input', (e) => {
            if (this.selectedElement) {
                this.selectedElement.style.color = e.target.value;
                this.saveState();
            }
        });
        
        panel.querySelector('#prop-text-align').addEventListener('change', (e) => {
            if (this.selectedElement) {
                this.selectedElement.style.textAlign = e.target.value;
                this.saveState();
            }
        });
        
        // Image properties
        panel.querySelector('#prop-object-fit').addEventListener('change', (e) => {
            this.updateImageProperties();
        });
        
        panel.querySelector('#prop-object-pos-x').addEventListener('change', (e) => {
            this.updateImageProperties();
        });
        
        panel.querySelector('#prop-object-pos-y').addEventListener('change', (e) => {
            this.updateImageProperties();
        });
        
        panel.querySelector('#prop-img-align').addEventListener('change', (e) => {
            if (this.selectedElement) {
                const img = this.selectedElement.tagName === 'IMG' ? this.selectedElement : this.selectedElement.querySelector('img');
                if (img) {
                    const parent = img.parentElement;
                    const align = e.target.value;
                    
                    if (align === 'center') {
                        img.style.display = 'block';
                        img.style.marginLeft = 'auto';
                        img.style.marginRight = 'auto';
                    } else if (align === 'left') {
                        img.style.display = 'block';
                        img.style.marginLeft = '0';
                        img.style.marginRight = 'auto';
                    } else if (align === 'right') {
                        img.style.display = 'block';
                        img.style.marginLeft = 'auto';
                        img.style.marginRight = '0';
                    } else {
                        img.style.display = '';
                        img.style.marginLeft = '';
                        img.style.marginRight = '';
                    }
                    this.saveState();
                }
            }
        });
        
        panel.querySelector('#prop-aspect-ratio').addEventListener('change', (e) => {
            if (this.selectedElement) {
                const img = this.selectedElement.tagName === 'IMG' ? this.selectedElement : this.selectedElement.querySelector('img');
                if (img) {
                    img.style.aspectRatio = e.target.value;
                    this.saveState();
                }
            }
        });
        
        panel.querySelector('#prop-max-width').addEventListener('input', (e) => {
            if (this.selectedElement) {
                const img = this.selectedElement.tagName === 'IMG' ? this.selectedElement : this.selectedElement.querySelector('img');
                if (img) {
                    img.style.maxWidth = e.target.value;
                    this.saveState();
                }
            }
        });
        
        // Background
        panel.querySelector('#prop-bg-color').addEventListener('input', (e) => {
            if (this.selectedElement) {
                this.selectedElement.style.backgroundColor = e.target.value;
                this.saveState();
            }
        });
        
        panel.querySelector('#prop-opacity').addEventListener('input', (e) => {
            if (this.selectedElement) {
                this.selectedElement.style.opacity = e.target.value / 100;
                this.saveState();
            }
        });
        
        // Border
        ['prop-border-width', 'prop-border-color', 'prop-border-style', 'prop-border-radius'].forEach(id => {
            panel.querySelector(`#${id}`).addEventListener('input', (e) => {
                this.updateElementBorder();
            });
            panel.querySelector(`#${id}`).addEventListener('change', (e) => {
                this.updateElementBorder();
            });
        });
        
        // Effects
        panel.querySelector('#prop-shadow').addEventListener('change', (e) => {
            if (this.selectedElement) {
                this.selectedElement.style.boxShadow = e.target.value;
                this.saveState();
            }
        });
        
        panel.querySelector('#prop-rotate').addEventListener('input', (e) => {
            this.updateElementTransform();
        });
        
        panel.querySelector('#prop-scale').addEventListener('input', (e) => {
            this.updateElementTransform();
        });
    }
    
    // Update element position from inputs
    updateElementPosition() {
        if (!this.selectedElement) return;
        
        const x = this.propertyPanel.querySelector('#prop-x').value;
        const y = this.propertyPanel.querySelector('#prop-y').value;
        
        if (x) this.selectedElement.style.marginLeft = x + 'px';
        if (y) this.selectedElement.style.marginTop = y + 'px';
        
        this.saveState();
    }
    
    // Update element size from inputs
    updateElementSize() {
        if (!this.selectedElement) return;
        
        const width = this.propertyPanel.querySelector('#prop-width').value;
        const height = this.propertyPanel.querySelector('#prop-height').value;
        const padding = this.propertyPanel.querySelector('#prop-padding').value;
        const margin = this.propertyPanel.querySelector('#prop-margin').value;
        
        if (width) this.selectedElement.style.width = width.includes('px') || width.includes('%') ? width : width + 'px';
        if (height) this.selectedElement.style.height = height.includes('px') || height.includes('%') ? height : height + 'px';
        if (padding) this.selectedElement.style.padding = padding;
        if (margin) this.selectedElement.style.margin = margin;
        
        this.updateSelectionBox();
        this.saveState();
    }
    
    // Update element border
    updateElementBorder() {
        if (!this.selectedElement) return;
        
        const width = this.propertyPanel.querySelector('#prop-border-width').value || '0px';
        const color = this.propertyPanel.querySelector('#prop-border-color').value;
        const style = this.propertyPanel.querySelector('#prop-border-style').value;
        const radius = this.propertyPanel.querySelector('#prop-border-radius').value;
        
        this.selectedElement.style.border = `${width} ${style} ${color}`;
        if (radius) this.selectedElement.style.borderRadius = radius;
        
        this.saveState();
    }
    
    // Update element transform
    updateElementTransform() {
        if (!this.selectedElement) return;
        
        const rotate = this.propertyPanel.querySelector('#prop-rotate').value;
        const scale = this.propertyPanel.querySelector('#prop-scale').value / 100;
        
        this.selectedElement.style.transform = `rotate(${rotate}deg) scale(${scale})`;
        this.saveState();
    }
    
    // Update image properties
    updateImageProperties() {
        if (!this.selectedElement) return;
        
        const img = this.selectedElement.tagName === 'IMG' ? this.selectedElement : this.selectedElement.querySelector('img');
        if (!img) return;
        
        const objectFit = this.propertyPanel.querySelector('#prop-object-fit').value;
        const posX = this.propertyPanel.querySelector('#prop-object-pos-x').value;
        const posY = this.propertyPanel.querySelector('#prop-object-pos-y').value;
        
        img.style.objectFit = objectFit;
        img.style.objectPosition = `${posX} ${posY}`;
        
        this.saveState();
    }
    
    // Create context menu
    createContextMenu() {
        const menu = document.createElement('div');
        menu.className = 'drag-context-menu';
        menu.innerHTML = `
            <div class="context-menu-item" data-action="edit">
                <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Bewerken
            </div>
            <div class="context-menu-item" data-action="duplicate">
                <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                Dupliceren
            </div>
            <div class="context-menu-item" data-action="copy">
                <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                Kopiëren
            </div>
            <div class="context-menu-item" data-action="paste">
                <svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
                Plakken
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" data-action="bring-front">
                <svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><rect x="4" y="4" width="12" height="12" rx="2" fill="none"/></svg>
                Naar voren
            </div>
            <div class="context-menu-item" data-action="send-back">
                <svg viewBox="0 0 24 24"><rect x="4" y="4" width="12" height="12" rx="2"/><rect x="8" y="8" width="12" height="12" rx="2" fill="none"/></svg>
                Naar achteren
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item danger" data-action="delete">
                <svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                Verwijderen
            </div>
        `;
        
        menu.style.display = 'none';
        document.body.appendChild(menu);
        this.contextMenu = menu;
        
        // Bind context menu actions
        menu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                this.handleContextAction(item.dataset.action);
                this.hideContextMenu();
            });
        });
    }
    
    // Bind global events
    bindGlobalEvents() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!this.isDragMode) return;
            
            // Prevent when typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }
            
            switch(e.key.toLowerCase()) {
                case 'v':
                    this.currentTool = 'select';
                    break;
                case 'm':
                    this.currentTool = 'move';
                    break;
                case 'r':
                    this.currentTool = 'resize';
                    break;
                case 'd':
                    if (!e.ctrlKey) this.duplicateElement();
                    break;
                case 'delete':
                case 'backspace':
                    this.deleteElement();
                    break;
                case 'z':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.undo();
                    }
                    break;
                case 'y':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.redo();
                    }
                    break;
                case 's':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.saveStyles();
                    }
                    break;
                case 'escape':
                    this.deselectElement();
                    break;
            }
        });
        
        // Mouse events for dragging
        document.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));
        
        // Context menu
        document.addEventListener('contextmenu', (e) => {
            if (!this.isDragMode) return;
            if (e.target.closest('.drag-toolbar') || e.target.closest('.property-panel')) return;
            
            e.preventDefault();
            this.showContextMenu(e.clientX, e.clientY, e.target);
        });
        
        // Hide context menu on click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.drag-context-menu')) {
                this.hideContextMenu();
            }
        });
    }
    
    // Toggle drag mode
    toggleDragMode(enabled) {
        this.isDragMode = enabled;
        this.toolbar.style.display = enabled ? 'flex' : 'none';
        document.body.classList.toggle('drag-mode-active', enabled);
        
        if (enabled) {
            this.enableDragMode();
        } else {
            this.disableDragMode();
        }
    }
    
    // Enable drag mode on elements
    enableDragMode() {
        // Make elements selectable
        const editableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, img, div.card, div.service-card, div.project-card, div.stat-item, div.team-member, section, .hero-content, .hero-badge, .hero-title, .hero-subtitle, .about-image, .project-image');
        
        editableElements.forEach(el => {
            if (el.closest('.admin-panel') || el.closest('.drag-toolbar') || el.closest('.property-panel') || el.closest('.drag-context-menu')) return;
            
            el.classList.add('drag-selectable');
            
            // Add data attribute for identification
            if (!el.dataset.dragId) {
                el.dataset.dragId = 'el-' + Math.random().toString(36).substr(2, 9);
            }
        });
    }
    
    // Disable drag mode
    disableDragMode() {
        document.querySelectorAll('.drag-selectable').forEach(el => {
            el.classList.remove('drag-selectable', 'drag-selected');
        });
        
        this.deselectElement();
        this.propertyPanel.style.display = 'none';
    }
    
    // Mouse down handler
    onMouseDown(e) {
        if (!this.isDragMode) return;
        if (e.target.closest('.drag-toolbar') || e.target.closest('.property-panel') || e.target.closest('.drag-context-menu')) return;
        
        const element = e.target.closest('.drag-selectable');
        
        // Check if clicking on resize handle
        if (e.target.classList.contains('resize-handle')) {
            this.resizing = true;
            this.resizeHandle = e.target.dataset.position;
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.startWidth = this.selectedElement.offsetWidth;
            this.startHeight = this.selectedElement.offsetHeight;
            e.preventDefault();
            return;
        }
        
        if (element) {
            // Select element
            this.selectElement(element);
            
            // Start dragging
            this.draggedElement = element;
            this.startX = e.clientX;
            this.startY = e.clientY;
            
            const rect = element.getBoundingClientRect();
            this.startLeft = rect.left;
            this.startTop = rect.top;
            
            e.preventDefault();
        } else {
            this.deselectElement();
        }
    }
    
    // Mouse move handler
    onMouseMove(e) {
        if (!this.isDragMode) return;
        
        // Resizing
        if (this.resizing && this.selectedElement) {
            const dx = e.clientX - this.startX;
            const dy = e.clientY - this.startY;
            
            if (this.resizeHandle.includes('e')) {
                this.selectedElement.style.width = (this.startWidth + dx) + 'px';
            }
            if (this.resizeHandle.includes('w')) {
                this.selectedElement.style.width = (this.startWidth - dx) + 'px';
            }
            if (this.resizeHandle.includes('s')) {
                this.selectedElement.style.height = (this.startHeight + dy) + 'px';
            }
            if (this.resizeHandle.includes('n')) {
                this.selectedElement.style.height = (this.startHeight - dy) + 'px';
            }
            
            this.updateSelectionBox();
            return;
        }
        
        // Dragging
        if (this.draggedElement && this.currentTool !== 'select') {
            const dx = e.clientX - this.startX;
            const dy = e.clientY - this.startY;
            
            // Use transform for smooth dragging
            this.draggedElement.style.transform = `translate(${dx}px, ${dy}px)`;
            this.draggedElement.classList.add('dragging');
        }
    }
    
    // Mouse up handler
    onMouseUp(e) {
        if (this.resizing) {
            this.resizing = false;
            this.resizeHandle = null;
            this.saveState();
            this.updatePropertyPanel();
        }
        
        if (this.draggedElement && this.draggedElement.classList.contains('dragging')) {
            // Apply final position
            const dx = e.clientX - this.startX;
            const dy = e.clientY - this.startY;
            
            const currentMarginLeft = parseInt(getComputedStyle(this.draggedElement).marginLeft) || 0;
            const currentMarginTop = parseInt(getComputedStyle(this.draggedElement).marginTop) || 0;
            
            this.draggedElement.style.marginLeft = (currentMarginLeft + dx) + 'px';
            this.draggedElement.style.marginTop = (currentMarginTop + dy) + 'px';
            this.draggedElement.style.transform = '';
            
            this.draggedElement.classList.remove('dragging');
            this.updateSelectionBox();
            this.saveState();
            this.updatePropertyPanel();
        }
        
        this.draggedElement = null;
    }
    
    // Select an element
    selectElement(element) {
        // Deselect previous
        if (this.selectedElement) {
            this.selectedElement.classList.remove('drag-selected');
            this.removeSelectionBox();
        }
        
        this.selectedElement = element;
        element.classList.add('drag-selected');
        
        // Create selection box with resize handles
        this.createSelectionBox(element);
        
        // Show and update property panel
        this.propertyPanel.style.display = 'block';
        this.updatePropertyPanel();
    }
    
    // Deselect element
    deselectElement() {
        if (this.selectedElement) {
            this.selectedElement.classList.remove('drag-selected');
            this.removeSelectionBox();
            this.selectedElement = null;
        }
        this.propertyPanel.style.display = 'none';
    }
    
    // Create selection box with handles
    createSelectionBox(element) {
        this.removeSelectionBox();
        
        const box = document.createElement('div');
        box.className = 'selection-box';
        
        // Add resize handles
        const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
        handles.forEach(pos => {
            const handle = document.createElement('div');
            handle.className = `resize-handle resize-${pos}`;
            handle.dataset.position = pos;
            box.appendChild(handle);
        });
        
        document.body.appendChild(box);
        this.selectionBox = box;
        this.updateSelectionBox();
    }
    
    // Update selection box position
    updateSelectionBox() {
        if (!this.selectionBox || !this.selectedElement) return;
        
        const rect = this.selectedElement.getBoundingClientRect();
        this.selectionBox.style.left = rect.left + window.scrollX + 'px';
        this.selectionBox.style.top = rect.top + window.scrollY + 'px';
        this.selectionBox.style.width = rect.width + 'px';
        this.selectionBox.style.height = rect.height + 'px';
    }
    
    // Remove selection box
    removeSelectionBox() {
        if (this.selectionBox) {
            this.selectionBox.remove();
            this.selectionBox = null;
        }
    }
    
    // Update property panel with element styles
    updatePropertyPanel() {
        if (!this.selectedElement) return;
        
        const el = this.selectedElement;
        const computed = window.getComputedStyle(el);
        const panel = this.propertyPanel;
        
        // Position
        panel.querySelector('#prop-x').value = parseInt(computed.marginLeft) || 0;
        panel.querySelector('#prop-y').value = parseInt(computed.marginTop) || 0;
        
        // Size
        panel.querySelector('#prop-width').value = el.style.width || '';
        panel.querySelector('#prop-height').value = el.style.height || '';
        panel.querySelector('#prop-padding').value = el.style.padding || '';
        panel.querySelector('#prop-margin').value = el.style.margin || '';
        
        // Text
        panel.querySelector('#prop-font-size').value = computed.fontSize;
        panel.querySelector('#prop-font-weight').value = computed.fontWeight;
        panel.querySelector('#prop-color').value = this.rgbToHex(computed.color);
        panel.querySelector('#prop-text-align').value = computed.textAlign;
        
        // Background
        panel.querySelector('#prop-bg-color').value = this.rgbToHex(computed.backgroundColor);
        panel.querySelector('#prop-opacity').value = parseFloat(computed.opacity) * 100;
        
        // Border
        panel.querySelector('#prop-border-width').value = computed.borderWidth;
        panel.querySelector('#prop-border-color').value = this.rgbToHex(computed.borderColor);
        panel.querySelector('#prop-border-style').value = computed.borderStyle;
        panel.querySelector('#prop-border-radius').value = computed.borderRadius;
        
        // Image properties - show/hide based on element type
        const imagePropsSection = panel.querySelector('#image-properties');
        const img = el.tagName === 'IMG' ? el : el.querySelector('img');
        
        if (img) {
            imagePropsSection.style.display = 'grid';
            const imgComputed = window.getComputedStyle(img);
            
            panel.querySelector('#prop-object-fit').value = imgComputed.objectFit || 'cover';
            
            const objPos = imgComputed.objectPosition || 'center center';
            const [posX, posY] = objPos.split(' ');
            panel.querySelector('#prop-object-pos-x').value = posX.includes('left') ? 'left' : posX.includes('right') ? 'right' : 'center';
            panel.querySelector('#prop-object-pos-y').value = posY && posY.includes('top') ? 'top' : posY && posY.includes('bottom') ? 'bottom' : 'center';
            
            // Container alignment
            const marginL = imgComputed.marginLeft;
            const marginR = imgComputed.marginRight;
            if (marginL === 'auto' && marginR === 'auto') {
                panel.querySelector('#prop-img-align').value = 'center';
            } else if (marginL === 'auto') {
                panel.querySelector('#prop-img-align').value = 'right';
            } else if (marginR === 'auto') {
                panel.querySelector('#prop-img-align').value = 'left';
            } else {
                panel.querySelector('#prop-img-align').value = 'none';
            }
            
            panel.querySelector('#prop-aspect-ratio').value = img.style.aspectRatio || 'auto';
            panel.querySelector('#prop-max-width').value = img.style.maxWidth || '';
        } else {
            imagePropsSection.style.display = 'none';
        }
    }
    
    // Convert RGB to HEX
    rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return '#000000';
        
        const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return '#000000';
        
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        
        return '#' + r + g + b;
    }
    
    // Handle toolbar actions
    handleToolAction(tool) {
        switch(tool) {
            case 'select':
            case 'move':
            case 'resize':
                this.currentTool = tool;
                this.updateToolbarState(tool);
                break;
            case 'duplicate':
                this.duplicateElement();
                break;
            case 'delete':
                this.deleteElement();
                break;
            case 'undo':
                this.undo();
                break;
            case 'redo':
                this.redo();
                break;
            case 'save':
                this.saveStyles();
                break;
            case 'close':
                this.toggleDragMode(false);
                if (window.liveEditor) {
                    window.liveEditor.toggleEditMode();
                }
                break;
        }
    }
    
    // Update toolbar button states
    updateToolbarState(activeTool) {
        this.toolbar.querySelectorAll('.drag-tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === activeTool);
        });
    }
    
    // Handle context menu actions
    handleContextAction(action) {
        switch(action) {
            case 'edit':
                if (this.selectedElement && this.selectedElement.hasAttribute('contenteditable') === false) {
                    this.selectedElement.setAttribute('contenteditable', 'true');
                    this.selectedElement.focus();
                }
                break;
            case 'duplicate':
                this.duplicateElement();
                break;
            case 'copy':
                this.copiedElement = this.selectedElement?.cloneNode(true);
                break;
            case 'paste':
                if (this.copiedElement && this.selectedElement) {
                    const clone = this.copiedElement.cloneNode(true);
                    clone.dataset.dragId = 'el-' + Math.random().toString(36).substr(2, 9);
                    this.selectedElement.parentNode.insertBefore(clone, this.selectedElement.nextSibling);
                    this.selectElement(clone);
                    this.saveState();
                }
                break;
            case 'bring-front':
                if (this.selectedElement) {
                    this.selectedElement.style.zIndex = (parseInt(this.selectedElement.style.zIndex) || 0) + 1;
                    this.saveState();
                }
                break;
            case 'send-back':
                if (this.selectedElement) {
                    this.selectedElement.style.zIndex = Math.max(0, (parseInt(this.selectedElement.style.zIndex) || 0) - 1);
                    this.saveState();
                }
                break;
            case 'delete':
                this.deleteElement();
                break;
        }
    }
    
    // Duplicate element
    duplicateElement() {
        if (!this.selectedElement) return;
        
        const clone = this.selectedElement.cloneNode(true);
        clone.dataset.dragId = 'el-' + Math.random().toString(36).substr(2, 9);
        clone.style.marginTop = (parseInt(clone.style.marginTop) || 0) + 20 + 'px';
        clone.style.marginLeft = (parseInt(clone.style.marginLeft) || 0) + 20 + 'px';
        
        this.selectedElement.parentNode.insertBefore(clone, this.selectedElement.nextSibling);
        clone.classList.add('drag-selectable');
        
        this.selectElement(clone);
        this.saveState();
    }
    
    // Delete element
    deleteElement() {
        if (!this.selectedElement) return;
        
        if (confirm('Weet je zeker dat je dit element wilt verwijderen?')) {
            this.selectedElement.remove();
            this.deselectElement();
            this.saveState();
        }
    }
    
    // Show context menu
    showContextMenu(x, y, target) {
        const element = target.closest('.drag-selectable');
        if (element) {
            this.selectElement(element);
        }
        
        this.contextMenu.style.left = x + 'px';
        this.contextMenu.style.top = y + 'px';
        this.contextMenu.style.display = 'block';
    }
    
    // Hide context menu
    hideContextMenu() {
        this.contextMenu.style.display = 'none';
    }
    
    // Save state for undo/redo
    saveState() {
        // Store element styles
        document.querySelectorAll('.drag-selectable').forEach(el => {
            if (el.dataset.dragId) {
                this.elementStyles[el.dataset.dragId] = el.getAttribute('style') || '';
            }
        });
        
        // Add to history
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(JSON.stringify(this.elementStyles));
        this.historyIndex++;
        
        // Limit history
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }
    
    // Undo
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.applyState(JSON.parse(this.history[this.historyIndex]));
        }
    }
    
    // Redo
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.applyState(JSON.parse(this.history[this.historyIndex]));
        }
    }
    
    // Apply saved state
    applyState(state) {
        Object.keys(state).forEach(id => {
            const el = document.querySelector(`[data-drag-id="${id}"]`);
            if (el) {
                el.setAttribute('style', state[id]);
            }
        });
        this.updateSelectionBox();
        this.updatePropertyPanel();
    }
    
    // Save styles to localStorage
    saveStyles() {
        const styles = {};
        document.querySelectorAll('.drag-selectable').forEach(el => {
            if (el.dataset.dragId && el.getAttribute('style')) {
                styles[el.dataset.dragId] = el.getAttribute('style');
            }
        });
        
        localStorage.setItem('aim_drag_styles', JSON.stringify(styles));
        
        // Show save notification
        this.showNotification('✅ Layout opgeslagen! Pagina wordt ververst...');
        
        // Refresh page after short delay
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
    
    // Load saved styles
    loadSavedStyles() {
        try {
            const saved = localStorage.getItem('aim_drag_styles');
            if (saved) {
                this.elementStyles = JSON.parse(saved);
                
                // Apply on next frame to ensure elements exist
                requestAnimationFrame(() => {
                    this.applyState(this.elementStyles);
                });
            }
        } catch (e) {
            console.warn('Could not load saved styles:', e);
        }
    }
    
    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'drag-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.dragEditor = new DragEditor();
});
