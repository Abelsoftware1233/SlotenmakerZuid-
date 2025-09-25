// Interactieve banner
const banner = document.querySelector('.banner');
if (banner) {
    banner.addEventListener('click', () => {
        banner.style.backgroundColor = 'lightblue';
    });
}

// Formulier
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const naam = form.naam.value;
        const email = form.email.value;
        // ... verstuur de gegevens ...
    });
}

// Fotogalerij
const galerij = document.querySelector('.galerij');
if (galerij) {
    const fotos = ['foto1.jpg', 'foto2.jpg', 'foto3.jpg'];
    fotos.forEach(foto => {
        const img = document.createElement('img');
        img.src = foto;
        galerij.appendChild(img);
    });
}
