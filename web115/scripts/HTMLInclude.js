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
                    if (xhr.readyState == 4 && xhr.status == 200) {
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

                                // Re-attach any scripts found in the parsed fragment
                                var scripts = parsed.querySelectorAll("script");
                                var i = 0;
                                var j = scripts.length;
                                while (i < j) {
                                    var newScript = d.createElement("script");
                                    if (scripts[i].src) newScript.src = scripts[i].src; else newScript.innerHTML = scripts[i].innerHTML;
                                    d.head.appendChild(newScript);
                                    i++;
                                }
                            });
                        }
                };
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
