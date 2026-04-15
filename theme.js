(function () {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const root = document.documentElement;
    const isDark =
      root.getAttribute('data-theme') === 'dark' ||
      (!root.hasAttribute('data-theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    const next = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();
