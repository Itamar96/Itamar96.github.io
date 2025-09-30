"use strict";

// Wire up submit handler (script is loaded with `defer`, so DOM is ready)
document.getElementById("name-form").addEventListener("submit", useForm);

// Add subtle live counters for first/last names (max 20)
initLengthCounters();

function initLengthCounters() {
  const MAX = 20;
  const fields = [
    { id: "first_name", label: "First name" },
    { id: "last_name",  label: "Last name"  },
  ];

  for (const f of fields) {
    const input = document.getElementById(f.id);
    if (!input) continue;

    // Create counter element (muted, live-updating)
    const counter = document.createElement("div");
    counter.className = "muted";
    counter.setAttribute("aria-live", "polite");
    counter.style.marginTop = "0.25rem";
    counter.style.fontSize = "0.9em";

    // Insert right after the input (no HTML edits needed)
    input.insertAdjacentElement("afterend", counter);

    const update = () => {
      const len = input.value.length;
      const left = MAX - len;
      if (left <= 0) {
        counter.textContent = `${f.label}: 20/20 — max reached`;
      } else if (left <= 3) {
        counter.textContent = `${f.label}: ${len}/20 — ${left} left`;
      } else {
        counter.textContent = `${f.label}: ${len}/20`;
      }
      // Keep constraint-valid (maxlength already prevents >20)
      input.setCustomValidity(""); // clear any prior message
    };

    // Initialize and attach listeners
    update();
    input.addEventListener("input", update);
    input.addEventListener("blur", update);
  }
}

function useForm(event) {
  event.preventDefault();

  const first = document.getElementById("first_name");
  const mid = document.getElementById("middle_initial");
  const last = document.getElementById("last_name");

  // Basic required fields check
  if (!first.value.trim() || !last.value.trim()) {
    alert("Please enter both first and last name.");
    return;
  }

  // Greeting target
  const greeting = document.getElementById("greeting");

  // Normalize names a bit (capitalize first letters, collapse extra spaces)
  const cap = (s) =>
    s
      .trim()
      .replace(/\s+/g, " ")
      // Capitalize the first letter of each word (Unicode-aware in modern browsers)
      .replace(/

