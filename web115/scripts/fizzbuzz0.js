// fizzbuzz.js
// Handles name form submission and FizzBuzz generation safely
// Author: Itamar B. Castillo
// Course: WEB115
// Assignment: FizzBuzz 0

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("name-form");
  const outputList = document.getElementById("data");
  const greeting = document.getElementById("greeting");

  // Guard clause: ensure form and output list exist
  if (!form || !outputList) {
    console.error("FizzBuzz initialization error: required elements missing.");
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get and sanitize user input
    const first = document.getElementById("first_name").value.trim();
    const middle = document.getElementById("middle_initial").value.trim();
    const last = document.getElementById("last_name").value.trim();

    // Build full name
    let fullName = first;
    if (middle) {
      fullName += " " + middle + ".";
    }
    fullName += " " + last;

    // Display greeting (non-blocking, accessible)
    if (greeting) {
      greeting.textContent = `Welcome ${fullName}! Enjoy your FizzBuzz results!`;
    }

    // Clear previous results
    outputList.innerHTML = "";

    // Generate FizzBuzz sequence (1–125)
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

