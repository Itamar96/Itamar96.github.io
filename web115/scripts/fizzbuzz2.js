"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("fizzbuzz2-form");
  const output = document.getElementById("datas");

  // Divisors (default to 3 and 5, but you can change them here)
  const firstDivisor = 3;
  const secondDivisor = 5;

  // Function to check divisibility
  function checkDivision(num, divisor) {
    return num % divisor === 0;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    output.innerHTML = ""; // clear previous run

    const baseWord = document.getElementById("baseWord").value.trim() || "Breathe!";
    const word3 = document.getElementById("word3").value.trim() || "Relax!";
    const word5 = document.getElementById("word5").value.trim() || "Restore!";

    for (let i = 1; i <= 140; i++) {
      let text = baseWord;

      if (checkDivision(i, firstDivisor) && checkDivision(i, secondDivisor)) {
        text = `${word3} ${word5}`;
      } else if (checkDivision(i, firstDivisor)) {
        text = word3;
      } else if (checkDivision(i, secondDivisor)) {
        text = word5;
      }

      const li = document.createElement("li");
      li.textContent = `${i}. ${text}`;
      output.appendChild(li);
    }
  });
});
