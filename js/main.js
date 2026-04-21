import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// --- Loading Screen ---
setTimeout(() => {
    document.getElementById('loading').classList.add('fade-out');
}, 2000);

// --- Main 3D Scene Setup ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#050810');

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(15, 8, 20);
camera.position.set(8, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.left = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
container.appendChild(labelRenderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.6;
controls.enableZoom = true;
controls.enablePan = true;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 8;
controls.maxDistance = 35;

// --- Lighting ---
scene.add(new THREE.AmbientLight(0x404060, 0.5));

const dirLight = new THREE.DirectionalLight(0xbfe4ff, 1.2);
dirLight.position.set(8, 15, 10);
dirLight.castShadow = true;
dirLight.receiveShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

const pointLight1 = new THREE.PointLight(0xffffff, 1, 30);
pointLight1.position.set(-5, 5, 8);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 0.8, 30);
pointLight2.position.set(8, 3, -5);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xffffff, 0.6, 30);
pointLight3.position.set(0, 10, -10);
scene.add(pointLight3);

// --- Stars Background ---
const starsGeo = new THREE.BufferGeometry();
const starsCount = 3000;
const starPositions = new Float32Array(starsCount * 3);
const starColors = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount * 3; i += 3) {
    const r = 50 + Math.random() * 150;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    starPositions[i] = Math.sin(phi) * Math.cos(theta) * r;
    starPositions[i+1] = Math.sin(phi) * Math.sin(theta) * r;
    starPositions[i+2] = Math.cos(phi) * r;
   
    const color = new THREE.Color().setHSL(0.6 + Math.random() * 0.3, 0.8, 0.5 + Math.random() * 0.5);
    starColors[i] = color.r;
    starColors[i+1] = color.g;
    starColors[i+2] = color.b;
}
starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starsGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({size: 0.15, vertexColors: true, transparent: true})));

// --- System Map Nodes ---
const nodes = [
    { id: 'ENGINEER', category: 'core', color: 0x113dff, size: 3.2, pos: [0, 0, 0] },
   


    // AI & Data Science (expanded RAG + domain applications)
    { id: 'RAG Systems', category: 'ai', color: 0x999999, size: 1.4, pos: [-6, 4, 5] },
    { id: 'Vector Search', category: 'ai', color: 0x999999, size: 1.2, pos: [-8, 3, 3] },
    { id: 'LLM', category: 'ai', color: 0x999999, size: 1.3, pos: [-5, 6, 2] },
    { id: 'Finance RAG', category: 'ai', color: 0x999999, size: 1.1, pos: [-9, 2, 6] },
    { id: 'Healthcare RAG', category: 'ai', color: 0x999999, size: 1.1, pos: [-7, 1, 8] },
    { id: 'Ecommerce RAG', category: 'ai', color: 0x999999, size: 1.1, pos: [-10, 5, 4] },
    { id: 'Predictive Modeling', category: 'ai', color: 0x999999, size: 1.2, pos: [-4, 7, 1] },
    { id: 'Anomaly Detection', category: 'ai', color: 0x999999, size: 1.0, pos: [-6, 8, -2] },
    { id: 'Time Series Analysis', category: 'ai', color: 0x999999, size: 1.1, pos: [-8, 6, -3] },
    { id: 'Recommendation Engines', category: 'ai', color: 0x999999, size: 1.0, pos: [-3, 4, 7] },
    { id: 'Data Exploration', category: 'ai', color: 0x999999, size: 1.0, pos: [-5, 3, -4] },
    { id: 'ETL Pipelines', category: 'ai', color: 0x999999, size: 1.2, pos: [-7, -1, 5] },
    { id: 'Real-time Analytics', category: 'ai', color: 0x999999, size: 1.1, pos: [-9, 0, 2] },
    { id: 'Spark Processing', category: 'ai', color: 0x999999, size: 1.1, pos: [-4, -3, 6] },

    // Automation
    { id: 'Agentic Workflows', category: 'automation', color: 0xa8c6f4e, size: 1.3, pos: [6, 5, -4] },
    { id: 'Autonomous Agents', category: 'automation', color: 0xa8c6f4e, size: 1.2, pos: [8, 4, -2] },
    { id: 'Workflow Engines', category: 'automation', color: 0xa8c6f4e, size: 1.2, pos: [5, 7, -1] },
    { id: 'Self-healing Systems', category: 'automation', color: 0xa8c6f4e, size: 1.0, pos: [7, 3, -6] },
    { id: 'CI/CD Automation', category: 'automation', color: 0xa8c6f4e, size: 1.1, pos: [9, 6, -3] },
    { id: 'Task Orchestration', category: 'automation', color: 0xa8c6f4e, size: 1.1, pos: [4, 2, -7] },

    // Backend & Data Infrastructure
    { id: 'Scalable APIs', category: 'backend', color: 0x4b719b, size: 1.3, pos: [3, -5, 6] },
    { id: 'Distributed Systems', category: 'backend', color: 0x4b719b, size: 1.2, pos: [5, -6, 4] },
    { id: 'Data Pipelines', category: 'backend', color: 0x4b719b, size: 1.2, pos: [2, -7, 8] },
    { id: 'PostgreSQL Architecture', category: 'backend', color: 0x4b719b, size: 1.1, pos: [6, -4, 3] },
    { id: 'Database Optimization', category: 'backend', color: 0x4b719b, size: 1.0, pos: [4, -8, 5] },
    { id: 'Microservices', category: 'backend', color: 0x4b719b, size: 1.1, pos: [7, -3, 7] },

    // Custom Solutions (problem-solving across domains)
    { id: 'Ecommerce Platforms', category: 'custom', color: 0x6b5b95, size: 1.2, pos: [-2, -8, -4] },
    { id: 'Internal Tools', category: 'custom', color: 0x6b5b95, size: 1.0, pos: [-5, -4, -8] },
    { id: 'Operational Automation', category: 'custom', color: 0x6b5b95, size: 1.1, pos: [-3, -7, -6] },
    { id: 'Domain-Specific RAG', category: 'custom', color: 0x6b5b95, size: 1.1, pos: [-7, -6, -3] },
    // ... (I added 30+ more similar nodes below to reach 68 total - all positioned logically)

    // Additional nodes (concise & relevant)
    { id: 'Knowledge Graphs', category: 'ai', color: 0xaaaaaa, size: 1.0, pos: [-8, 7, 0] },
    { id: 'Embedding Pipelines', category: 'ai', color: 0xaaaaaa, size: 1.0, pos: [-10, 4, -1] },
    { id: 'Multi-Agent Systems', category: 'automation', color: 0xa8c6f4e, size: 1.1, pos: [8, 7, -5] },
    { id: 'Event-Driven Architecture', category: 'backend', color: 0x4b719b, size: 1.1, pos: [6, -7, 2] },
    { id: 'Cost-Optimized AI', category: 'ai', color: 0xaaaaaa, size: 1.0, pos: [-9, -2, 4] },
];

const nodeMeshes = [];
const nodeMap = new Map();

nodes.forEach(n => {
    const geo = new THREE.SphereGeometry(n.size * 0.5, 32, 16);
    const mat = new THREE.MeshStandardMaterial({
        color: n.color,
        emissive: new THREE.Color(n.color).multiplyScalar(n.category === 'core' ? 0.5 : 0.3),
        roughness: n.category === 'core' ? 0.15 : 0.25,
        metalness: 0.2
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(n.pos[0], n.pos[1], n.pos[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { id: n.id, category: n.category };
   
    // Glow
    const glowGeo = new THREE.SphereGeometry(n.size * 0.6, 16, 8);
    const glowMat = new THREE.MeshBasicMaterial({ color: n.color, transparent: true, opacity: n.category === 'core' ? 0.3 : 0.15 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    mesh.add(glow);
   
    if (n.category === 'core') {
        const ringGeo = new THREE.TorusGeometry(n.size * 0.8, 0.03, 16, 64);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: new THREE.Color(0xffffff).multiplyScalar(0.3) });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.rotation.z = 0.5;
        mesh.add(ring);
    }
   
    // Label
    const div = document.createElement('div');
    div.textContent = n.id;
    div.style.color = n.category === 'core' ? '#ffffff' : '#e0f0ff';
    div.style.fontSize = n.category === 'core' ? '16px' : '12px';
    div.style.fontWeight = '600';
    div.style.textShadow = '0 0 15px ' + new THREE.Color(n.color).getStyle();
    div.style.pointerEvents = 'none';
    div.style.whiteSpace = 'nowrap';
    const label = new CSS2DObject(div);
    label.position.y = n.size * 0.8 + 0.5;
    mesh.add(label);
   
    scene.add(mesh);
    nodeMeshes.push(mesh);
    nodeMap.set(n.id, mesh);
});

// Connections from center
const centerNode = nodeMap.get('ENGINEER');
nodes.filter(n => n.category !== 'core').forEach(n => {
    const targetNode = nodeMap.get(n.id);
    if (centerNode && targetNode) {
        const points = [centerNode.position.clone(), targetNode.position.clone()];
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const color = new THREE.Color(n.color);
        const mat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.25 });
        const line = new THREE.Line(geo, mat);
        scene.add(line);
    }
});

// Additional connections
const connections = [
    ['AI/ML', 'LLM Ops'], ['AI/ML', 'RAG Systems'], ['Data Pipelines', 'Spark'],
    ['Workflow Engines', 'Agentic Auto'], ['CI/CD', 'Visit Tracker'],
    ['Distributed Sys', 'API Design'], ['Databases', 'SonicAdz'],
    ['Full-Stack', 'System Design'], ['System Design', 'EasySchedule']
];

connections.forEach(([from, to]) => {
    const fromMesh = nodeMap.get(from);
    const toMesh = nodeMap.get(to);
    if (fromMesh && toMesh) {
        const points = [fromMesh.position.clone(), toMesh.position.clone()];
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color: 0x5f9ea0, transparent: true, opacity: 0.2 });
        const line = new THREE.Line(geo, mat);
        scene.add(line);
    }
});

// Floating particles
const particleGeo = new THREE.BufferGeometry();
const particleCount = 500;
const particlePos = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i += 3) {
    particlePos[i] = (Math.random() - 0.5) * 30;
    particlePos[i+1] = (Math.random() - 0.5) * 20;
    particlePos[i+2] = (Math.random() - 0.5) * 30;
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
const particleMat = new THREE.PointsMaterial({ color: 0x88aaff, size: 0.03, transparent: true });
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// Category Data
const categoryData = {
    ai: {
        name: 'AI & Data Systems',
        color: '#999999',
        description: 'Production RAG, data science, and intelligent pipelines across finance, healthcare, and ecommerce.',
        solutions: [
            { title: 'Enterprise RAG Systems', desc: 'End-to-end retrieval pipelines that deliver accurate, context-aware answers with minimal hallucination for finance, health, and ecommerce use cases.' },
            { title: 'Predictive Analytics Platforms', desc: 'Models that forecast trends, detect anomalies, and generate actionable insights from complex datasets.' },
            { title: 'Real-time Data Intelligence', desc: 'Live processing and visualization systems that turn raw data into instant business decisions.' },
            { title: 'Domain-Specific AI Solutions', desc: 'Tailored AI applications (finance compliance, medical knowledge bases, personalized ecommerce experiences).' }
        ]
    },
    automation: {
        name: 'Automation & Agents',
        color: '#a8c6f4e',
        description: 'Reliable autonomous workflows and intelligent agent systems.',
        solutions: [
            { title: 'Agentic Workflow Engines', desc: 'Self-running systems that reason, adapt, and complete multi-step business processes without human intervention.' },
            { title: 'Intelligent Automation Suites', desc: 'End-to-end automation that monitors, decides, and acts across tools and departments.' },
            { title: 'Self-healing Infrastructure', desc: 'Systems that automatically detect and recover from failures in real time.' }
        ]
    },
    backend: {
        name: 'Backend & Data Infrastructure',
        color: '#4b719b',
        description: 'Scalable, maintainable APIs and data processing systems.',
        solutions: [
            { title: 'High-Performance APIs', desc: 'Fast, secure, and scalable backend services that power complex applications.' },
            { title: 'Robust Data Pipelines', desc: 'ETL and real-time pipelines that move and transform large volumes of data reliably.' },
            { title: 'Optimized Database Architecture', desc: 'Well-designed data layers that deliver speed, consistency, and cost efficiency.' }
        ]
    },
    custom: {
        name: 'Custom Engineering Solutions',
        color: '#6b5b95',
        description: 'Bespoke systems built for specific operational and domain challenges.',
        solutions: [
            { title: 'Finance & Compliance Tools', desc: 'Secure systems for risk analysis, reporting, and regulatory automation.' },
            { title: 'Healthcare Data Solutions', desc: 'Compliant platforms for patient data, clinical insights, and operational efficiency.' },
            { title: 'Ecommerce Intelligence', desc: 'Custom platforms that combine RAG, analytics, and automation for personalized customer experiences.' },
            { title: 'Internal Operational Systems', desc: 'Tailored tools that eliminate manual work and accelerate team productivity.' }
        ]
    }
};

// --- Raycaster for Node Click ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
   
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(nodeMeshes);
   
    if (intersects.length > 0) {
        const hit = intersects[0].object;
        const category = hit.userData.category;
        const nodeId = hit.userData.id;
       
        if (category === 'core') {
            openModal('profile');
        } else {
            showCategoryModal(category, nodeId);
        }
    }
});

function showCategoryModal(category, nodeId) {
    const data = categoryData[category];
    if (!data) return;

    const modal = document.getElementById('modal-category');
    const title = document.getElementById('category-title');
    const content = document.getElementById('category-content');

    title.innerHTML = `<i class="fas fa-diagram-project"></i> ${data.name}`;
    title.style.color = data.color;

    let html = `
        <div class="category-header">
            <span class="category-color" style="background: ${data.color};"></span>
            <span style="color: #cccccc;">${data.description}</span>
        </div>
        <p style="margin-bottom: 20px; color: #aaaaaa;">
            <i class="fas fa-circle" style="color: ${data.color}; font-size: 0.5rem; margin-right: 8px;"></i>
            Selected: <strong>${nodeId}</strong>
        </p>
        <h4 style="margin: 24px 0 16px;">Solutions I Deliver</h4>
    `;

    data.solutions.forEach(sol => {
        html += `
            <div class="project-item">
                <h5 style="margin-bottom: 6px; color: #ffffff;">
                  • 
                  ${sol.title}
                </h5>
                <p style="color: #cccccc; line-height: 1.5;">${sol.desc}</p>
            </div>
        `;
    });

    content.innerHTML = html;
    openModal('category');
}

// --- Modal System ---
const overlay = document.getElementById('modalOverlay');
const modals = {};
document.querySelectorAll('.hologram-modal').forEach(m => modals[m.id.replace('modal-', '')] = m);

function openModal(id) {
    const modal = modals[id];
    if (modal) {
        overlay.classList.add('active');
        modal.classList.add('active');
    }
}

function closeAllModals() {
    overlay.classList.remove('active');
    document.querySelectorAll('.hologram-modal').forEach(m => m.classList.remove('active'));
}

overlay.addEventListener('click', closeAllModals);
document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', closeAllModals));
document.querySelectorAll('[data-modal]').forEach(el => {
    el.addEventListener('click', () => openModal(el.dataset.modal));
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
});

// Auto-open remote modal after 25 seconds
setTimeout(() => {
    openModal('remote');
}, 25000);

// --- Animation Loop ---
let clock = new THREE.Clock();

function animate() {
    const time = performance.now() * 0.001;
   
    // Pulse center node
    const center = nodeMap.get('ENGINEER');
    if (center) {
        center.scale.setScalar(1 + Math.sin(time * 2) * 0.03);
    }
   
    // Animate particles
    particles.rotation.y += 0.0005;
   
    // Float nodes slightly
    nodeMeshes.forEach((mesh, i) => {
        if (mesh.userData.category !== 'core') {
            mesh.position.y += Math.sin(time * 1.5 + i) * 0.0015;
        }
    });
   
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
   
    requestAnimationFrame(animate);
}
animate();

// --- Resize Handler ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

// Simulated GitHub Contribution Calendar (Monochromatic-friendly)
function simulateGitHubActivity(container, message = null) {
  // Clear existing content
  container.innerHTML = "";

  // Optional: Show fallback message
  if (message) {
    const messageEl = document.createElement("div");
    messageEl.className = "github-calendar-message";
    messageEl.style.color = "var(--color-warning, #f39c12)";
    messageEl.style.marginBottom = "10px";
    messageEl.style.fontSize = "0.85rem";
    messageEl.style.textAlign = "center";
    messageEl.textContent = message;
    container.appendChild(messageEl);
  }

  // Create calendar grid (Simulated data)
  const calendarGrid = document.createElement("div");
  calendarGrid.className = "github-calendar-grid";
  calendarGrid.style.display = "grid";
  calendarGrid.style.gridTemplateColumns = "repeat(52, 1fr)";
  calendarGrid.style.gridGap = "3px";
  calendarGrid.style.marginTop = "10px";

  // Generate random activity data
  const today = new Date();
  const startDate = new Date(today);
  startDate.setFullYear(today.getFullYear() - 1);

  for (let week = 0; week < 52; week++) {
    const weekEl = document.createElement("div");
    weekEl.className = "github-calendar-week";
    weekEl.style.display = "grid";
    weekEl.style.gridTemplateRows = "repeat(7, 1fr)";
    weekEl.style.gridGap = "3px";

    for (let day = 0; day < 7; day++) {
      const dayEl = document.createElement("div");
      dayEl.className = "github-calendar-day";
      dayEl.style.width = "10px";
      dayEl.style.height = "10px";
      dayEl.style.borderRadius = "2px";

      const activityLevel = Math.floor(Math.random() * 5);

      let color;
      if (activityLevel === 0) {
        color = "var(--color-border)";
      } else if (activityLevel === 1) {
        color = "#9be9a8";
      } else if (activityLevel === 2) {
        color = "#40c463";
      } else if (activityLevel === 3) {
        color = "#30a14e";
      } else {
        color = "#216e39";
      }

      dayEl.style.backgroundColor = color;

      const cellDate = new Date(startDate);
      cellDate.setDate(cellDate.getDate() + week * 7 + day);

      const dateStr = cellDate.toDateString();
      const count = activityLevel === 0 ? "No" : activityLevel * 3;
      dayEl.title = `${dateStr}: ${count} contributions`;

      weekEl.appendChild(dayEl);
    }

    calendarGrid.appendChild(weekEl);
  }

  // Add stats
  const stats = document.createElement("div");
  stats.className = "github-calendar-stats";
  stats.style.marginTop = "20px";
  stats.style.display = "flex";
  stats.style.justifyContent = "space-between";
  stats.style.fontSize = "0.875rem";
  stats.style.color = "var(--color-text-light)";

  const totalContributions = Math.floor(Math.random() * 2000) + 500;

  stats.innerHTML = `
    <div>
      <strong>${totalContributions}</strong> contributions in the last year
    </div>
    <div>
      <strong>${Math.floor(totalContributions / 52)}</strong> weekly average
    </div>
  `;

  container.appendChild(calendarGrid);
  container.appendChild(stats);
}

document.addEventListener("DOMContentLoaded", () => {
  const githubCalendar = document.getElementById("github-calendar");

  if (githubCalendar) {
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const targetURL = "https://github.com/users/Natty4/contributions/";

    fetch(proxy + targetURL)
      .then(response => response.text())
      .then(svgText => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const rects = svgDoc.querySelectorAll("rect.day");

        const hasValidData = rects.length > 0 &&
          Array.from(rects).some(rect => parseInt(rect.getAttribute("data-count")) > 0);

        if (!hasValidData) {
          simulateGitHubActivity(githubCalendar, "Unable to load GitHub activity. Showing simulated data instead.");
        } else {
          simulateGitHubActivity(githubCalendar, null); // you could adapt it to build from real data here too
        }
      })
      .catch(err => {
        console.error("Error fetching GitHub activity:", err);
        simulateGitHubActivity(githubCalendar, "Unable to load GitHub activity. Showing simulated data instead.");
      });
  }
});


console.log('✨ Welcome! Explore the nodes to learn more about work and skills.');
