// web115/scripts/validate.js
document.addEventListener("DOMContentLoaded", function () {
  const htmlLink = document.getElementById("validate-html");
  const cssLink  = document.getElementById("validate-css");

  if (htmlLink) {
    htmlLink.href =
      "https://validator.w3.org/nu/?doc=" + encodeURIComponent(location.href);
  }
  if (cssLink) {
    cssLink.href =
      "https://jigsaw.w3.org/css-validator/validator?uri=" + encodeURIComponent(location.href);
  }
});

<footer>
  <p class="small">
    Validate:
    <a id="validate-html" href="#" target="_blank" rel="noopener">HTML</a> •
    <a id="validate-css"  href="#" target="_blank" rel="noopener">CSS</a>
  </p>
  <p>External links … • Page built by Aethernova Design</p>

  <!-- Load the validation script -->
  <script src="scripts/validate.js"></script>
</footer>
