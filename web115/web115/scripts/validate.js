// /web115/scripts/validate.js
(() => {
  function setLinks() {
    const html = document.getElementById('validate-html');
    const css  = document.getElementById('validate-css');

    // Fallbacks if JS is blocked or running from file://
    const htmlFallback = 'https://validator.w3.org/nu/#textarea';
    const cssFallback  = 'https://jigsaw.w3.org/css-validator/#validate_by_input';

    if (!html && !css) return;

    const url = location.href;
    if (html) {
      html.href = 'https://validator.w3.org/nu/?doc=' + encodeURIComponent(url);
      html.target = '_blank';
      html.rel = 'noopener noreferrer';
      if (location.protocol === 'file:') html.href = htmlFallback;
    }
    if (css) {
      css.href = 'https://jigsaw.w3.org/css-validator/validator?uri=' + encodeURIComponent(url);
      css.target = '_blank';
      css.rel = 'noopener noreferrer';
      if (location.protocol === 'file:') css.href = cssFallback;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setLinks);
  } else {
    setLinks();
  }
})();
