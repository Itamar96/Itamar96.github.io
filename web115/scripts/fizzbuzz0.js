// 🐉 FizzBuzz Interactive Script for WEB115
window.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('name-form');
  var outputList = document.getElementById('datas');

  if (!form || !outputList) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Collect form values
    var first = document.getElementById('first_name').value.trim();
    var middle = document.getElementById('middle_initial').value.trim();
    var last = document.getElementById('last_name').value.trim();

    // Build greeting
    var fullName = first;
    if (middle) fullName += ' ' + middle + '.';
    fullName += ' ' + last;

    // Clear old results
    outputList.innerHTML = '';

    // Add greeting
    var greeting = document.createElement('p');
    greeting.textContent = 'Hello, ' + fullName + '! Here is your FizzBuzz sequence:';
    outputList.appendChild(greeting);

    // Generate FizzBuzz 1–125
    for (var i = 1; i <= 125; i++) {
      var item = document.createElement('li');

      if (i % 15 === 0) {
        item.textContent = 'FizzBuzz';
      } else if (i % 3 === 0) {
        item.textContent = 'Fizz';
      } else if (i % 5 === 0) {
        item.textContent = 'Buzz';
      } else {
        item.textContent = i;
      }

      outputList.appendChild(item);
    }
  });
});
