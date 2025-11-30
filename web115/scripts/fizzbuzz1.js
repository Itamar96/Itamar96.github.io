"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("fizzbuzz1-form");
  const output = document.getElementById("datas");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    output.innerHTML = ""; // clear previous run

    const baseWord = document.getElementById("baseWord").value.trim() || "Breathe!";
    const word3 = document.getElementById("word3").value.trim() || "Relax!";
    const word5 = document.getElementById("word5").value.trim() || "Restore!";

    for (let i = 1; i <= 140; i++) {
      let text = baseWord;

      if (i % 3 === 0 && i % 5 === 0) {
        text = `${word3} ${word5}`;
      } else if (i % 3 === 0) {
        text = word3;
      } else if (i % 5 === 0) {
        text = word5;
      }

      const li = document.createElement("li");
      li.textContent = `${i}. ${text}`;
      output.appendChild(li);
    }
  });
});
