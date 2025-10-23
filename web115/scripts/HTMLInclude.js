/*! HTMLInclude (minimal: attributes & elements only) | MIT */
(function (w, d) {
  "use strict";

  if (w.HTMLInclude) return;

  function isInViewport(el, offset) {
    var off = Number(offset) || 0;
    var rect = el.getBoundingClientRect();
    return rect.top <= (off + w.innerHeight);
  }

  function ajax(url, targets) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          for (var i = 0; i < targets.length; i++) {
            var host = targets[i];

            // Parse fetched fragment into a document so we can extract only elements.
            var html = xhr.responseText;
            var parsed;
            try {
              parsed = new DOMParser().parseFromString(html, "text/html");
            } catch (e) {
              parsed = null;
            }

            // Replace the placeholder element with fetched markup.
            if (parsed && parsed.body) {
              host.outerHTML = parsed.body.innerHTML;
              // Re-attach any <script> elements found in the fetched fragment (elements only).
              try {
                var scripts = parsed.querySelectorAll("script");
                for (var j = 0; j < scripts.length; j++) {
                  var src = scripts[j].getAttribute("src");
                  var s = d.createElement("script");
                  if (src) {
                    s.src = src;
                  } else {
                    s.textContent = scripts[j].textContent || "";
                  }
                  var type = scripts[j].getAttribute("type");
                  if (type) s.type = type;
                  if (scripts[j].hasAttribute("defer")) s.defer = true;
                  if (scripts[j].hasAttribute("async")) s.async = true;
                  var co = scripts[j].getAttribute("crossorigin");
                  if (co) s.crossOrigin = co;
                  var rp = scripts[j].getAttribute("referrerpolicy");
                  if (rp) s.referrerPolicy = rp;
                  var nonce = scripts[j].getAttribute("nonce");
                  if (nonce) s.nonce = nonce;
                  d.head.appendChild(s);
                }
              } catch (e) {
                // No-op: if scripts can't be reattached, the HTML still loads
              }
            } else {
              // Fallback: insert as-is
              host.outerHTML = html;
            }
          }
        } else {
          // If a resource can't be retrieved, leave the placeholder in place
          // (Accumulus will surface a clear "could not be retrieved" message).
          try {
            console.error("HTMLInclude: GET " + url + " failed (" + xhr.status + ").");
          } catch (_) {}
        }
      }
    };
    xhr.open("GET", url, true);
    xhr.send();
  }

  function lazyLoad(el, offset) {
    function onScroll() {
      if (isInViewport(el, offset)) {
        w.removeEventListener("scroll", onScroll);
        ajax(el.getAttribute("data-include"), [el]);
      }
    }
    w.addEventListener("scroll", onScroll);
  }

  w.HTMLInclude = function () {
    var placeholders = d.querySelectorAll("[data-include]:not([data-in])");
    var buckets = Object.create(null);

    for (var i = 0; i < placeholders.length; i++) {
      var el = placeholders[i];
      var path = el.getAttribute("data-include");
      var laziness = el.getAttribute("data-lazy");
      el.setAttribute("data-in", "");

      if (!laziness || isInViewport(el, laziness)) {
        (buckets[path] || (buckets[path] = [])).push(el);
      } else {
        lazyLoad(el, laziness);
      }
    }

    for (var key in buckets) {
      if (Object.prototype.hasOwnProperty.call(buckets, key)) {
        ajax(key, buckets[key]);
      }
    }
  };

  // kick off once
  w.HTMLInclude();
})(window, document);

