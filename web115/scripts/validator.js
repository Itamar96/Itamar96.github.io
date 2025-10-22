// validator.js
"use strict";

// Populates footer with a live Accumulus validation link
(function() {
  document.addEventListener("DOMContentLoaded", function() {
    try {
      var placeholder = document.getElementById("validate-link-placeholder");
      if (!placeholder) {
        console.info("No #validate-link-placeholder found; skipping validator link.");
        return;
      }

      var a = document.createElement("a");
      a.href = "https://validator.w3.org/nu/?doc=" + encodeURIComponent(location.href);
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "Validate HTML";

      placeholder.append(" ✶ ", a);
    } catch (e) {
      console.error("Validator script error:", e);
    }
  });
})();
