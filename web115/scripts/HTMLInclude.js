/*! HTMLInclude (minimal; elements/attributes only) | MIT */
(function (w, d) {
  "use strict";
  if (w.HTMLInclude) return;

  function isInViewport(el, offset) {
    var off = Number(offset) || 0;
    var rect = el.getBoundingClientRect();
    return rect.top <= (off + w.innerHeight);
  }

  function ajax(url, targets, done) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        for (var i = 0; i < targets.length; i++) {
          var host = targets[i];
          var html = xhr.responseText;
          var parsed;
          try { parsed = new DOMParser().parseFromString(html, "text/html"); } catch (e) { parsed = null; }

          if (parsed && parsed.body) {
            host.outerHTML = parsed.body.innerHTML;

            // re-attach scripts from fragment
            try {
              var scripts = parsed.querySelectorAll("script");
              for (var j = 0; j < scripts.length; j++) {
                var sEl = scripts[j];
                var s = d.createElement("script");
                var src = sEl.getAttribute("src");
                if (src) s.src = src; else s.textContent = sEl.textContent || "";
                var type = sEl.getAttribute("type"); if (type) s.type = type;
                if (sEl.hasAttribute("defer")) s.defer = true;
                if (sEl.hasAttribute("async")) s.async = true;
                var co = sEl.getAttribute("crossorigin"); if (co) s.crossOrigin = co;
                var rp = sEl.getAttribute("referrerpolicy"); if (rp) s.referrerPolicy = rp;
                var nonce = sEl.getAttribute("nonce"); if (nonce) s.nonce = nonce;
                d.head.appendChild(s);
              }
            } catch {}
          } else {
            host.outerHTML = html;
          }
        }
      } else {
        try { console.error("HTMLInclude: GET " + url + " failed (" + xhr.status + ")."); } catch {}
      }
      if (typeof done === 'function') done();
    };
    xhr.open("GET", url, true);
    xhr.send();
  }

  function lazyLoad(el, offset) {
    function onScroll() {
      if (isInViewport(el, offset)) {
        w.removeEventListener("scroll", onScroll);
        ajax(el.getAttribute("data-include"), [el], function(){
          // fire per-element event for lazies
          d.dispatchEvent(new Event('includes:loaded'));
          d.dispatchEvent(new Event('htmlinclude:loaded'));
        });
      }
    }
    w.addEventListener("scroll", onScroll);
  }

  w.HTMLInclude = function () {
    var placeholders = d.querySelectorAll("[data-include]:not([data-in])");
    var buckets = Object.create(null);
    var lazyCount = 0;

    for (var i = 0; i < placeholders.length; i++) {
      var el = placeholders[i];
      var path = el.getAttribute("data-include");
      var laziness = el.getAttribute("data-lazy");
      el.setAttribute("data-in", "");

      if (!laziness || isInViewport(el, laziness)) {
        (buckets[path] || (buckets[path] = [])).push(el);
      } else {
        lazyCount++;
        lazyLoad(el, laziness);
      }
    }

    var keys = Object.keys(buckets);
    if (!keys.length && !lazyCount) {
      d.dispatchEvent(new Event('includes:loaded'));
      d.dispatchEvent(new Event('htmlinclude:loaded'));
      return;
    }

    var pending = keys.length;
    keys.forEach(function (key) {
      ajax(key, buckets[key], function () {
        pending--;
        if (pending === 0) {
          d.dispatchEvent(new Event('includes:loaded'));
          d.dispatchEvent(new Event('htmlinclude:loaded'));
        }
      });
    });
  };

  // kick off once
  w.HTMLInclude();
})(window, document);

