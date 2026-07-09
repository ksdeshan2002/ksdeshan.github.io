/* ==========================================================
   CODE COPY BUTTON
   Automatically adds a "Copy" button to every .code-block element.
   Optionally also initialises the image lightbox.

   Include this script at the bottom of any page that uses
   .code-block or .figure[data-lightbox] elements.
   ========================================================== */

(function () {

    'use strict';

    /* ----------------------------------------------------------
       COPY BUTTON
    ---------------------------------------------------------- */

    function addCopyButtons() {

        const codeBlocks = document.querySelectorAll('.code-block');

        codeBlocks.forEach(block => {

            const pre = block.querySelector('pre');

            if (!pre) return;

            const btn = document.createElement('button');
            btn.className = 'copy-btn';
            btn.textContent = 'Copy';
            btn.setAttribute('aria-label', 'Copy code to clipboard');

            btn.addEventListener('click', () => {

                const code = pre.querySelector('code');
                const text = code ? code.textContent : pre.textContent;

                navigator.clipboard.writeText(text).then(() => {

                    btn.textContent = '✓ Copied';
                    btn.classList.add('copied');

                    setTimeout(() => {
                        btn.textContent = 'Copy';
                        btn.classList.remove('copied');
                    }, 2000);

                }).catch(() => {

                    btn.textContent = 'Error';
                    setTimeout(() => {
                        btn.textContent = 'Copy';
                    }, 2000);

                });

            });

            block.appendChild(btn);

        });

    }

    /* ----------------------------------------------------------
       IMAGE LIGHTBOX
    ---------------------------------------------------------- */

    function initializeLightbox() {

        const figures = document.querySelectorAll('.figure img, .lightbox-trigger');

        if (!figures.length) return;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Image viewer');

        const img = document.createElement('img');
        img.setAttribute('alt', '');

        const closeBtn = document.createElement('button');
        closeBtn.className = 'lightbox-close';
        closeBtn.textContent = '✕';
        closeBtn.setAttribute('aria-label', 'Close image viewer');

        overlay.appendChild(img);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);

        function openLightbox(src, alt) {
            img.src = src;
            img.alt = alt || '';
            overlay.classList.add('visible');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        }

        function closeLightbox() {
            overlay.classList.remove('visible');
            document.body.style.overflow = '';
        }

        figures.forEach(figure => {
            figure.style.cursor = 'zoom-in';
            figure.addEventListener('click', () => {
                openLightbox(figure.src, figure.alt);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);

        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeLightbox();
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && overlay.classList.contains('visible')) {
                closeLightbox();
            }
        });

    }

    /* ----------------------------------------------------------
       EQUATION NUMBERING
       Automatically numbers .formula-container elements.
    ---------------------------------------------------------- */

    function numberEquations() {

        const formulas = document.querySelectorAll('.formula-container');

        formulas.forEach((formula, index) => {

            if (formula.querySelector('.formula-label')) return;

            const label = document.createElement('span');
            label.className = 'formula-label';
            label.textContent = `(${index + 1})`;
            formula.appendChild(label);

        });

    }

    /* ----------------------------------------------------------
       FIGURE NUMBERING
       Automatically numbers .figure elements with captions.
    ---------------------------------------------------------- */

    function numberFigures() {

        const figures = document.querySelectorAll('.figure');
        let figureCount = 0;

        figures.forEach(figure => {

            const caption = figure.querySelector('.figure-caption');

            if (!caption) return;

            figureCount++;

            const numSpan = document.createElement('span');
            numSpan.className = 'figure-number';
            numSpan.textContent = `Figure ${figureCount}. `;

            caption.insertBefore(numSpan, caption.firstChild);

        });

    }

    /* ----------------------------------------------------------
       INIT
    ---------------------------------------------------------- */

    document.addEventListener('DOMContentLoaded', () => {

        addCopyButtons();
        initializeLightbox();
        numberEquations();
        numberFigures();

    });

}());
