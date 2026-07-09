'use strict';

/* ==========================================================
   SITE APP
   Main application controller.
   Loads shared components and initialises all behaviours.
   ========================================================== */

class SiteApp {

    constructor() {

        this.headerTarget   = document.getElementById('header');
        this.footerTarget   = document.getElementById('footer');
        this.currentPath    = window.location.pathname;
        this.sections       = [];
        this.tocObserver    = null;
        this.fadeObserver   = null;

        this.init();

    }

    /* ----------------------------------------------------------
       INITIALISATION SEQUENCE
    ---------------------------------------------------------- */

    async init() {

        // Components must load first — everything else depends on the DOM
        await this.loadSharedComponents();

        this.cacheElements();

        // Navigation behaviours (needs header in DOM)
        this.initializeActiveLink();
        this.initializeMobileMenu();
        this.initializeNavbarScroll();

        // Page behaviours
        this.initializeSmoothScrolling();
        this.initializeSectionObserver();
        this.initializeFadeAnimations();
        this.initializeExternalLinks();
        this.initializeCurrentYear();
        this.initializeKeyboardAccessibility();

    }

    /* ----------------------------------------------------------
       COMPONENT LOADING
    ---------------------------------------------------------- */

    async loadSharedComponents() {

        await Promise.all([

            this.loadComponent(
                '/assets/components/header.html',
                this.headerTarget
            ),

            this.loadComponent(
                '/assets/components/footer.html',
                this.footerTarget
            )

        ]);

    }

    async loadComponent(path, target) {

        if (!target) return;

        try {

            const response = await fetch(path);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status} — could not load ${path}`);
            }

            target.innerHTML = await response.text();

        } catch (error) {

            console.error('[SiteApp] Component load failed:', error.message);

        }

    }

    /* ----------------------------------------------------------
       ELEMENT CACHE
    ---------------------------------------------------------- */

    cacheElements() {

        // Sections with IDs are used by the TOC observer
        this.sections = Array.from(
            document.querySelectorAll('main section[id]')
        );

    }

    /* ----------------------------------------------------------
       ACTIVE NAVIGATION LINK
       Marks the nav link matching the current page.
       Adds aria-current="page" for accessibility.
    ---------------------------------------------------------- */

    initializeActiveLink() {

        const links = document.querySelectorAll('.nav-links a');

        links.forEach(link => {

            const href = link.getAttribute('href');

            if (!href) return;

            // Strip trailing slash and /index.html for comparison
            const normalize = p =>
                p.replace(/\/index\.html$/, '/')
                 .replace(/([^/])$/, '$1');

            const normalizedPath = normalize(this.currentPath);
            const normalizedHref = normalize(href);

            const isExactMatch   = normalizedPath === normalizedHref;
            const isChildMatch   =
                normalizedHref !== '/' &&
                normalizedHref !== '/index.html' &&
                normalizedPath.startsWith(normalizedHref);

            if (isExactMatch || isChildMatch) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }

        });

    }

    /* ----------------------------------------------------------
       MOBILE MENU TOGGLE
       Requires header.html to be in the DOM.
    ---------------------------------------------------------- */

    initializeMobileMenu() {

        const menuBtn = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (!menuBtn || !navMenu) return;

        menuBtn.addEventListener('click', () => {

            const isOpen = navMenu.classList.toggle('show-menu');
            menuBtn.setAttribute('aria-expanded', String(isOpen));

        });

        // Close menu when a nav link is clicked (mobile UX)
        navMenu.querySelectorAll('a').forEach(link => {

            link.addEventListener('click', () => {

                navMenu.classList.remove('show-menu');
                menuBtn.setAttribute('aria-expanded', 'false');

            });

        });

    }

    /* ----------------------------------------------------------
       NAVBAR SCROLL EFFECT
       Adds background when user scrolls past 50px.
    ---------------------------------------------------------- */

    initializeNavbarScroll() {

        const navbar = document.querySelector('.navbar');

        if (!navbar) return;

        const handleScroll = () => {

            navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);

        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Run once on load to handle pages opened mid-scroll
        handleScroll();

    }

    /* ----------------------------------------------------------
       SMOOTH SCROLLING
       Intercepts clicks on anchor links (#id).
    ---------------------------------------------------------- */

    initializeSmoothScrolling() {

        document.addEventListener('click', event => {

            const link = event.target.closest('a[href^="#"]');

            if (!link) return;

            const target = document.querySelector(link.getAttribute('href'));

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({ behavior: 'smooth', block: 'start' });

            history.replaceState(null, '', link.getAttribute('href'));

        });

    }

    /* ----------------------------------------------------------
       TABLE OF CONTENTS OBSERVER
       Highlights the active section in the TOC as user scrolls.
    ---------------------------------------------------------- */

    initializeSectionObserver() {

        if (!this.sections.length) return;

        const tocLinks = document.querySelectorAll('.table-of-contents a');

        if (!tocLinks.length) return;

        this.tocObserver = new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    tocLinks.forEach(link => link.classList.remove('active'));

                    const active = document.querySelector(
                        `.table-of-contents a[href="#${entry.target.id}"]`
                    );

                    if (active) active.classList.add('active');

                });

            },

            {
                threshold:  0.4,
                rootMargin: '-15% 0px -55% 0px'
            }

        );

        this.sections.forEach(section => this.tocObserver.observe(section));

    }

    /* ----------------------------------------------------------
       FADE-IN ANIMATIONS
       Triggers CSS fade-up / fade-in when elements enter viewport.
    ---------------------------------------------------------- */

    initializeFadeAnimations() {

        const elements = document.querySelectorAll('.fade-in, .fade-up');

        if (!elements.length) return;

        this.fadeObserver = new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add('visible');
                    this.fadeObserver.unobserve(entry.target);

                });

            },

            {
                threshold:  0,
                rootMargin: '0px 0px -40px 0px'
            }

        );

        elements.forEach(el => this.fadeObserver.observe(el));

    }

    /* ----------------------------------------------------------
       EXTERNAL LINKS
       Opens external links in a new tab with security attributes.
    ---------------------------------------------------------- */

    initializeExternalLinks() {

        document.querySelectorAll('a[href]').forEach(link => {

            const href = link.getAttribute('href');

            if (!href || href.startsWith('#') || href.startsWith('/')) return;

            try {

                const url = new URL(href, window.location.origin);

                if (url.hostname !== window.location.hostname) {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                }

            } catch {
                // Not a parseable URL — skip
            }

        });

    }

    /* ----------------------------------------------------------
       CURRENT YEAR
       Populates elements with class .current-year.
    ---------------------------------------------------------- */

    initializeCurrentYear() {

        const year = new Date().getFullYear();

        document.querySelectorAll('.current-year').forEach(el => {
            el.textContent = year;
        });

    }

    /* ----------------------------------------------------------
       KEYBOARD ACCESSIBILITY
       ESC closes the mobile menu.
    ---------------------------------------------------------- */

    initializeKeyboardAccessibility() {

        document.addEventListener('keydown', event => {

            if (event.key !== 'Escape') return;

            const navMenu = document.querySelector('.nav-menu');
            const menuBtn = document.querySelector('.menu-toggle');

            if (navMenu && navMenu.classList.contains('show-menu')) {
                navMenu.classList.remove('show-menu');
                if (menuBtn) {
                    menuBtn.setAttribute('aria-expanded', 'false');
                    menuBtn.focus();
                }
            }

        });

    }

}

/* ----------------------------------------------------------
   INSTANTIATE — this was the missing line causing the bug
---------------------------------------------------------- */

new SiteApp();