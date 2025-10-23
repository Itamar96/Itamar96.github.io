// theme-toggle.js
// Toggle dark theme and persist user choice. Designed to run after the header
// is injected; uses event delegation to find the button.
(function () {
  function setTheme(isDark) {
    // Prefer data-theme attribute for the classless stylesheet, keep class for
    // backward compatibility with older CSS that used .dark-theme.
    if (isDark) {
      try {
        document.documentElement.setAttribute('data-theme', 'dark');
        // keep legacy class for older stylesheets that still target .dark-theme
        try { document.documentElement.classList.add('dark-theme'); } catch (e) { /* ignore */ }
      } catch (e) { /* ignore storage/access errors */ }
    } else {
      try {
        document.documentElement.removeAttribute('data-theme');
        // remove legacy class when switching back to light
        try { document.documentElement.classList.remove('dark-theme'); } catch (e) { /* ignore */ }
      } catch (e) { /* ignore storage/access errors */ }
    }
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (e) { /* ignore storage/access errors */ }
    // briefly enable CSS transitions tied to a theme-switch class
    try {
      // Use a data attribute to enable transitions instead of a transient class.
      document.documentElement.setAttribute('data-theme-transition', 'true');
      // also keep the legacy transient class for stylesheets still using it
      try { document.documentElement.classList.add('theme-transition'); } catch (e) { /* ignore */ }
      window.clearTimeout(window.__themeTransitionTimeout);
      window.__themeTransitionTimeout = window.setTimeout(function () {
        try { document.documentElement.removeAttribute('data-theme-transition'); } catch (e) { /* ignore */ }
        try { document.documentElement.classList.remove('theme-transition'); } catch (e) { /* ignore */ }
      }, 260);
    } catch (e) { /* ignore transition errors */ }
  }

  function syncButton() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
  // Check either the data-theme attribute or the legacy .dark-theme class
  var isDark = (document.documentElement.getAttribute('data-theme') === 'dark') || document.documentElement.classList.contains('dark-theme');
    btn.setAttribute('aria-pressed', String(isDark));
  // show/hide inline SVG icons (attribute-based)
  var moon = btn.querySelector('[data-icon-moon]');
  var sun = btn.querySelector('[data-icon-sun]');
  var hiddenLabel = btn.querySelector('[data-visually-hidden]');
    if (moon) moon.style.display = isDark ? 'none' : 'inline-block';
    if (sun) sun.style.display = isDark ? 'inline-block' : 'none';
    if (hiddenLabel) hiddenLabel.textContent = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('#theme-toggle');
    if (!btn) return;
  var willBeDark = !((document.documentElement.getAttribute('data-theme') === 'dark') || document.documentElement.classList.contains('dark-theme'));
    setTheme(willBeDark);
    syncButton();
  });

  // keyboard support: toggle when Enter or Space pressed while focused
  document.addEventListener('keydown', function (e) {
    var btn = e.target && e.target.id === 'theme-toggle' ? e.target : (e.target && e.target.closest ? e.target.closest('#theme-toggle') : null);
    if (!btn) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      var willBeDark = !((document.documentElement.getAttribute('data-theme') === 'dark') || document.documentElement.classList.contains('dark-theme'));
      setTheme(willBeDark);
      syncButton();
    }
  });

  // When fragments are injected, sync state
  document.addEventListener('htmlinclude:loaded', syncButton);
  document.addEventListener('DOMContentLoaded', function () {
    // honor only explicit stored choice (avoid auto-honoring prefers-color-scheme)
    try {
      var stored = localStorage.getItem('theme');
      if (stored === 'dark') setTheme(true);
      else if (stored === 'light') setTheme(false);
    } catch (e) { /* ignore storage access errors */ }
    // ensure the icon/label reflect the starting state
    syncButton();
  });
})();


