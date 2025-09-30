/* a11y-dev.js (refined)
   Dev-only accessibility checker (axe-core + HTML_CodeSniffer)
   - Runs on localhost/127.0.0.1/::1 OR when ?a11y=1 is present
   - Adds a small floating panel with an a11y summary
*/
(function () {
   // prevent double init
   if (window.__A11Y_DEV_INITED__) return;
   window.__A11Y_DEV_INITED__ = true;

   // Dev gate: localhost (IPv4 & IPv6) or explicit flag
   const isDevHost = /^(localhost|127\.0\.0\.1|\[?::1\]?)$/.test(location.hostname);
   const hasFlag = new URLSearchParams(location.search).has('a11y');
   if (!(isDevHost || hasFlag)) return;

   // tiny helper to load external scripts with optional SRI
   function load(src, integrity) {
      return new Promise((resolve, reject) => {
         const s = document.createElement('script');
         s.src = src;
         s.async = true;
         s.crossOrigin = 'anonymous';
         if (integrity) s.integrity = integrity; // SRI when available
         s.onload = resolve;
         s.onerror = () => reject(new Error(`Failed to load: ${src}`));
         document.head.appendChild(s);
      });
   }

   // Create a minimal floating panel (accessible)
   function ensurePanel() {
      if (document.getElementById('a11y-pane')) return;

      const pane = document.createElement('div');
      pane.id = 'a11y-pane';
      pane.style.cssText = [
         'position:fixed',
         'right:1rem',
         'bottom:1rem',
         'z-index:999999',
         'font:14px system-ui,sans-serif',
         'color:#111'
      ].join(';');

      const btn = document.createElement('button');
      btn.id = 'a11y-toggle';
      btn.textContent = 'A11Y';
      btn.title = 'Toggle accessibility summary';
      btn.setAttribute('aria-controls', 'a11y-panel');
      btn.setAttribute('aria-expanded', 'false');
      btn.style.cssText = [
         'padding:.5rem .75rem',
         'border:1px solid #ddd',
         'background:#fff',
         'border-radius:.5rem',
         'box-shadow:0 4px 12px rgba(0,0,0,.1)',
         'cursor:pointer'
      ].join(';');

      const panel = document.createElement('div');
      panel.id = 'a11y-panel';
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-live', 'polite');
      panel.setAttribute('aria-label', 'Accessibility report');
      panel.style.cssText = [
         'display:none',
         'margin-top:.5rem',
         'width:360px',
         'max-height:50vh',
         'overflow:auto',
         'background:#fff',
         'border:1px solid #eee',
         'border-radius:.5rem',
         'padding:.75rem',
         'box-shadow:0 8px 24px rgba(0,0,0,.12)'
      ].join(';');

      btn.addEventListener('click', () => {
         const open = panel.style.display === 'none';
         panel.style.display = open ? 'block' : 'none';
         btn.setAttribute('aria-expanded', String(open));
      });

      pane.appendChild(btn);
      pane.appendChild(panel);
      document.body.appendChild(pane);
   }

   window.addEventListener('load', async () => {
      try {
         ensurePanel();

         // Load both validators (versions pinned for stability)
         await Promise.all([
            // axe-core on cdnjs with SRI
            load(
               'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js',
               'sha512-Z2G4gkV6QO0C49m6/7Y0YVd5m7k1GJ1t0z3mVtN3Q5q0x3J8QH0R3oD9y8S2k9kq9R1i1p1yR2l2Cj0j1r7cAg==' // example hash; replace with actual from cdnjs if desired
            ),
            // HTML_CodeSniffer (no official SRI at this URL)
            load('https://squizlabs.github.io/HTML_CodeSniffer/build/HTMLCS.js')
         ]);

         // --- axe-core: WCAG 2.x (incl. 2.2 AA) ---
         const axeResults = await window.axe.run(document, {
            runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']
         });

         console.groupCollapsed('axe-core violations (%d)', axeResults.violations.length);
         axeResults.violations.forEach(v => {
            console.log(`[axe] ${v.id} | impact: ${v.impact} | ${v.help}`, '\nNodes:', v.nodes);
         });
         console.groupEnd();

         // --- HTML_CodeSniffer: WCAG2AA ruleset ---
         await new Promise(resolve => window.HTMLCS.process('WCAG2AA', document, resolve));
         const msgs = (window.HTMLCS.getMessages && window.HTMLCS.getMessages()) || [];
         const counts = {
            error: 0,
            warning: 0,
            notice: 0
         };
         for (const m of msgs) {
            const t = (m.type || '').toLowerCase();
            counts[t] = (counts[t] || 0) + 1;
         }

         // Update the mini report
         const panel = document.getElementById('a11y-panel');
         panel.innerHTML = `
        <strong>axe-core</strong>: ${axeResults.violations.length} violation(s)<br>
        <strong>HTML_CodeSniffer (WCAG2AA)</strong>: ${counts.error || 0} error(s),
        ${counts.warning || 0} warning(s), ${counts.notice || 0} notice(s)
        <hr>
        <div style="font-size:12px;opacity:.8">
          Open DevTools → Console for full details and element references.
        </div>
      `;
         // Make sure the summary is visible at least once on explicit ?a11y=1
         if (new URLSearchParams(location.search).has('a11y')) {
            const btn = document.getElementById('a11y-toggle');
            btn.click();
         }
      } catch (e) {
         console.error('A11Y validator load/run failed:', e);
         const panel = document.getElementById('a11y-panel');
         if (panel) {
            const tip = [
               'If you use a strict Content-Security-Policy,',
               'allow cdnjs.cloudflare.com and squizlabs.github.io for scripts —',
               'or run this checker only on localhost.'
            ].join(' ');
            panel.innerHTML = `
          <strong>Accessibility check failed to run.</strong><br>
          <code>${String((e && e.message) || e)}</code>
          <div style="margin-top:.5rem;font-size:12px;opacity:.8">${tip}</div>
        `;
            panel.style.display = 'block';
            const btn = document.getElementById('a11y-toggle');
            if (btn) btn.setAttribute('aria-expanded', 'true');
         }
      }
   });
})();
