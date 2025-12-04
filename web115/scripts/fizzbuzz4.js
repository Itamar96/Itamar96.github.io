"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("fizzbuzz4-form");
  const output = document.getElementById("datas");

  // Safety: if either is missing, don't run to avoid errors
  if (!form || !output) return;

  function checkDivision(num, divisor) {
    return num % divisor === 0;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    output.innerHTML = "";

    // Optional: clear old greeting if you submit more than once
    const oldGreeting = document.getElementById("fizzbuzz4-greeting");
    if (oldGreeting) {
      oldGreeting.remove();
    }

    // 🔹 Gather inputs – IDs now MATCH the HTML 🔹
    const firstName = document.getElementById("first_name").value.trim();
    const middleName = document.getElementById("middle_initial").value.trim();
    const lastName = document.getElementById("last_name").value.trim();

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
    greeting.id = "fizzbuzz4-greeting";

    // Don’t show "undefined" if middle is empty
    const nameParts = [firstName, middleName, lastName].filter(Boolean);
    greeting.textContent = `Hello ${nameParts.join(" ")}, here is your FizzBuzz 4 list:`;

    output.parentNode.insertBefore(greeting, output);

    // Generate list
    for (let i = 1; i <= totalCount; i++) {
      let text = "";

      for (const divisor in rules) {
        if (checkDivision(i, Number(divisor))) {
          text += rules[divisor] + " ";
        }
      }

      if (text === "") {
        text = defaultWord; // can be blank if you left it blank
      } else {
        text = text.trim();
      }

      const li = document.createElement("li");
      // 🔹 ADD NUMBERING LIKE FIZZBUZZ 0 🔹
      li.textContent = `${i}. ${text}`;
      output.appendChild(li);
    }
  });
});
