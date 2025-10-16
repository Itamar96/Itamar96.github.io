// theme-toggle.js
// Toggle dark theme and persist user choice. Designed to run after the header
// is injected; uses event delegation to find the button.
(function(){
  function setTheme(isDark){
    if(isDark) document.documentElement.classList.add('dark-theme');
    else document.documentElement.classList.remove('dark-theme');
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch(e){}
  }

  function syncButton(){
    var btn = document.getElementById('theme-toggle');
    if(!btn) return;
    var isDark = document.documentElement.classList.contains('dark-theme');
    btn.setAttribute('aria-pressed', String(isDark));
  }

  document.addEventListener('click', function(e){
    var btn = e.target.closest && e.target.closest('#theme-toggle');
    if(!btn) return;
    var willBeDark = !(document.documentElement.classList.contains('dark-theme'));
    setTheme(willBeDark);
    syncButton();
  });

  // When fragments are injected, sync state
  document.addEventListener('htmlinclude:loaded', syncButton);
  document.addEventListener('DOMContentLoaded', function(){
    // honor only explicit stored choice (avoid auto-honoring prefers-color-scheme)
    try{
      var stored = localStorage.getItem('theme');
      if(stored === 'dark') setTheme(true);
      else setTheme(false);
    }catch(e){}
    syncButton();
  });
})();
