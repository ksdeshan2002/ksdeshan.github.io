const root = document.documentElement;

function toggleTheme() {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
}

window.toggleTheme = toggleTheme;
