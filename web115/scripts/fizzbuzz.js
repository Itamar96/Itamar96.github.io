"use strict";

(function () {
  // Safe helper
  const $ = (id) => document.getElementById(id);

  function ensureGreetingElement() {
    let g = $('greeting');
    const datas = $('datas');
    if (!datas) return null;
    if (!g) {
  g = document.createElement('p');
  g.id = 'greeting';
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
    const datas = $('datas');
    if (!datas) return;
    datas.innerHTML = ''; // clear previous results
    const frag = document.createDocumentFragment();
    for (let i = 1; i <= 125; i++) {
      const li = document.createElement('li');
      let text = '';
      if (i % 15 === 0) text = 'FizzBuzz';
      else if (i % 3 === 0) text = 'Fizz';
      else if (i % 5 === 0) text = 'Buzz';
      else text = String(i);
      // include name on the first line only (friendly)
      if (i === 1 && name) text = `${text} — Hello, ${name}!`;
      li.textContent = text;
      frag.appendChild(li);
    }
    datas.appendChild(frag);
    // Move focus to the list for keyboard users
    datas.setAttribute('tabindex', '-1');
    datas.focus();
  }

  function initLengthCounters() {
    const MAX = 20;
    const fields = [
      { id: 'first_name', label: 'First name' },
      { id: 'last_name', label: 'Last name' },
    ];
    for (const f of fields) {
      const input = $(f.id);
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
        if (left <= 0) counter.textContent = `${f.label}: 20/20 — max reached`;
        else if (left <= 3) counter.textContent = `${f.label}: ${len}/20 — ${left} left`;
        else counter.textContent = `${f.label}: ${len}/20`;
        input.setCustomValidity('');
      };
      update();
      input.addEventListener('input', update);
      input.addEventListener('blur', update);
    }
  }

  function useForm(ev) {
    ev.preventDefault();
    const first = $('first_name');
    const mid = $('middle_initial');
    const last = $('last_name');
    if (!first || !last) return;
    if (!first.value.trim() || !last.value.trim()) {
      try {
        const hint = document.getElementById('form-hint');
        if (hint) {
          hint.textContent = 'Please enter both first and last name.';
          hint.setAttribute('role', 'status');
        } else {
          alert('Please enter both first and last name.');
        }
      } catch (e) { alert('Please enter both first and last name.'); }
      return;
    }

    const nameParts = [titleCase(first.value)];
    if (mid && mid.value.trim()) nameParts.push(mid.value.trim().toUpperCase() + '.');
    nameParts.push(titleCase(last.value));
    const displayName = nameParts.join(' ');

    const greeting = ensureGreetingElement();
    if (greeting) {
      greeting.textContent = `Hello, ${displayName}!`;
    }

    renderFizzBuzz(displayName);
  }

  // Boot
  document.addEventListener('DOMContentLoaded', () => {
    initLengthCounters();
    const form = $('name-form');
    if (form) form.addEventListener('submit', useForm);
  });
})();
