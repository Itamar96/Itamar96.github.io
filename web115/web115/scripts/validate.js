// validate.js - adds links to W3C validators
document.addEventListener("DOMContentLoaded", function () {
  const htmlLink = document.getElementById("validate-html");
  const cssLink  = document.getElementById("validate-css");

  if (htmlLink) {
    htmlLink.href = "https://validator.w3.org/nu/?doc=" + encodeURIComponent(location.href);
  }
  if (cssLink) {
    cssLink.href = "https://jigsaw.w3.org/css-validator/validator?uri=" + encodeURIComponent(location.href);
  }
});
