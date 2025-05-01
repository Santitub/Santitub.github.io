document.body.classList.add('hacker-transition');

const projectsContainer = document.querySelector('.hacker-projects');
const searchInput = document.getElementById('search-input');
const languageFilter = document.getElementById('language-filter');
const starsFilter = document.getElementById('stars-filter');
const backBtn = document.getElementById('back-btn');
const loader = document.getElementById('hacker-loader');

let allRepos = [];

function renderProjects(repos) {
  if (!repos.length) {
    projectsContainer.innerHTML = '<p style="color:#0ff">No se encontraron proyectos.</p>';
    return;
  }
  projectsContainer.innerHTML = repos.map(repo => `
    <div class="hacker-repo" onclick="window.open('${repo.html_url}', '_blank')">
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      <span class="hacker-stars">★ ${repo.stargazers_count}</span>
      <p>${repo.description || ''}</p>
      <div style="margin-top:0.5rem;font-size:0.93rem;color:#0f0;">
        <b>Lenguaje:</b> ${repo.language || 'Desconocido'}
      </div>
    </div>
  `).join('');
}

function updateFilters() {
  let filtered = allRepos;
  const search = searchInput.value.toLowerCase();
  const lang = languageFilter.value;
  const starsOrder = starsFilter.value;
  if (search) {
    filtered = filtered.filter(r => r.name.toLowerCase().includes(search) || (r.description && r.description.toLowerCase().includes(search)));
  }
  if (lang) {
    filtered = filtered.filter(r => r.language === lang);
  }
  if (starsOrder === 'asc') {
    filtered = filtered.slice().sort((a, b) => a.stargazers_count - b.stargazers_count);
  } else {
    filtered = filtered.slice().sort((a, b) => b.stargazers_count - a.stargazers_count);
  }
  renderProjects(filtered);
}

function fillLanguageOptions(repos) {
  const langs = Array.from(new Set(repos.map(r => r.language).filter(Boolean)));
  languageFilter.innerHTML = '<option value="">Todos los lenguajes</option>' + langs.map(l => `<option value="${l}">${l}</option>`).join('');
}

loader.style.display = 'flex';
projectsContainer.style.display = 'none';

fetch('https://api.github.com/users/Santitub/repos?per_page=100')
  .then(res => res.json())
  .then(repos => {
    allRepos = repos;
    fillLanguageOptions(allRepos);
    updateFilters();
    loader.style.display = 'none';
    projectsContainer.style.display = 'grid';
  });

searchInput.addEventListener('input', updateFilters);
languageFilter.addEventListener('change', updateFilters);
starsFilter.addEventListener('change', updateFilters);

backBtn.addEventListener('click', () => {
  window.location.href = '../index.html';
}); 