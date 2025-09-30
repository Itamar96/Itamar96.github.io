"use strict";

// Wire up submit handler (script is loaded with `defer`, so DOM is ready)
document.getElementById("name-form").addEventListener("submit", useForm);

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
      .replace(/\b\p{L}/gu, (c) => c.toUpperCase());

  const firstName = cap(first.value);
  const lastName = cap(last.value);
  const midInit = mid.value.trim()
    ? mid.value.trim().charAt(0).toUpperCase() + "."
    : "";

  const parts = ["Welcome to Iridescent Cinderwyrm Bodywork,", firstName];
  if (midInit) parts.push(midInit);
  parts.push(lastName + "!");
  greeting.textContent = parts.join(" ");

  // Move focus so screen readers announce the updated greeting
  temporarilyFocus(greeting);

  // Build FizzBuzz-style list
  const dd = document.getElementById("datas");
  dd.innerHTML = "";
  dd.setAttribute("aria-live", "polite");

  const frag = document.createDocumentFragment();
  for (let i = 1; i <= 125; i++) {
    const li = document.createElement("li");
    let text = "";
    if (i % 15 === 0) text = "Fizz Buzz"; // divisible by 3 & 5
    else if (i % 3 === 0) text = "Fizz Only";
    else if (i % 5 === 0) text = "Buzz Only";
    else text = `Number ${i}`;
    li.textContent = text;
    frag.appendChild(li);
  }
  dd.appendChild(frag);
}

/**
 * Temporarily focus a non-focusable element so screen readers announce changes.
 * Restores any prior tabindex state after blur.
 */
function temporarilyFocus(el) {
  const hadTabindex = el.hasAttribute("tabindex");
  if (!hadTabindex) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  if (!hadTabindex) {
    el.addEventListener(
      "blur",
      () => el.removeAttribute("tabindex"),
      { once: true }
    );
  }
}

