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

    const greeting = document.getElementById('greeting');
    const parts = ['Welcome to Iridescent Cinderwyrm Bodywork,', first.value.trim()];
    if (mid.value.trim()) parts.push(mid.value.trim().charAt(0).toUpperCase() + '.');
    parts.push(last.value.trim() + '!');
    greeting.textContent = parts.join(' ');

    const dd = document.getElementById('datas');
    dd.innerHTML = '';

    const frag = document.createDocumentFragment();
    for (let i = 1; i <= 125; i++) {
        const li = document.createElement('li');
        let text = '';
        if (i % 15 === 0) text = 'Fizz Buzz';      // divisible by 3 & 5
        else if (i % 3 === 0) text = 'Fizz Only';  // two words
        else if (i % 5 === 0) text = 'Buzz Only';  // two words
        else text = `Number ${i}`;                 // two words
        li.textContent = text;
        frag.appendChild(li);
    }
    dd.appendChild(frag);
}
