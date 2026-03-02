/**
 * Portfolio Interactive Script
 * - Hero Background Canvas
 * - AJAX Project Loading & Filtering
 * - Navigation Effects
 * - AJAX Contact Form
 * - Project Detail Modals
 */

document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    if (document.getElementById('projects-container')) {
        loadProjects();
    }
    handleNavbar();
    if (document.getElementById('contactForm')) {
        handleContactForm();
    }
});

// --- Hero Canvas (Particle Effect) ---
function initCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// --- AJAX Project Loading & Filtering ---
let allProjects = [];

async function loadProjects() {
    const container = document.getElementById('projects-container');
    const filterBtns = document.querySelectorAll('.filter-btn');

    try {
        const response = await fetch('projects.json');
        allProjects = await response.json();

        renderProjects(allProjects);

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                const filtered = filter === 'all' ? allProjects : allProjects.filter(p => p.tag === filter);
                renderProjects(filtered);
            });
        });
    } catch (error) {
        console.error('Erreur loading projects:', error);
        container.innerHTML = '<div class="col-12 text-center text-danger">Impossible de charger les projets.</div>';
    }
}

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;
    container.innerHTML = '';

    projects.forEach(project => {
        const projectHTML = `
            <div class="col-md-6 col-lg-4">
                <div class="project-card shadow-sm h-100 border-0 overflow-hidden">
                    <div class="project-img-wrapper" style="height: 200px; position: relative;">
                        <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">
                        <div class="position-absolute top-0 start-0 m-3">
                            <span class="badge rounded-pill bg-dark text-white fw-light px-3 py-1 small">${project.tag}</span>
                        </div>
                    </div>
                    <div class="project-content p-4">
                        <h3 class="project-title fs-5 fw-bold mb-2">${project.title}</h3>
                        <p class="project-desc text-muted small mb-3">${project.description}</p>
                        <button class="btn btn-dark-outline rounded-pill px-4 btn-sm w-100 detail-btn" onclick="openProjectModal(${project.id})">
                            Voir détail <i class="fas fa-arrow-right ms-2 small"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', projectHTML);
    });
}

// --- Project Modal Logic ---
function openProjectModal(projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;

    document.getElementById('projectModalLabel').innerText = project.title;
    document.getElementById('modalImage').src = project.image;
    document.getElementById('modalObjective').innerText = project.objective;

    // Badges
    const techContainer = document.getElementById('modalTech');
    techContainer.innerHTML = '';
    project.technologies.forEach(tech => {
        techContainer.innerHTML += `<span class="badge rounded-pill bg-dark text-white fw-light px-3 py-2 small">${tech}</span>`;
    });

    // Features
    const featureList = document.getElementById('modalFeatures');
    featureList.innerHTML = '';
    project.features.forEach(feat => {
        featureList.innerHTML += `<li class="mb-2 text-muted small">${feat}</li>`;
    });

    // Links
    const githubBtn = document.getElementById('modalGithub');
    const websiteBtn = document.getElementById('modalWebsite');

    if (project.github && project.github !== "#") {
        githubBtn.href = project.github;
        githubBtn.classList.remove('d-none');
    } else {
        githubBtn.classList.add('d-none');
    }

    if (project.website && project.website !== "#") {
        websiteBtn.href = project.website;
        websiteBtn.classList.remove('d-none');
    } else {
        websiteBtn.classList.add('d-none');
    }

    // Show modal
    const modalElement = document.getElementById('projectModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// --- Navigation Scroll Effect ---
function handleNavbar() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// --- AJAX Contact Form ---
function handleContactForm() {
    const form = document.getElementById('contactForm');
    const messageDiv = document.getElementById('formMessage');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        messageDiv.innerHTML = '<span class="text-info">Envoi en cours...</span>';

        try {
            const response = await fetch('contact.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.text();

            if (response.ok) {
                messageDiv.innerHTML = `<span class="text-success">${result}</span>`;
                form.reset();
            } else {
                messageDiv.innerHTML = '<span class="text-danger">Une erreur est survenue.</span>';
            }
        } catch (error) {
            messageDiv.innerHTML = '<span class="text-danger">Erreur de connexion.</span>';
        }
    });
}
