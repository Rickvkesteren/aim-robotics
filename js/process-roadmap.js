/**
 * Process Roadmap - Interactive Journey
 * Handles scroll-based animations and navigation highlighting
 */

class ProcessRoadmap {
    constructor() {
        this.sections = document.querySelectorAll('.process-section');
        this.navLinks = document.querySelectorAll('.process-step-link');
        this.connectors = document.querySelectorAll('.step-connector');
        this.routeMarkers = document.querySelectorAll('.route-marker');
        this.routeLine = document.querySelector('.roadmap-route');
        this.currentSection = 1;
        
        if (this.sections.length === 0) return;
        
        this.init();
    }
    
    init() {
        // Position route markers
        this.positionRouteMarkers();
        
        // Set up Intersection Observer for sections
        this.setupIntersectionObserver();
        
        // Smooth scroll for nav links
        this.setupNavLinks();
        
        // Update on scroll for progress
        this.setupScrollListener();
        
        // Initial state
        this.updateNavigation(1);
        
        // Reposition on resize
        window.addEventListener('resize', () => this.positionRouteMarkers());
    }
    
    positionRouteMarkers() {
        if (!this.routeLine || this.routeMarkers.length === 0) return;
        
        this.sections.forEach((section, index) => {
            const marker = this.routeMarkers[index];
            if (!marker) return;
            
            // Get section position relative to roadmap container
            const sectionRect = section.getBoundingClientRect();
            const containerRect = section.offsetParent?.getBoundingClientRect() || { top: 0 };
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Position marker at center of section
            const markerTop = sectionTop + (sectionHeight / 2) - 14; // 14 = half of marker height
            marker.style.top = `${markerTop}px`;
        });
    }
    
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const phase = parseInt(entry.target.dataset.phase);
                    this.currentSection = phase;
                    this.updateNavigation(phase);
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, options);
        
        this.sections.forEach(section => observer.observe(section));
    }
    
    setupNavLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offset = 180; // Account for sticky nav
                    const targetPosition = targetSection.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    setupScrollListener() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateProgressLine();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    updateNavigation(activePhase) {
        this.navLinks.forEach((link, index) => {
            const step = parseInt(link.dataset.step);
            
            // Remove all states
            link.classList.remove('active', 'completed');
            
            if (step === activePhase) {
                link.classList.add('active');
            } else if (step < activePhase) {
                link.classList.add('completed');
            }
        });
        
        // Update connectors
        this.connectors.forEach((connector, index) => {
            if (index < activePhase - 1) {
                connector.classList.add('completed');
            } else {
                connector.classList.remove('completed');
            }
        });
        
        // Update route markers
        this.routeMarkers.forEach((marker, index) => {
            const phase = index + 1;
            marker.classList.remove('active', 'completed');
            
            if (phase === activePhase) {
                marker.classList.add('active');
            } else if (phase < activePhase) {
                marker.classList.add('completed');
            }
        });
        
        // Update route progress line
        this.updateRouteProgress(activePhase);
        
        // Scroll nav into view if needed (for mobile)
        const activeLink = document.querySelector('.process-step-link.active');
        if (activeLink) {
            const navContainer = document.querySelector('.process-nav-container');
            if (navContainer) {
                const linkRect = activeLink.getBoundingClientRect();
                const containerRect = navContainer.getBoundingClientRect();
                
                if (linkRect.left < containerRect.left || linkRect.right > containerRect.right) {
                    activeLink.scrollIntoView({ 
                        behavior: 'smooth', 
                        inline: 'center',
                        block: 'nearest'
                    });
                }
            }
        }
    }
    
    updateProgressLine() {
        const progressLine = document.querySelector('.roadmap-progress-fill');
        if (!progressLine) return;
        
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = Math.min((scrolled / docHeight) * 100, 100);
        
        progressLine.style.height = `${progress}%`;
    }
    
    updateRouteProgress(activePhase) {
        if (!this.routeLine) return;
        
        // Calculate progress percentage based on active phase
        const totalPhases = this.sections.length;
        const progress = ((activePhase - 0.5) / totalPhases) * 100;
        
        this.routeLine.style.setProperty('--progress', `${progress}%`);
    }
}

// Animate elements on scroll
class ScrollAnimator {
    constructor() {
        this.animatedElements = document.querySelectorAll('.phase-header, .phase-details, .phase-visual, .detail-card, .flexibility-card');
        
        if (this.animatedElements.length === 0) return;
        
        this.init();
    }
    
    init() {
        const options = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, options);
        
        this.animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProcessRoadmap();
    new ScrollAnimator();
});

// Also handle page navigation state
window.addEventListener('load', () => {
    // Check if there's a hash in URL and scroll to it
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                const offset = 180;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
});
