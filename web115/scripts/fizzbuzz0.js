// 🧮 FizzBuzz: Displays results inside an element on the page
window.addEventListener('DOMContentLoaded', function () {
  // Create or select a container for output
  let output = document.querySelector('[data-fizzbuzz]');
  if (!output) {
    output = document.createElement('section');
    output.setAttribute('data-fizzbuzz', '');
    document.body.appendChild(output);
  }

  // Generate FizzBuzz 1–100
  let list = document.createElement('ul');
  for (let i = 1; i <= 100; i++) {
    let item = document.createElement('li');
    if (i % 15 === 0) {
      item.textContent = 'FizzBuzz';
    } else if (i % 3 === 0) {
      item.textContent = 'Fizz';
    } else if (i % 5 === 0) {
      item.textContent = 'Buzz';
    } else {
      item.textContent = i;
    }
    list.appendChild(item);
  }

  // Add to the page
  output.appendChild(list);
});

