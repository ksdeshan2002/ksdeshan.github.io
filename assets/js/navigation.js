document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.site-nav a').forEach((link) => {
    if (link.href === window.location.href) {
      link.setAttribute('aria-current', 'page');
    }
  });
});
