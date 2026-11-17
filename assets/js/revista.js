const body = document.body;
const contrastButton = document.querySelector('#contraste');
let fontStep = 0;
let highContrast = false;

function savePreferences() {
  try {
    localStorage.setItem('pomar-leitura', JSON.stringify({ fontStep, highContrast }));
  } catch {
    // Os controles também funcionam quando o navegador bloqueia o armazenamento.
  }
}

try {
  const saved = JSON.parse(localStorage.getItem('pomar-leitura'));
  if (Number.isInteger(saved?.fontStep)) fontStep = Math.max(-2, Math.min(4, saved.fontStep));
  highContrast = saved?.highContrast === true;
} catch {
  // As preferências iniciais são usadas se o armazenamento estiver indisponível.
}

function updatePreferences() {
  document.documentElement.style.fontSize = `${100 + fontStep * 10}%`;
  body.classList.toggle('high-contrast', highContrast);
  contrastButton.setAttribute('aria-pressed', String(highContrast));
}

document.querySelectorAll('[data-font]').forEach(button => {
  button.addEventListener('click', () => {
    const change = Number(button.dataset.font);
    fontStep = change === 0 ? 0 : Math.max(-2, Math.min(4, fontStep + change));
    updatePreferences();
    savePreferences();
  });
});

contrastButton.addEventListener('click', () => {
  highContrast = !highContrast;
  updatePreferences();
  savePreferences();
});

updatePreferences();

const cover = document.querySelector('#foto-capa');
if (cover) {
  const photos = [
    ['capa.jpg', 'Vista ampla do Pomar, com uma muda em primeiro plano'],
    ['plantio.jpg', 'Área aberta de plantio com árvores e mudas no solo'],
    ['horto.jpg', 'Mudas agrupadas em canteiro no Horto Pedagógico']
  ];
  const counter = document.querySelector('#foto-contador');
  let currentPhoto = 0;

  document.querySelectorAll('[data-slide]').forEach(button => {
    button.addEventListener('click', () => {
      currentPhoto = (currentPhoto + Number(button.dataset.slide) + photos.length) % photos.length;
      const [file, description] = photos[currentPhoto];
      cover.src = `assets/img/${file}`;
      cover.alt = description;
      counter.textContent = `${currentPhoto + 1} / ${photos.length}`;
    });
  });
}
