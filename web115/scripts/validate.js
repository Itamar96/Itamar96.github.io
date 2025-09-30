/* include-html.js
   Enhanced W3-style HTML include
   Usage: <div w3-include-html="partials/header.html"></div>
          <script src="scripts/include-html.js" defer></script>
*/

(() => {
  const cache = new Map();

  /**
   * Include external HTML into elements that have the given attribute.
   * @param {Object} opts
   * @param {string} [opts.attr='w3-include-html'] - Attribute name to look for.
   * @param {ParentNode} [opts.root=document] - Root node to search within.
   * @param {boolean} [opts.allowScripts=false] - If true, executes <script> tags from fragments.
   */
  async function includeHTML(opts = {}) {
    const {
      attr = "w3-include-html",
      root = document,
      allowScripts = false,
    } = opts;

    // Process repeatedly to support nested includes
    // Stop when a pass finds no more targets
    // Guard against infinite loops: max 10 passes
    for (let pass = 0; pass < 10; pass++) {
      const targets = [...root.querySelectorAll(`[${attr}]`)];
      if (targets.length === 0) break;

      for (const el of targets) {
        const file = el.getAttribute(attr);
        if (!file) {
          el.removeAttribute(attr);
          continue;
        }

        el.setAttribute("aria-busy", "true");

        try {
          const url = new URL(file, document.baseURI).href;
          let text;

          if (cache.has(url)) {
            text = cache.get(url);
          } else {
            const res = await fetch(url, { credentials: "same-origin" });
            if (!res.ok) {
              throw new Error(`HTTP ${res.status} ${res.statusText}`);
            }
            text = await res.text();
            cache.set(url, text);
          }

          // Parse into nodes to avoid clobbering listeners higher up the tree
          const tpl = document.createElement("template");
          tpl.innerHTML = text.trim();

          // Optionally execute scripts from the fragment
          if (allowScripts) {
            // Replace <script> tags with fresh ones so they execute
            const scripts = tpl.content.querySelectorAll("script");
            scripts.forEach((oldScript) => {
              const newScript = document.createElement("script");
              // Copy attributes (type, src, etc.)
              for (const { name, value } of [...oldScript.attributes]) {
                newScript.setAttribute(name, value);
              }
              if (!oldScript.src) {
                newScript.textContent = oldScript.textContent;
              }
              oldScript.replaceWith(newScript);
            });
          }

          // Replace content
          el.replaceChildren(tpl.content);
        } catch (err) {
          console.error(`includeHTML: error including "${file}":`, err);
          el.textContent = "Page not found.";
        } finally {
          el.removeAttribute(attr);
          el.removeAttribute("aria-busy");
        }
      }
    }
  }

  // Expose + autorun on DOM ready
  window.includeHTML = includeHTML;
  document.addEventListener("DOMContentLoaded", () => includeHTML());
})();
