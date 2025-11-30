"use strict";

// Minimal greeting + themed loop (FizzBuzz-style).
// Keeps your structure; inserts the greeting heading under the page title.

function initLengthCounters() {
  const MAX = 20;
  const fields = [
    { id: 'first_name', label: 'First name' },
    { id: 'last_name',  label: 'Last name'  }
  ];

  for (const f of fields) {
    const input = document.getElementById(f.id);
    if (!input) continue;

    const counter = document.createElement('div');
    counter.setAttribute('data-muted', 'true');
    counter.setAttribute('aria-live', 'polite');
    counter.style.marginTop = '0.25rem';
    counter.style.fontSize = '0.9em';
    input.insertAdjacentElement('afterend', counter);

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
      input.setCustomValidity('');
    };

    update();
    input.addEventListener('input', update);
    input.addEventListener('blur', update);
  }
}

// Insert (if missing) and return a heading <h3 id="greeting">
// Placed UNDER your existing page title <h3> inside <main> > <section>
function ensureGreetingElement() {
  let g = document.getElementById('greeting');
  if (g) return g;

  const section = document.querySelector('main > section');
  if (!section) return null;

  const firstH3 = section.querySelector('h3'); // "Instructions here"
  g = document.createElement('h3');
  g.id = 'greeting';
  g.textContent = 'Welcome to Iridescent Cinderwyrm Bodywork!';
  // Prefer heading (h3), not paragraph, to satisfy the assignment
  if (firstH3 && firstH3.parentNode === section) {
    firstH3.insertAdjacentElement('afterend', g);
  } else {
    section.insertAdjacentElement('afterbegin', g);
  }
  return g;
}

function titleCase(s) {
  return s
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

// Render the themed list per assignment:
// - Prompt for count (Part II). If invalid, fallback to 125 (Part I).
// - Two-word phrase only.
// - Show "the number is even/odd" on the same line.
function renderFizzBuzz(firstName) {
  const datas = document.getElementById('datas');
  if (!datas) return;
  datas.innerHTML = '';

  let howMany = prompt(`How high do you want to count, ${titleCase(firstName || 'friend')}?`);
  howMany = parseInt(howMany, 10);
  if (!Number.isFinite(howMany) || howMany < 1) howMany = 125; // Part I fallback
  // Optionally cap to prevent runaway rendering
  howMany = Math.min(howMany, 1000);

  const phrase = 'Soothing Session'; // massage theme, exactly two words

  const frag = document.createDocumentFragment();
  for (let i = 1; i <= howMany; i++) {
    const li = document.createElement('li');
    const parity = (i % 2 === 0) ? 'even' : 'odd';
    // Example format required by prompt:
    // 1) Soothing Session - the number is odd
    li.textContent = `${i}) ${phrase} - the number is ${parity}`;
    frag.appendChild(li);
  }
  datas.appendChild(frag);

  // Accessibility: allow SR/keyboard users to jump to output
  try {
    datas.setAttribute('tabindex', '-1');
    if (typeof datas.focus === 'function') datas.focus();
  } catch (e) { /* ignore focus errors */ }
}

function useForm(event) {
  event.preventDefault();

  const first = document.getElementById('first_name');
  const mid = document.getElementById('middle_initial');
  const last = document.getElementById('last_name');

  if (!first || !last || !first.value.trim() || !last.value.trim()) {
    alert('Please enter both first and last name.');
    return;
  }

  const nameParts = [titleCase(first.value)];
  if (mid && mid.value.trim()) nameParts.push(mid.value.trim().toUpperCase() + '.');
  nameParts.push(titleCase(last.value));
  const displayName = nameParts.join(' ');

  const greeting = ensureGreetingElement();
  if (greeting) {
    greeting.textContent = `Welcome to Iridescent Cinderwyrm Bodywork, ${displayName}!`;
  }

  // Now render the themed list (Part I + II behavior)
  renderFizzBuzz(first.value.trim());
}

// Attach listeners
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('name-form');
  if (form) form.addEventListener('submit', useForm);
  initLengthCounters();
  // Make sure greeting appears even before submit
  ensureGreetingElement();
});

function addMiddleOptionalNote() {
  const mid = document.getElementById('middle_initial');
  if (!mid) return;

  const note = document.createElement('div');
  note.setAttribute('data-muted', 'true');
  note.style.marginTop = '0.25rem';
  note.style.fontSize = '0.9em';
  note.textContent = '(Optional)';

  // Put the note right under the middle initial box
  mid.insertAdjacentElement('afterend', note);
}
document.addEventListener('DOMContentLoaded', addMiddleOptionalNote);