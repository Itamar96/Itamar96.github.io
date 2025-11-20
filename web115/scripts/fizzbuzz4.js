"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("fizzbuzz-form");
  const output = document.getElementById("datas");

  function checkDivision(num, divisor) {
    return num % divisor === 0;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    output.innerHTML = "";

    // Gather inputs
    const firstName = document.getElementById("firstName").value.trim();
    const middleName = document.getElementById("middleName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();

    const divisor1 = parseInt(document.getElementById("divisor1").value, 10);
    const word1 = document.getElementById("word1").value.trim();

    const divisor2 = parseInt(document.getElementById("divisor2").value, 10);
    const word2 = document.getElementById("word2").value.trim();

    const divisor3 = parseInt(document.getElementById("divisor3").value, 10);
    const word3 = document.getElementById("word3").value.trim();

    const totalCount = parseInt(document.getElementById("totalCount").value, 10);
    const defaultWord = document.getElementById("defaultWord").value.trim();

    // Map divisors to words
    const rules = {
      [divisor1]: word1,
      [divisor2]: word2,
      [divisor3]: word3
    };

    // Personalized greeting (outside the list)
    const greeting = document.createElement("p");
    greeting.textContent = `Hello ${firstName} ${middleName} ${lastName}, here is your FizzBuzz 4 list:`;
    output.parentNode.insertBefore(greeting, output);

    // Generate list
    for (let i = 1; i <= totalCount; i++) {
      let text = "";

      for (const divisor in rules) {
        if (checkDivision(i, divisor)) {
          text += rules[divisor] + " ";
        }
      }

      if (text === "") {
        text = defaultWord; // blank if empty
      } else {
        text = text.trim();
      }

      const li = document.createElement("li");
      li.textContent = text; // ✅ no manual numbering
      output.appendChild(li);
    }
  });
});
