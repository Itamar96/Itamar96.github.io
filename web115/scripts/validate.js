async function includeHTML() {
  const elements = document.querySelectorAll('[w3-include-html]');
  for (const el of elements) {
    const file = el.getAttribute('w3-include-html');
    if (!file) continue;

    try {
      const res = await fetch(file);
      if (!res.ok) {
        el.innerHTML = 'Page not found.';
      } else {
        el.innerHTML = await res.text();
      }
    } catch (err) {
      console.error(`Error including ${file}:`, err);
      el.innerHTML = 'Page not found.';
    }

    el.removeAttribute('w3-include-html');
  }
}

