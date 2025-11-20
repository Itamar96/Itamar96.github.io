/*! HTMLInclude v1.1.1 | MIT License | github.com/paul-browne/HTMLInclude */ 
!function(w, d) {
    if (!w.HTMLInclude) {
        w.HTMLInclude = function() {
            function isInViewport(element, offset) {
                return element.getBoundingClientRect().top <= (+offset + w.innerHeight);
            }
            function ajax(url, elements) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                            // Accept 200 (normal) and status 0 when loading from file: protocol
                            if (xhr.status == 200 || (xhr.status === 0 && xhr.responseText)) {
                            elements.forEach(function(element) {
                                var dataReplace = element.getAttribute("data-replace");
                                var z = xhr.responseText;

                                // Allow simple token replacements in the fetched fragment
                                if (dataReplace) {
                                    dataReplace.split(",").forEach(function(el) {
                                        var o = el.trim().split(":");
                                        z = z.replace(new RegExp(o[0], "g"), o[1]);
                                    });
                                }

                                // Parse the fetched HTML so we can safely modify it before
                                // inserting into the document. If the current document
                                // already contains a site title, remove any duplicate
                                // [data-site-title] elements from the fetched fragment to
                                // avoid rendering the header twice.
                                var parsed = new DOMParser().parseFromString(z, 'text/html');
                                try {
                                    if (d.querySelector('[data-site-title]')) {
                                        var dup = parsed.querySelectorAll('[data-site-title]');
                                        dup.forEach(function(n){ n.parentNode && n.parentNode.removeChild(n); });
                                    }
                                } catch (e) { /* silent */ }

                                // Use the parsed fragment's body HTML for insertion
                                var htmlToInsert = parsed.body ? parsed.body.innerHTML : z;
                                element.outerHTML = htmlToInsert;

                                try {
                                    // Dispatch a custom event so pages can react to injected fragments.
                                    var evt = new CustomEvent('htmlinclude:loaded', { detail: { path: url }, bubbles: true });
                                    // Use a short timeout so listeners run after the DOM has settled.
                                    setTimeout(function(){
                                        (d.documentElement || d.body).dispatchEvent(evt);
                                    }, 0);
                                } catch (e) {
                                    // ignore if CustomEvent not supported (very old browsers)
                                }

                                // Re-attach any scripts found in the parsed fragment. Preserve execution order
                                var scripts = parsed.querySelectorAll("script");
                                for (var si = 0; si < scripts.length; si++) {
                                    var old = scripts[si];
                                    var newScript = d.createElement('script');
                                    if (old.src) {
                                        newScript.src = old.src;
                                        // ensure external scripts execute immediately
                                        newScript.async = false;
                                    } else {
                                        // copy inline script text
                                        try { newScript.text = old.textContent; } catch (e) { newScript.innerHTML = old.innerHTML; }
                                    }
                                    d.head.appendChild(newScript);
                                }
                            });
                        } else {
                            try { console.info('HTMLInclude: failed to load ' + url + ' (status: ' + xhr.status + ')'); } catch (e) {}
                        }
                        }
                };
                xhr.onerror = function() { try { console.info('HTMLInclude: network error while loading ' + url); } catch (e) {} };
                xhr.open("GET", url, true);
                xhr.send();
            }
            function lazyLoad(element, offset) {
                w.addEventListener("scroll", function scrollFunc() {
                    if (isInViewport(element, offset)) {
                        w.removeEventListener("scroll", scrollFunc);
                        ajax(element.getAttribute("data-include"), [element]);
                    }
                })
            }
            var store = {};
            var dis = d.querySelectorAll('[data-include]:not([data-in])');
            var i = dis.length;
            while (i--) {
                var di = dis[i].getAttribute('data-include');
                var laziness = dis[i].getAttribute('data-lazy');
                dis[i].setAttribute("data-in", "");
                if (!laziness || (laziness && isInViewport(dis[i], laziness))) {
                    store[di] = store[di] || [];
                    store[di].push(dis[i]);
                } else {
                    lazyLoad(dis[i], laziness);
                }
            }
            for (var key in store) {
                ajax(key, store[key]);
            }
        }
    }
    w.HTMLInclude();
}(window, document)
