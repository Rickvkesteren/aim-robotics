/**
 * Accessibility Enhancement Script
 * Improves keyboard navigation, form validation, and WCAG compliance
 */

(function() {
    'use strict';

    // Mark decorative inline SVG icons as hidden from assistive tech
    function markDecorativeSvgs() {
        const svgs = document.querySelectorAll('svg');
        svgs.forEach(svg => {
            // Respect explicit accessibility attributes
            if (svg.hasAttribute('aria-hidden') || svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby') || svg.hasAttribute('role')) {
                return;
            }

            // If author provided <title> or <desc>, treat as meaningful
            if (svg.querySelector('title, desc')) {
                if (!svg.hasAttribute('role')) svg.setAttribute('role', 'img');
                return;
            }

            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('focusable', 'false');
        });
    }

    markDecorativeSvgs();

    // Track keyboard usage for focus styles
    function handleFirstTab(e) {
        if (e.keyCode === 9) {
            document.body.classList.add('user-is-tabbing');
            window.removeEventListener('keydown', handleFirstTab);
            window.addEventListener('mousedown', handleMouseDownOnce);
        }
    }

    function handleMouseDownOnce() {
        document.body.classList.remove('user-is-tabbing');
        window.removeEventListener('mousedown', handleMouseDownOnce);
        window.addEventListener('keydown', handleFirstTab);
    }

    window.addEventListener('keydown', handleFirstTab);

    // Hamburger menu accessibility
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            
            // Trap focus when mobile menu is open
            if (!isExpanded) {
                trapFocus(navLinks);
            } else {
                removeFocusTrap();
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
                hamburger.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                hamburger.focus();
                removeFocusTrap();
            }
        });
    }

    // Focus trap for mobile menu
    let focusableElements = [];
    let firstFocusableElement = null;
    let lastFocusableElement = null;

    function trapFocus(element) {
        focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
        );
        firstFocusableElement = focusableElements[0];
        lastFocusableElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', handleFocusTrap);
    }

    function handleFocusTrap(e) {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }

    function removeFocusTrap() {
        if (navLinks) {
            navLinks.removeEventListener('keydown', handleFocusTrap);
        }
    }

    // Form validation with accessible error messages
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Prevent other scripts from attaching conflicting submit handlers
        contactForm.dataset.a11yValidation = 'true';

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const nameInput = document.getElementById('name');
            const companyInput = document.getElementById('company');
            const emailInput = document.getElementById('email');
            
            // Clear previous errors
            clearErrors();
            
            // Validate name
            if (!nameInput.value.trim()) {
                showError(nameInput, 'name-error', 'Naam is verplicht');
                isValid = false;
            }

            // Validate company
            if (companyInput && !companyInput.value.trim()) {
                showError(companyInput, 'company-error', 'Bedrijf is verplicht');
                isValid = false;
            }
            
            // Validate email
            if (!emailInput.value.trim()) {
                showError(emailInput, 'email-error', 'E-mail is verplicht');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'email-error', 'Voer een geldig e-mailadres in');
                isValid = false;
            }
            
            if (isValid) {
                // Form is valid, you can submit it here
                console.log('Form is valid and ready to submit');
                // Uncomment below to actually submit:
                // this.submit();
                
                // Show success message (you should implement this)
                alert('Bedankt voor je bericht! We nemen zo spoedig mogelijk contact met je op.');
                contactForm.reset();
            } else {
                // Focus on first error
                const firstError = contactForm.querySelector('.has-error input, .has-error textarea');
                if (firstError) {
                    firstError.focus();
                }
            }
        });
        
        // Real-time validation
        const requiredFields = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                if (this.parentElement.classList.contains('has-error')) {
                    validateField(this);
                }
            });
        });
    }
    
    function validateField(field) {
        const errorId = field.getAttribute('aria-describedby');
        const errorElement = document.getElementById(errorId);
        
        if (field.id === 'name') {
            if (!field.value.trim()) {
                showError(field, errorId, 'Naam is verplicht');
            } else {
                clearFieldError(field, errorId);
            }
        }
        
        if (field.id === 'email') {
            if (!field.value.trim()) {
                showError(field, errorId, 'E-mail is verplicht');
            } else if (!isValidEmail(field.value)) {
                showError(field, errorId, 'Voer een geldig e-mailadres in');
            } else {
                clearFieldError(field, errorId);
            }
        }

        if (field.id === 'company') {
            if (!field.value.trim()) {
                showError(field, errorId, 'Bedrijf is verplicht');
            } else {
                clearFieldError(field, errorId);
            }
        }
    }
    
    function showError(input, errorId, message) {
        const errorElement = document.getElementById(errorId);
        const formGroup = input.closest('.form-group');
        
        if (errorElement) {
            errorElement.textContent = message;
            formGroup.classList.add('has-error');
            input.setAttribute('aria-invalid', 'true');
        }
    }
    
    function clearFieldError(input, errorId) {
        const errorElement = document.getElementById(errorId);
        const formGroup = input.closest('.form-group');
        
        if (errorElement) {
            errorElement.textContent = '';
            formGroup.classList.remove('has-error');
            input.setAttribute('aria-invalid', 'false');
        }
    }
    
    function clearErrors() {
        const errorMessages = contactForm.querySelectorAll('.error-message');
        const formGroups = contactForm.querySelectorAll('.form-group');
        
        errorMessages.forEach(error => error.textContent = '');
        formGroups.forEach(group => group.classList.remove('has-error'));
        
        const inputs = contactForm.querySelectorAll('input[aria-invalid], textarea[aria-invalid], select[aria-invalid]');
        inputs.forEach(input => input.setAttribute('aria-invalid', 'false'));
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Skip link smooth scroll
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Announce page changes to screen readers (for SPA-like navigation)
    const navLinksArray = document.querySelectorAll('.nav-link');
    navLinksArray.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Update active state
                    navLinksArray.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Announce to screen readers
                    announceToScreenReader(`Navigating to ${this.textContent} section`);
                }
            }
        });
    });

    // Screen reader announcements
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Update stat numbers aria-label when animation completes
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    statNumbers.forEach(stat => {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    const currentValue = stat.textContent;
                    const suffix = stat.nextElementSibling?.textContent || '';
                    stat.setAttribute('aria-label', currentValue + suffix);
                }
            });
        });
        
        observer.observe(stat, { childList: true, characterData: true, subtree: true });
    });

    // Improve video accessibility - pause on user preference
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        heroVideo.pause();
        heroVideo.removeAttribute('autoplay');
    }

    // Select dropdown placeholder color handling
    const selectElements = document.querySelectorAll('select');
    selectElements.forEach(select => {
        // Set initial color based on value
        if (!select.value || select.value === '') {
            select.style.color = '#757575';
        } else {
            select.style.color = '#1a1a1a';
        }
        
        // Update color on change
        select.addEventListener('change', function() {
            if (!this.value || this.value === '') {
                this.style.color = '#757575';
            } else {
                this.style.color = '#1a1a1a';
            }
        });
    });

    // Loading screen accessibility - remove from DOM after load
    window.addEventListener('load', function() {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    loader.setAttribute('aria-hidden', 'true');
                    announceToScreenReader('Page loaded successfully');
                }, 500);
            }, 1500);
        }
    });

    // Back to top button accessibility
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        // Show/hide based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'flex';
                backToTopButton.setAttribute('aria-hidden', 'false');
            } else {
                backToTopButton.style.display = 'none';
                backToTopButton.setAttribute('aria-hidden', 'true');
            }
        });

        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Focus on skip link after scrolling to top
            setTimeout(() => {
                const skipLink = document.querySelector('.skip-link');
                if (skipLink) {
                    skipLink.focus();
                }
            }, 500);
        });
    }

    console.log('✓ Accessibility enhancements loaded');
})();
