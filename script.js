// Portafolio de Santitub - script.js
console.log("Bienvenido al portafolio de Santitub 🚀");

const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function setTheme(dark) {
  document.body.classList.toggle('dark-mode', dark);
  themeToggle.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

// Inicializar tema
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme === 'dark');
} else {
  setTheme(prefersDark);
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  setTheme(!isDark);
});

let hackerBuffer = '';
let hackerMode = false;

function activateHackerMode() {
  document.body.classList.add('hacker-mode');
  // Reemplazar la sección de proyectos
  const projectsSection = document.querySelector('.projects');
  projectsSection.innerHTML = '<h2>💻 Proyectos de GitHub (Hacker Mode)</h2><div class="hacker-projects">Cargando proyectos...</div>';
  fetch('https://api.github.com/users/Santitub/repos?per_page=100')
    .then(res => res.json())
    .then(repos => {
      const container = document.querySelector('.hacker-projects');
      if (!Array.isArray(repos)) {
        container.textContent = 'Error al cargar los proyectos.';
        return;
      }
      container.innerHTML = repos.map(repo => `
        <div class="hacker-repo">
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          <span class="hacker-stars">★ ${repo.stargazers_count}</span>
          <p>${repo.description || ''}</p>
        </div>
      `).join('');
    });
}

function deactivateHackerMode() {
  document.body.classList.remove('hacker-mode');
  window.location.reload(); // Recarga para restaurar el portafolio original
}

document.addEventListener('keydown', (e) => {
  hackerBuffer += e.key.toLowerCase();
  if (hackerBuffer.endsWith('hacker')) {
    window.location.href = 'hacker/index.html';
    hackerBuffer = '';
  }
  if (hackerBuffer.length > 10) hackerBuffer = hackerBuffer.slice(-10);
}); 