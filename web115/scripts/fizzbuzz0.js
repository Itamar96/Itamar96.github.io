"use strict";

/* Initialize when DOM is ready (works with or without `defer`) */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

function init() {
  const form = document.getElementById("name-form");
  if (form) form.addEventListener("submit", useForm);

  initLengthCounters();
}

/* Live character counters for first/last name (max 20) */
function initLengthCounters() {
  const MAX = 20;
  const fields = [
    { id: "first_name", label: "First name" },
    { id: "last_name",  label: "Last name"  },
  ];

  for (const f of fields) {
    const input = document.getElementById(f.id);
    if (!input) continue;

    const counter = document.createElement("div");
    counter.className = "muted";
    counter.setAttribute("aria-live", "polite");
    counter.style.marginTop = "0.25rem";
    counter.style.fontSize = "0.9em";

    input.insertAdjacentElement("afterend", counter);

    const update = () => {
      const len = input.value.length;
      const left = MAX - len;
      if (left <= 0) {
        counter.textContent = `${f.label}: 20/20 - max reached`;
      } else if (left <= 3) {
        counter.textContent = `${f.label}: ${len}/20 - ${left} left`;
      } else {
        counter.textContent = `${f.label}: ${len}/20`;
      }
      input.setCustomValidity(""); // keep constraint-valid
    };

    update();
    input.addEventListener("input", update);
    input.addEventListener("blur", update);
  }
}

function useForm(event) {
  event.preventDefault();

  const firstEl = document.getElementById("first_name");
  const midEl   = document.getElementById("middle_initial");
  const lastEl  = document.getElementById("last_name");
  const datas   = document.getElementById("datas");
  const greeting = document.getElementById("greeting");

  const first = (firstEl?.value || "").trim();
  const mid   = (midEl?.value || "").trim();
  const last  = (lastEl?.value || "").trim();

  if (!first || !last) {
    alert("Please enter both first and last name.");
    return;
  }

  // Normalize names (capitalize words)
  const capWords = (s) =>
    s
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b([a-z])/gi, (m, ch) => ch.toUpperCase());

  const firstName = capWords(first);
  const lastName  = capWords(last);
  let middle = "";

  if (mid) {
    // Keep only the first A-Z letter for middle initial
    const m = mid.match(/[A-Za-z]/);
    if (m) middle = m[0].toUpperCase() + ".";
  }

  const fullName = [firstName, middle, lastName].filter(Boolean).join(" ");
  if (greeting) greeting.textContent = `Welcome, ${fullName}!`;

  // Render FizzBuzz 1..125
  if (datas) {
    datas.innerHTML = "";
    for (let i = 1; i <= 125; i++) {
      let text = "";
      if (i % 3 === 0) text += "Fizz";
      if (i % 5 === 0) text += "Buzz";
      if (!text) text = String(i);

      const li = document.createElement("li");
      li.textContent = text;
      datas.appendChild(li);
    }
  }
}

