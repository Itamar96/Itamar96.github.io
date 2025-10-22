// fizzbuzz.js
// Handles name form submission and FizzBuzz generation
// Author: Itamar B. Castillo
// Course: WEB115
// Assignment: FizzBuzz 0

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("name-form");
  const outputList = document.getElementById("data");

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Get user input
    const first = document.getElementById("first_name").value.trim();
    const middle = document.getElementById("middle_initial").value.trim();
    const last = document.getElementById("last_name").value.trim();

    // Build full name
    let fullName = first;
    if (middle) {
      fullName += " " + middle + ".";
    }
    fullName += " " + last;

    // Greeting message
    alert(`Welcome ${fullName}! Enjoy your FizzBuzz results!`);

    // Clear previous output
    outputList.innerHTML = "";

    // Generate FizzBuzz results 1–125
    for (let i = 1; i <= 125; i++) {
      let text = "";

      if (i % 3 === 0) {
        text += "Fizz";
      }
      if (i % 5 === 0) {
        text += "Buzz";
      }
      if (!text) {
        text = i;
      }

      const li = document.createElement("li");
      li.textContent = text;
      outputList.appendChild(li);
    }
  });
});
