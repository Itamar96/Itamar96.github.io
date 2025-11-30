"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("fizzbuzz3-form");
  const output = document.getElementById("datas");

  // Generic divisibility check
  function checkDivision(num, divisor) {
    return num % divisor === 0;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    output.innerHTML = ""; // clear previous run

    const baseWord = document.getElementById("baseWord").value.trim() || "Breathe!";
    const word3 = document.getElementById("word3").value.trim() || "Relax!";
    const word5 = document.getElementById("word5").value.trim() || "Restore!";
    const word7 = document.getElementById("word7").value.trim() || "BANG!";

    // Map divisors to words
    const rules = {
      3: word3,
      5: word5,
      7: word7
    };

    for (let i = 1; i <= 140; i++) {
      let text = "";

      // Loop through all rules
      for (const divisor in rules) {
        if (checkDivision(i, divisor)) {
          text += rules[divisor] + " ";
        }
      }

      // If no matches, use base word
      if (text === "") {
        text = baseWord;
      } else {
        text = text.trim(); // clean trailing space
      }

      const li = document.createElement("li");
      li.textContent = `${i}. ${text}`;
      output.appendChild(li);
    }
  });
});
