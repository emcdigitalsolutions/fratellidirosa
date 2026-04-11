/**
 * Fratelli Di Rosa - Main JavaScript
 * Smooth scroll, navbar, animazioni IntersectionObserver, mobile menu, form validation
 */

(function () {
    'use strict';

    // ========== SCROLL PROGRESS BAR ==========

    var scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        if (!scrollProgress) return;
        var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        var scrolled = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
        scrollProgress.style.width = scrolled + '%';
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    // ========== HERO FLOATING PARTICLES ==========

    var particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        // Solo piccole croci fluttuanti, movimento lento e delicato
        for (var i = 0; i < 18; i++) {
            var particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            // Ritardo ampio per distribuzione naturale
            particle.style.animationDelay = (Math.random() * 20) + 's';
            // Durata 18-30s: molto piu lenta di prima (era 6-12s)
            particle.style.animationDuration = (18 + Math.random() * 12) + 's';
            // Piccole croci: 8-14px (proporzione croce latina: altezza > larghezza)
            var width = 6 + Math.random() * 5;
            var height = width * 1.6;
            particle.style.width = width + 'px';
            particle.style.height = height + 'px';
            particlesContainer.appendChild(particle);
        }
    }

    // ========== NAVBAR SCROLL BEHAVIOR ==========

    var header = document.getElementById('header');
    var scrollThreshold = 80;

    function handleNavbarScroll() {
        if (!header) return;
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    // ========== MOBILE MENU ==========

    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');

    function toggleMobileMenu() {
        if (!hamburger || !navLinks) return;
        var isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMobileMenu() {
        if (!hamburger || !navLinks) return;
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    // ========== SMOOTH SCROLL ==========

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            var navHeight = header ? header.offsetHeight : 0;
            var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // ========== ACTIVE LINK HIGHLIGHT ==========

    var sections = document.querySelectorAll('section[id]');
    var navLinkElements = document.querySelectorAll('.nav-links a[href^="#"]');

    function updateActiveLink() {
        var scrollPosition = window.scrollY + 150;

        sections.forEach(function (section) {
            var sectionTop = section.offsetTop;
            var sectionHeight = section.offsetHeight;
            var sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinkElements.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    // ========== GALLERY LIGHTBOX CAROUSEL ==========

    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCounter = document.getElementById('lightboxCounter');
    var lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    var lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
    var lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
    var galleryItems = document.querySelectorAll('.gallery-item');
    var currentIndex = 0;

    function showSlide(index) {
        if (!lightbox || !lightboxImg || !galleryItems.length) return;
        if (index < 0) index = galleryItems.length - 1;
        if (index >= galleryItems.length) index = 0;
        currentIndex = index;

        var img = galleryItems[currentIndex].querySelector('img');
        if (!img) return;
        lightboxImg.style.opacity = '0';
        setTimeout(function () {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxImg.style.opacity = '1';
        }, 150);

        if (lightboxCounter) {
            lightboxCounter.textContent = (currentIndex + 1) + ' / ' + galleryItems.length;
        }
    }

    galleryItems.forEach(function (item, index) {
        item.addEventListener('click', function () {
            showSlide(index);
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function (e) {
            e.stopPropagation();
            showSlide(currentIndex - 1);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', function (e) {
            e.stopPropagation();
            showSlide(currentIndex + 1);
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (!lightbox || !lightbox.classList.contains('show')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showSlide(currentIndex - 1);
        if (e.key === 'ArrowRight') showSlide(currentIndex + 1);
    });

    var touchStartX = 0;
    if (lightbox) {
        lightbox.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', function (e) {
            var diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) showSlide(currentIndex + 1);
                else showSlide(currentIndex - 1);
            }
        }, { passive: true });
    }

    // ========== INTERSECTION OBSERVER - FADE IN ANIMATIONS ==========

    var animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale, .fade-in-blur');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        animatedElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        animatedElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // ========== CONTACT FORM VALIDATION ==========

    var contactForm = document.getElementById('contactForm');
    var formSuccess = document.getElementById('formSuccess');

    function validateEmail(email) {
        if (!email) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        return /^[\d\s\+\-()]{6,20}$/.test(phone.trim());
    }

    function showFieldError(fieldId, show) {
        var group = document.getElementById(fieldId);
        if (!group) return;
        var formGroup = group.closest('.form-group');
        if (formGroup) {
            if (show) {
                formGroup.classList.add('error');
            } else {
                formGroup.classList.remove('error');
            }
        }
    }

    function showCheckboxError(show) {
        var checkbox = document.getElementById('privacyCheckbox');
        if (checkbox) {
            if (show) {
                checkbox.classList.add('error');
            } else {
                checkbox.classList.remove('error');
            }
        }
    }

    if (contactForm) {
        contactForm.querySelectorAll('input, textarea').forEach(function (field) {
            field.addEventListener('focus', function () {
                var formGroup = this.closest('.form-group');
                if (formGroup) formGroup.classList.remove('error');
            });
        });

        var privacyCheckbox = document.getElementById('privacy');
        if (privacyCheckbox) {
            privacyCheckbox.addEventListener('change', function () {
                showCheckboxError(false);
            });
        }

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var nome = document.getElementById('nome');
            var telefono = document.getElementById('telefono');
            var email = document.getElementById('email');
            var messaggio = document.getElementById('messaggio');
            var privacy = document.getElementById('privacy');

            var isValid = true;

            if (!nome.value.trim()) {
                showFieldError('nome', true);
                isValid = false;
            } else {
                showFieldError('nome', false);
            }

            if (!telefono.value.trim() || !validatePhone(telefono.value)) {
                showFieldError('telefono', true);
                isValid = false;
            } else {
                showFieldError('telefono', false);
            }

            if (email.value.trim() && !validateEmail(email.value.trim())) {
                showFieldError('email', true);
                isValid = false;
            } else {
                showFieldError('email', false);
            }

            if (!messaggio.value.trim()) {
                showFieldError('messaggio', true);
                isValid = false;
            } else {
                showFieldError('messaggio', false);
            }

            if (!privacy.checked) {
                showCheckboxError(true);
                isValid = false;
            } else {
                showCheckboxError(false);
            }

            if (!isValid) return;

            var subject = encodeURIComponent('Richiesta dal sito web - ' + nome.value.trim());
            var body = encodeURIComponent(
                'Nome: ' + nome.value.trim() + '\n' +
                'Telefono: ' + telefono.value.trim() + '\n' +
                'Email: ' + (email.value.trim() || 'Non specificata') + '\n\n' +
                'Messaggio:\n' + messaggio.value.trim()
            );

            window.location.href = 'mailto:dirosaservizi@gmail.com?subject=' + subject + '&body=' + body;

            contactForm.style.display = 'none';
            if (formSuccess) formSuccess.style.display = 'block';

            setTimeout(function () {
                contactForm.reset();
                contactForm.style.display = 'block';
                if (formSuccess) formSuccess.style.display = 'none';
            }, 5000);
        });
    }

})();
