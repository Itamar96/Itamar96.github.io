// validation.js
// Loads the correct lint.page kit based on a course meta tag and
// populates the validate link placeholder in the footer.

(function() {
  const kits = {
    "WEB115": { src: "https://lint.page/kit/67ff88.js", href: "https://lint.page/kit/67ff88" },
    "WEB250": { src: "https://lint.page/kit/880bd5.js", href: "https://lint.page/kit/880bd5" },
    "WEB215": { src: "https://lint.page/kit/6664c1.js", href: "https://lint.page/kit/6664c1" }
  };

  function safeLoadKit(obj) {
    if (!obj || !obj.src) return;
    // Prevent double-loading if lint.page script is already present
    if (document.querySelector('script[src="' + obj.src + '"]') || window.__lintPageLoaded) {
      return;
    }
    var s = document.createElement('script');
    s.src = obj.src;
    s.defer = true;
    s.crossOrigin = 'anonymous';
    s.onerror = function(){ console.info('lint.page unavailable; continuing without it.'); };
    document.head.appendChild(s);
    // mark that we've attempted to load a kit
    window.__lintPageLoaded = true;
  }

  // determine course
  var courseMeta = document.querySelector('meta[name="course"]');
  var course = courseMeta ? courseMeta.getAttribute('content') : null;
  // default to WEB115 if nothing provided
  if (!course || !kits[course]) course = 'WEB115';

  var kit = kits[course];
  safeLoadKit(kit);

  // populate validate link placeholder (if present)
  try {
    var placeholder = document.getElementById('validate-link-placeholder');
    if (placeholder && kit && kit.href) {
      var a = document.createElement('a');
      a.href = kit.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'Validate';
      placeholder.appendChild(document.createTextNode(' '));
      placeholder.appendChild(a);
    }
  } catch (e) { console.info('Could not populate validate link placeholder', e); }

  console.log('Validator: requested kit for', course);
})();

