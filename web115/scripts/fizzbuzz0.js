document.getElementById('name-form').addEventListener('submit', useForm);

function useForm(event) {
    event.preventDefault();

    const first=document.getElementById('first_name');
    const mid=document.getElementById('middle_initial');
    const last=document.getElementById('last_name');

    if ( !first.value.trim() || !last.value.trim()) {
        alert('Please enter both first and last name.');
        return;
    }

    const greeting=document.getElementById('greeting');
    const parts=['Welcome to Iridescent Cinderwyrm Bodywork,',
    first.value.trim()];
    if (mid.value.trim()) parts.push(mid.value.trim().charAt(0).toUpperCase() + '.');
    parts.push(last.value.trim() + '!');
    greeting.textContent=parts.join(' ');

    const dd=document.getElementById('datas');
    dd.innerHTML='';

    const phrase='cinder wyrm'; 
    const frag=document.createDocumentFragment();

    for (let i=1; i <=125; i++) {
        const li=document.createElement('li');
        li.textContent=phrase;
        frag.appendChild(li);
    }

    dd.appendChild(frag);
}
