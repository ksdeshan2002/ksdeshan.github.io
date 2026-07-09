/* ==========================================================
   THEME
   Dark / light mode system.
   Reads saved preference from localStorage on load.
   Listens for clicks on .theme-toggle buttons via delegation.
   ========================================================== */

(function () {

    'use strict';

    /* -------------------------------------------------------
       Apply saved theme before first paint to prevent flash
    ------------------------------------------------------- */

    const saved = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', saved);

    /* -------------------------------------------------------
       Toggle function
    ------------------------------------------------------- */

    function toggleTheme() {

        const current = document.documentElement.getAttribute('data-theme');
        const next    = current === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', next);

        localStorage.setItem('theme', next);

        // Update button icon if present
        updateToggleIcon(next);

    }

    function updateToggleIcon(theme) {

        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
            btn.setAttribute('aria-label',
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            );
        });

    }

    /* -------------------------------------------------------
       Event delegation — works even after header is injected
    ------------------------------------------------------- */

    document.addEventListener('click', e => {

        if (e.target.closest('.theme-toggle')) {
            toggleTheme();
        }

    });

    /* -------------------------------------------------------
       Set correct icon on load (after DOM is ready)
    ------------------------------------------------------- */

    document.addEventListener('DOMContentLoaded', () => {
        updateToggleIcon(saved);
    });

}());