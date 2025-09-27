document.addEventListener('DOMContentLoaded', function () {
  var toggleButton = document.getElementById('theme-toggle');
  if (toggleButton) {
    toggleButton.addEventListener('click', function () {
      document.body.classList.toggle('dark-theme');
    });
  }
});
