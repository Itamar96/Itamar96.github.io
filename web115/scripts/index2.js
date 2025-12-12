// scripts/index2.js

// ----- page-specific script loader (define BEFORE use) -----
function loadPageScript(pageName) {
  // Remove any previously injected page scripts
  document.querySelectorAll("script[data-dynamic]").forEach((script) => {
    script.remove();
  });

  // Helper to inject a script
  function inject(src) {
    var s = document.createElement("script");
    s.src = src;
    s.defer = true;
    s.dataset.dynamic = "true";
    document.body.appendChild(s);
  }

  // Pages that need their own JS
  if (pageName === "introduction-form") inject("scripts/intro-form.js");
  if (pageName === "fizzbuzz0") inject("scripts/fizzbuzz0.js");
  if (pageName === "fizzbuzz1") inject("scripts/fizzbuzz1.js");
  if (pageName === "fizzbuzz2") inject("scripts/fizzbuzz2.js");
  if (pageName === "fizzbuzz3") inject("scripts/fizzbuzz3.js");
  if (pageName === "fizzbuzz4") inject("scripts/fizzbuzz4.js");
}

// ----- helpers -----
function getSiteTitle() {
  var h1 = document.querySelector("header h1");
  return h1
    ? h1.textContent.trim()
    : "Itamar Castillo's Iridescent Cinderwyrm - WEB115";
}

function updateTitle() {
  var siteTitle = getSiteTitle();
  var host = document.getElementById("main");
  var h2 = host ? host.querySelector("h2") : null;

  if (h2) {
    document.title = siteTitle + " - " + h2.textContent.trim();
  } else {
    document.title = siteTitle;
  }
}

// ----- main loader -----
function loadMain(pageName) {
  var host = document.getElementById("main");
  var url = "components/main/" + pageName + ".html";

  fetch(url, { cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) throw new Error("Failed to load: " + url);
      return response.text();
    })
    .then(function (html) {
      host.innerHTML = html;
      updateTitle();
      loadPageScript(pageName);
    })
    .catch(function (err) {
      console.error(err);
      host.innerHTML =
        "<section><h2>Page Not Found</h2><p>The requested content could not be loaded.</p></section>";
      document.title = getSiteTitle() + " - Page Not Found";
    });
}

// ----- routing -----
function loadInitialPage() {
  var page = location.hash.replace("#", "").trim();
  loadMain(page || "home");
}

function handleNavClick(event) {
  var link = event.target.closest("a[data-page]");
  if (!link) return;

  event.preventDefault();
  var page = link.dataset.page;

  location.hash = page; // triggers hashchange + loadInitialPage
}

// ----- init -----
window.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", handleNavClick);
  loadInitialPage();
});

window.addEventListener("hashchange", loadInitialPage);
