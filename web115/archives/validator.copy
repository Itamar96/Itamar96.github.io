// validation.js
// Loads the correct validation script based on your course

(function() {
  const scripts = {
    "WEB115": "https://lint.page/kit/67ff88.js",
    "WEB250": "https://lint.page/kit/880bd5.js",
    "WEB215": "https://lint.page/kit/6664c1.js"
  };

  // Look for a <meta name="course" content="WEB115"> in the <head>
  const courseMeta = document.querySelector('meta[name="course"]');
  const course = courseMeta ? courseMeta.getAttribute("content") : null;

  if (course && scripts[course]) {
    const s = document.createElement("script");
    s.src = scripts[course];
    s.crossOrigin = "anonymous";
    document.head.appendChild(s);
    console.log(`✅ Loaded validator for ${course}`);
  } else {
    console.error("❌ No valid course meta tag found (WEB115, WEB250, WEB215).");
  }
})();

    }
    w.HTMLInclude();
}(window, document)
