// Configuración
const GITHUB_USER = 'Santitub';
const EXCLUDE_REPOS = ['Santitub.github.io'];

// Obtener proyectos de GitHub
async function getProjects() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos`);
        const repos = await response.json();
        
        return repos
            .filter(repo => !repo.fork && !EXCLUDE_REPOS.includes(repo.name))
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

// Crear tarjeta de proyecto
function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const tech = repo.language ? [repo.language] : [];
    if(repo.topics) tech.push(...repo.topics);

    card.innerHTML = `
        <h3>${repo.name}</h3>
        ${repo.description ? `<p>${repo.description}</p>` : ''}
        
        <div class="project-tech">
            ${tech.slice(0, 3).map(t => `
                <span class="tech-badge">${t}</span>
            `).join('')}
        </div>

        <div class="project-stats">
            <span>⭐ ${repo.stargazers_count}</span>
            <span>📅 ${new Date(repo.updated_at).toLocaleDateString()}</span>
        </div>

        <a href="${repo.html_url}" target="_blank" class="project-link">
            Ver en GitHub
        </a>
    `;

    return card;
}

// Cargar y mostrar proyectos
async function loadProjects() {
    const container = document.getElementById('projects-container');
    container.innerHTML = '<div class="loading">Buscando repositorios...</div>';
    
    const projects = await getProjects();
    
    if(projects.length === 0) {
        container.innerHTML = '<div class="loading">No se encontraron proyectos públicos</div>';
        return;
    }

    container.innerHTML = '';
    projects.forEach(repo => {
        container.appendChild(createProjectCard(repo));
    });
}

// Inicializar
document.addEventListener('DOMContentLoaded', loadProjects);