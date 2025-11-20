/* a11y-dev.js
   Dev-only accessibility checker (axe-core + HTML_CodeSniffer)
   - Runs on localhost/127.0.0.1 OR when ?a11y=1
   - Floating panel with summary + "Run scan" action
*/
(function () {
  const isDevHost = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const hasFlag = new URLSearchParams(location.search).has("a11y");
  if (!(isDevHost || hasFlag)) return;

  // ---- tiny utils ----------------------------------------------------------
  const once = (fn) => {
    let done = false, val;
    return async (...args) => {
      if (done) return val;
      val = await fn(...args);
      done = true;
      return val;
    };
  };

  const loadScript = (() => {
    const pending = new Map(); // src -> Promise
    return function loadScript(src, { integrity, crossOrigin = "anonymous" } = {}) {
      if (pending.has(src)) return pending.get(src);
      const p = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        if (integrity) s.integrity = integrity;
        if (crossOrigin) s.crossOrigin = crossOrigin;
        s.onload = () => resolve();
        s.onerror = (e) => reject(new Error("Failed to load " + src));
        document.head.appendChild(s);
      });
      pending.set(src, p);
      return p;
    };
  })();

  // ---- UI ------------------------------------------------------------------
  function ensurePanel() {
    if (document.getElementById("a11y-pane")) return;

    const pane = document.createElement("div");
    pane.id = "a11y-pane";
    Object.assign(pane.style, {
      position: "fixed",
      right: "1rem",
      bottom: "1rem",
      zIndex: 2147483647,
      font: "14px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      color: "#111",
    });

    const toggle = document.createElement("button");
    toggle.id = "a11y-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-controls", "a11y-panel");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("title", "Toggle accessibility summary");
    toggle.textContent = "A11Y";
    Object.assign(toggle.style, {
      padding: ".5rem .75rem",
      border: "1px solid #d0d0d0",
      background: "#fff",
      borderRadius: ".5rem",
      boxShadow: "0 4px 12px rgba(0,0,0,.12)",
      cursor: "pointer",
    });

    const panel = document.createElement("div");
    panel.id = "a11y-panel";
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-live", "polite");
    panel.setAttribute("aria-label", "Accessibility summary");
    Object.assign(panel.style, {
      display: "none",
      marginTop: ".5rem",
      width: "360px",
      maxHeight: "50vh",
      overflow: "auto",
      background: "#fff",
      border: "1px solid #eee",
      borderRadius: ".5rem",
      padding: ".75rem",
      boxShadow: "0 8px 24px rgba(0,0,0,.12)",
    });

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.justifyContent = "space-between";
    header.style.gap = ".5rem";
    header.style.marginBottom = ".5rem";

    const title = document.createElement("strong");
    title.textContent = "Accessibility summary";

    const runBtn = document.createElement("button");
    runBtn.type = "button";
    runBtn.textContent = "Run scan";
    runBtn.setAttribute("title", "Run axe-core and HTML_CodeSniffer");
    Object.assign(runBtn.style, {
      padding: ".35rem .6rem",
      border: "1px solid #d0d0d0",
      background: "#fafafa",
      borderRadius: ".4rem",
      cursor: "pointer",
    });

    const content = document.createElement("div");
    content.id = "a11y-content";
    content.style.fontSize = "13px";
    content.style.lineHeight = "1.45";
    content.innerHTML = "Waiting to run…";

    header.appendChild(title);
    header.appendChild(runBtn);
    panel.appendChild(header);
    panel.appendChild(content);

    toggle.addEventListener("click", () => {
      const isOpen = panel.style.display !== "none";
      panel.style.display = isOpen ? "none" : "block";
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });

    pane.appendChild(toggle);
    pane.appendChild(panel);
    document.body.appendChild(pane);

    // respect dark mode
    const mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const dark = mq && mq.matches;
      const bg = dark ? "#1e1e1e" : "#fff";
      const fg = dark ? "#eee" : "#111";
      const border = dark ? "#3a3a3a" : "#eee";
      panel.style.background = bg;
      panel.style.color = fg;
      panel.style.borderColor = border;
      toggle.style.background = dark ? "#2a2a2a" : "#fff";
      toggle.style.color = fg;
      toggle.style.borderColor = dark ? "#3a3a3a" : "#d0d0d0";
    };
    applyTheme();
    if (mq && mq.addEventListener) mq.addEventListener("change", applyTheme);

    return { runBtn, content, panel };
  }

  // ---- scanners ------------------------------------------------------------
  const loadScanners = once(async () => {
    // (Optional) add integrity hashes if you pin exact versions
    await Promise.all([
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js"),
      loadScript("https://squizlabs.github.io/HTML_CodeSniffer/build/HTMLCS.js"),
    ]);
  });

  async function runScan(ui) {
    const { content, panel } = ui;
    panel.setAttribute("aria-busy", "true");
    content.textContent = "Scanning…";

    try {
      await loadScanners();

      // axe-core (WCAG 2.0/2.1/2.2 AA)
      let axeResults = { violations: [] };
      if (window.axe?.run) {
        axeResults = await window.axe.run(document, {
          runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
        });
      }

      // HTML_CodeSniffer (WCAG2AA)
      let messages = [];
      if (window.HTMLCS?.process) {
        await new Promise((resolve) => window.HTMLCS.process("WCAG2AA", document, resolve));
        if (window.HTMLCS.getMessages) messages = window.HTMLCS.getMessages() || [];
      }
      const counts = { error: 0, warning: 0, notice: 0 };
      for (const m of messages) {
        const t = (m.type || "").toLowerCase();
        counts[t] = (counts[t] || 0) + 1;
      }

      // update UI
      content.innerHTML = `
        <div><strong>axe-core</strong>: ${axeResults.violations.length} violation(s)</div>
        <div><strong>HTML_CodeSniffer (WCAG2AA)</strong>: ${counts.error || 0} error(s),
          ${counts.warning || 0} warning(s), ${counts.notice || 0} notice(s)</div>
        <hr>
        <div style="font-size:12px;opacity:.8">
          Open DevTools → Console to inspect details.
        </div>
      `;

      // (Optional) console debug: uncomment while developing
      // console.debug("[axe] violations:", axeResults.violations);
      // console.debug("[HTMLCS] messages:", messages);
    } catch (e) {
      content.innerHTML = `
        <strong>Accessibility check failed.</strong><br>
        <code style="font-size:12px">${String(e && e.message || e)}</code>
      `;
      panel.style.display = "block";
    } finally {
      panel.removeAttribute("aria-busy");
    }
  }

  // ---- boot ----------------------------------------------------------------
  window.addEventListener("load", () => {
    const ui = ensurePanel();
    if (!ui) return;
    // auto-open panel if ?a11y=1 present
    if (hasFlag) {
      document.getElementById("a11y-panel").style.display = "block";
      document.getElementById("a11y-toggle").setAttribute("aria-expanded", "true");
    }
    ui.runBtn.addEventListener("click", () => runScan(ui));
    // also run once on load
    runScan(ui);
  });
})();
