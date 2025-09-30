"use strict";

// Wire up submit handler
document.getElementById("name-form").addEventListener("submit", useForm);

// Attach live counters to first and last name fields
setupCounter("first_name", "First name");
setupCounter("last_name", "Last name");

function setupCounter(id, label) {
  const MAX = 20;
  const input = document.getElementById(id);

  if (!input) return;

  // Create counter element
  const counter = document.createElement("div");
  counter.className = "muted";
  counter.style.marginTop = "0.25rem";
  counter.style.fontSize = "0.9em";

  // Insert after the input
  input.insertAdjacentElement("afterend", counter);

  const update = () => {
    const len = input.value.length;
    counter.textContent = `${label}: ${len}/${MAX}`;
  };

  // Initialize and listen
  update();
  input.addEventListener("input", update);
}

function useForm(event) {
  event.preventDefault();

  const first = document.getElementById("first_name").value.trim();
  const mid = document.getElementById("middle_initial").value.trim();
  const last = document.getElementById("last_name").value.trim();

  // Greeting target
  const greeting = document.getElementById("greeting");

  // Build full name
  let fullName = first;
  if (mid) {
    fullName += " " + mid + ".";
  }
  fullName += " " + last;

  greeting.textContent = `Welcome, ${fullName}!`;

  // FizzBuzz output (1–125)
  const datas = document.getElementById("datas");
  datas.innerHTML = "";

  for (let i = 1; i <= 125; i++) {
    let output = "";
    if (i % 3 === 0) output += "Fizz";
    if (i % 5 === 0) output += "Buzz";
    if (output === "") output = i;

    const li = document.createElement("li");
    li.textContent = output;
    datas.appendChild(li);
  }
}


