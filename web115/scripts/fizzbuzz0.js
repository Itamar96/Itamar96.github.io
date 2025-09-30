document.getElementById('name-form').addEventListener('submit', useForm);

function useForm(event) {
   event.preventDefault();

   const first = document.getElementById('first_name');
   const mid = document.getElementById('middle_initial');
   const last = document.getElementById('last_name');

   if (!first.value.trim() || !last.value.trim()) {
      alert('Please enter both first and last name.');
      return;
   }

   -
   const greeting = document.getElementById('greeting'); -
   const parts = ['Welcome to Iridescent Cinderwyrm Bodywork,', first.value.trim()]; -
   if (mid.value.trim()) parts.push(mid.value.trim().charAt(0).toUpperCase() + '.'); -
   parts.push(last.value.trim() + '!'); +
   const greeting = document.getElementById('greeting'); + // Normalize names a bit (caps first letters; single-letter middle initial)
   +
   const cap = s => s.trim().replace(/\s+/g, ' ').replace(/\b\p{L}/gu, c => c.toUpperCase()); +
   const firstName = cap(first.value); +
   const lastName = cap(last.value); +
   const midInit = mid.value.trim() ? mid.value.trim().charAt(0).toUpperCase() + '.' : ''; +
   const parts = ['Welcome to Iridescent Cinderwyrm Bodywork,', firstName]; +
   if (midInit) parts.push(midInit); +
   parts.push(lastName + '!');
   greeting.textContent = parts.join(' '); + // Move focus so SR users hear the change
   +temporarilyFocus(greeting);

   const dd = document.getElementById('datas');
   dd.innerHTML = ''; + // Ensure live updates are announced even if HTML missed it
   +dd.setAttribute('aria-live', 'polite');

   const frag = document.createDocumentFragment();
   for (let i = 1; i <= 125; i++) {
      const li = document.createElement('li');
      let text = '';
      if (i % 15 === 0) text = 'Fizz Buzz'; // divisible by 3 & 5
      else if (i % 3 === 0) text = 'Fizz Only'; // two words
      else if (i % 5 === 0) text = 'Buzz Only'; // two words
      else text = `Number ${i}`; // two words
      li.textContent = text;
      frag.appendChild(li);
   }
   dd.appendChild(frag);
}

+ // Helper: temporarily focus a non-focusable element (for screen readers)
+ function temporarilyFocus(el) {
   +
   const hadTabindex = el.hasAttribute('tabindex'); +
   if (!hadTabindex) el.setAttribute('tabindex', '-1'); +
   el.focus({
      preventScroll: true
   }); +
   if (!hadTabindex) el.addEventListener('blur', () => el.removeAttribute('tabindex'), {
      once: true
   }); +
}
