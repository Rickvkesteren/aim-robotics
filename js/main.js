/* ============================================
   AIM-ROBOTICS - Main JavaScript
   Core functionality and interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initLoader();
    initNavigation();
    initScrollEffects();
    initCounters();
    initParticles();
    initContactForm();
    initSmoothScroll();
    initScrollNudge();
    initBackToTop();
    initButtonRipple();
    initParallax();
    initRevealAnimations();
    initScrollProgress();
});

/* ============================================
   LOADER
   ============================================ */
function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 1500);
    });
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');
    
    // Scroll effect for navbar
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    // Close mobile menu on link click
    links.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ============================================
   SCROLL EFFECTS & AOS
   ============================================ */
function initScrollEffects() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   ANIMATED COUNTERS
   ============================================ */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetNumber = parseInt(target.getAttribute('data-target'));
                animateCounter(target, targetNumber);
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 1500;
    const stepTime = duration / 50;
    
    const timer = setInterval(function() {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

/* ============================================
   PARTICLES BACKGROUND
   ============================================ */
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random size
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random animation duration
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particle.style.animationDelay = (Math.random() * 5) + 's';
    
    // Random opacity
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    
    container.appendChild(particle);
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // accessibility.js provides WCAG-friendly validation and submission UX
    if (form.dataset && form.dataset.a11yValidation === 'true') return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span> Verzenden...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(function() {
            showToast('success', 'Bedankt! Uw bericht is verzonden. We nemen snel contact met u op.');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

function validateForm(data) {
    if (!data.name || data.name.trim() === '') {
        showToast('error', 'Vul uw naam in');
        return false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showToast('error', 'Vul een geldig e-mailadres in');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/* ============================================
   TOAST NOTIFICATIONS
   ============================================ */
function showToast(type, message) {
    // Create toast container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || 'ℹ'}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close">✕</button>
    `;
    
    container.appendChild(toast);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', function() {
        removeToast(toast);
    });
    
    // Auto remove after 5 seconds
    setTimeout(function() {
        removeToast(toast);
    }, 5000);
}

function removeToast(toast) {
    toast.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(function() {
        toast.remove();
    }, 300);
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (!target) return;
            
            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ============================================
   SCROLL NUDGE (buffer / "there is more")
   ============================================ */
function initScrollNudge() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const storageKey = 'aim_scroll_nudge_done';
    try {
        if (sessionStorage.getItem(storageKey) === '1') return;
    } catch (e) {
        // Ignore storage errors
    }

    let hasTriggered = false;
    const trigger = () => {
        if (hasTriggered) return;
        if (window.scrollY > 10) return;

        hasTriggered = true;
        try {
            sessionStorage.setItem(storageKey, '1');
        } catch (e) {
            // Ignore storage errors
        }

        hero.classList.remove('nudge');
        requestAnimationFrame(() => {
            hero.classList.add('nudge');
        });

        const onEnd = (e) => {
            if (e.animationName !== 'heroNudge') return;
            hero.classList.remove('nudge');
            hero.removeEventListener('animationend', onEnd);
        };

        hero.addEventListener('animationend', onEnd);

        // Fallback cleanup
        setTimeout(() => {
            hero.classList.remove('nudge');
            hero.removeEventListener('animationend', onEnd);
        }, 900);
    };

    window.addEventListener('wheel', function(e) {
        if (e.deltaY > 0) trigger();
    }, { passive: true });

    let touchStartY = null;
    window.addEventListener('touchstart', function(e) {
        if (!e.touches || e.touches.length === 0) return;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', function(e) {
        if (touchStartY === null) return;
        if (!e.touches || e.touches.length === 0) return;

        const dy = touchStartY - e.touches[0].clientY;
        if (dy > 10) trigger();
    }, { passive: true });
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get scroll percentage
function getScrollPercentage() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return (scrollTop / docHeight) * 100;
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, 100));
    
    // Scroll to top on click
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================
   BUTTON RIPPLE EFFECT
   ============================================ */
function initButtonRipple() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Remove existing ripple
            const existingRipple = button.querySelector('.btn-ripple');
            if (existingRipple) {
                existingRipple.remove();
            }
            
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            
            // Get position
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            button.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/* ============================================
   PARALLAX SCROLLING
   ============================================ */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    const heroContent = document.querySelector('.hero-content');
    const heroVideo = document.querySelector('.hero-video');
 
    // Decorative parallax blob layers disabled to keep backgrounds neutral.
    
    window.addEventListener('scroll', throttle(function() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Hero parallax effect
        if (heroContent && scrolled < windowHeight) {
            const opacity = 1 - (scrolled / (windowHeight * 0.8));
            const translateY = scrolled * 0.4;
            const scale = 1 - (scrolled / windowHeight) * 0.1;
            
            heroContent.style.transform = `translateY(${translateY}px) scale(${scale})`;
            heroContent.style.opacity = Math.max(0, opacity);
        }
        
        // Video parallax (slower movement)
        if (heroVideo && scrolled < windowHeight) {
            heroVideo.style.transform = `translateY(${scrolled * 0.2}px) scale(1.1)`;
        }
        
        // Parallax elements
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const rect = element.getBoundingClientRect();
            const inView = rect.top < windowHeight && rect.bottom > 0;
            
            if (inView) {
                const yPos = (rect.top - windowHeight) * speed * 0.1;
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
        
        // Section parallax backgrounds
        document.querySelectorAll('.section').forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom > 0) {
                const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
                const bgPos = progress * 30;
                section.style.setProperty('--parallax-offset', `${bgPos}px`);
            }
        });
        
    }, 16)); // ~60fps
}

function createParallaxLayers() {
    // Intentionally disabled.
    return;
}

/* ============================================
   SMOOTH REVEAL ANIMATIONS
   ============================================ */
function initRevealAnimations() {
    // Configure reveal animations for different element types
    const revealConfig = {
        // Cards get staggered reveal
        cards: {
            selector: '.dienst-card, .project-card, .industry-card, .team-card, .testimonial-card',
            threshold: 0.15,
            stagger: 100
        },
        // Images get scale reveal
        images: {
            selector: '.project-image img, .about-image img, .project-card-image img',
            threshold: 0.2,
            animation: 'scaleReveal'
        },
        // Text blocks get slide reveal
        text: {
            selector: '.section-header, .project-content, .about-content, .proces-content',
            threshold: 0.2,
            animation: 'slideReveal'
        },
        // Steps get sequential reveal
        steps: {
            selector: '.step',
            threshold: 0.3,
            stagger: 150,
            animation: 'slideInLeft'
        }
    };
    
    // Create intersection observer for each config
    Object.values(revealConfig).forEach(config => {
        const elements = document.querySelectorAll(config.selector);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = config.stagger ? index * config.stagger : 0;
                    
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                        if (config.animation) {
                            entry.target.classList.add(config.animation);
                        }
                    }, delay);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: config.threshold,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => {
            el.classList.add('reveal-element');
            observer.observe(el);
        });
    });
    
    // Special handling for section reveals
    initSectionReveals();
}

function initSectionReveals() {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                
                // Trigger child animations
                const children = entry.target.querySelectorAll('.reveal-element:not(.revealed)');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('revealed');
                    }, index * 80);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-10% 0px -10% 0px'
    });
    
    sections.forEach(section => observer.observe(section));
}

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */
function initScrollProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);
    
    const bar = progressBar.querySelector('.scroll-progress-bar');
    
    window.addEventListener('scroll', throttle(function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        
        bar.style.width = `${progress}%`;
    }, 16));
}
