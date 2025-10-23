"use strict";

// Minimal fizzbuzz demo script using attribute-based helpers.
// This mirrors the behavior in fizzbuzz.js but prefers [data-muted]
// for live counters / greetings so the migration stays classless.

// Wire up submit handler (script is loaded with `defer`, so DOM is ready)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('name-form');
  if (form) form.addEventListener('submit', useForm);
  initLengthCounters();
});

// Add subtle live counters for first/last names (max 20)
function initLengthCounters() {
  const MAX = 20;
  const fields = [
    { id: 'first_name', label: 'First name' },
    { id: 'last_name',  label: 'Last name'  },
  ];

  for (const f of fields) {
    const input = document.getElementById(f.id);
    if (!input) continue;

    // Create counter element (muted, live-updating)
    const counter = document.createElement('div');
    // use data-muted for styling instead of class to prefer attribute-based selectors
    counter.setAttribute('data-muted', 'true');
    counter.setAttribute('aria-live', 'polite');
    counter.style.marginTop = '0.25rem';
    counter.style.fontSize = '0.9em';

    // Insert right after the input (no HTML edits needed)
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
      // Keep constraint-valid (maxlength already prevents >20)
      input.setCustomValidity(''); // clear any prior message
    };

    // Initialize and attach listeners
    update();
    input.addEventListener('input', update);
    input.addEventListener('blur', update);
  }
}

function ensureGreetingElement() {
  let g = document.getElementById('greeting');
  const datas = document.getElementById('datas');
  if (!datas) return null;
  if (!g) {
    g = document.createElement('p');
    g.id = 'greeting';
    // prefer attribute-based styling
    g.setAttribute('data-muted', 'true');
    datas.parentNode.insertBefore(g, datas);
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

function renderFizzBuzz(name) {
  const datas = document.getElementById('datas');
  if (!datas) return;
  datas.innerHTML = '';
  const frag = document.createDocumentFragment();
  // limit to a reasonable maximum in case of unintended changes
  const MAX = 125;
  for (let i = 1; i <= MAX; i++) {
    const li = document.createElement('li');
    let text = '';
    if (i % 15 === 0) text = 'FizzBuzz';
    else if (i % 3 === 0) text = 'Fizz';
    else if (i % 5 === 0) text = 'Buzz';
    else text = String(i);
    if (i === 1 && name) text = `${text} — Hello, ${name}!`;
    li.textContent = text;
    frag.appendChild(li);
  }
  datas.appendChild(frag);
  // Make container focusable for screen reader announcement, but only if focus is supported
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

  // Basic required fields check
  if (!first || !last || !first.value.trim() || !last.value.trim()) {
    alert('Please enter both first and last name.');
    return;
  }

  const nameParts = [titleCase(first.value)];
  if (mid && mid.value.trim()) nameParts.push(mid.value.trim().toUpperCase() + '.');
  nameParts.push(titleCase(last.value));
  const displayName = nameParts.join(' ');

  const greeting = ensureGreetingElement();
  if (greeting) greeting.textContent = `Hello, ${displayName}!`;

  renderFizzBuzz(displayName);
}

