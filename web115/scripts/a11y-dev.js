/* a11y-dev.js
   Dev-only accessibility checker (axe-core + HTML_CodeSniffer)
   - Runs on localhost/127.0.0.1 OR when ?a11y=1 is present
   - Adds a small floating button showing a summary panel
*/
(function () {
    // Only run on localhost/127.0.0.1 OR when ?a11y=1
    const isDevHost = /(^localhost$|^127\.0\.0\.1$)/.test(location.hostname);
    const hasFlag = new URLSearchParams(location.search).has('a11y');
    if (!(isDevHost || hasFlag)) return;

    // tiny helper to load external scripts
    function load(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.async = true;
            s.crossOrigin = 'anonymous';
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    // Create a minimal floating panel
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
        btn.textContent = 'A11Y';
        btn.title = 'Toggle accessibility summary';
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
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        pane.appendChild(btn);
        pane.appendChild(panel);
        document.body.appendChild(pane);
    }

    window.addEventListener('load', async () => {
        try {
            ensurePanel();

            // Load both validators
            await Promise.all([
                load('https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js'),
                load('https://squizlabs.github.io/HTML_CodeSniffer/build/HTMLCS.js')
            ]);

            // --- axe-core: WCAG 2.x (incl. 2.2 AA) ---
            let axeResults = {
                violations: []
            };
            if (window.axe && typeof window.axe.run === 'function') {
                axeResults = await window.axe.run(document, {
                    runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']
                });
            }

            // --- HTML_CodeSniffer: WCAG2AA ruleset ---
            let msgs = [];
            if (window.HTMLCS && typeof window.HTMLCS.process === 'function') {
                await new Promise((resolve) => window.HTMLCS.process('WCAG2AA', document, resolve));
                if (typeof window.HTMLCS.getMessages === 'function') {
                    msgs = window.HTMLCS.getMessages() || [];
                }
            }

            // Summarize results
            const counts = {
                error: 0,
                warning: 0,
                notice: 0
            };
            for (const m of msgs) {
                const t = (m.type || '').toLowerCase();
                counts[t] = (counts[t] || 0) + 1;
            }

            const panel = document.getElementById('a11y-panel');
            if (panel) {
                panel.innerHTML = `
          <strong>axe-core</strong>: ${axeResults.violations.length} violation(s)<br>
          <strong>HTML_CodeSniffer (WCAG2AA)</strong>: ${counts.error || 0} error(s),
          ${counts.warning || 0} warning(s), ${counts.notice || 0} notice(s)
          <hr>
          <div style="font-size:12px;opacity:.8">
            Open DevTools → Console for details (enable locally if needed).
          </div>
        `;
            }

            // Optional: quiet console debug (uncomment while developing)
            // if (console && console.debug) {
            //   console.debug('[axe] violations:', axeResults.violations);
            //   console.debug('[HTMLCS] messages:', msgs);
            // }
        } catch (e) {
            const panel = document.getElementById('a11y-panel');
            if (panel) {
                panel.innerHTML = `
          <strong>Accessibility check failed to run.</strong><br>
          <code>${String((e && e.message) || e)}</code>
        `;
                panel.style.display = 'block';
            }
        }
    });
})();
