import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ==========================================
// LOADING
// ==========================================
setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
}, 2200);

// ==========================================
// CUSTOM CURSOR
// ==========================================
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
});

function animCursor() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('[data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
});

// ==========================================
// CLOCK
// ==========================================
function updateClock() {
    const now = new Date();
    document.getElementById('top-clock').textContent = 
        now.toISOString().split('T')[1].split('.')[0] + ' UTC';
    requestAnimationFrame(updateClock);
}
setInterval(updateClock, 1000);
updateClock();

// ==========================================
// COMMIT CHART DATA
// ==========================================
const GITHUB_USER = "natty4";

const fallbackData = {
    // 0 = empty, 10 = bright green.
    // Each array represents one vertical column (top to bottom).
    "data": [
        [0,0,0,0,0,0,0], // Space
        [0,0,0,0,0,0,0], // Spacer
        [0,0,0,0,0,0,0], // Spacer
        // H
        [0,10,10,10,10,10,0], [0,0,0,10,0,0,0], [0,10,10,10,10,10,0], 
        [0,0,0,0,0,0,0], // Space
        // E
        [0,10,10,10,10,10,0], [0,10,0,10,0,10,0], [0,10,0,10,0,10,0],
        [0,0,0,0,0,0,0], // Space
        // L
        [0,10,10,10,10,10,0], [0,0,0,0,0,10,0], [0,0,0,0,0,10,0],
        [0,0,0,0,0,0,0], // Space
        // L
        [0,10,10,10,10,10,0], [0,0,0,0,0,10,0], [0,0,0,0,0,10,0],
        [0,0,0,0,0,0,0], // Space
        // O
        [0,0,10,10,10,0,0], [0,10,0,0,0,10,0], [0,0,10,10,10,0,0],
        [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], // Gap between words
        [0,0,0,0,0,0,0], // Space
        [0,0,0,0,0,0,0], // Space
        [0,0,0,0,0,0,0], // Space
        [0,0,0,0,0,0,0], // Space
        // W
        [0,10,10,10,10,10,0], [0,0,0,0,10,0,0], [0,0,0,10,0,0,0], [0,0,0,0,10,0,0], [0,10,10,10,10,10,0],
        [0,0,0,0,0,0,0], // Space
        // O
        [0,0,10,10,10,0,0], [0,10,0,0,0,10,0], [0,0,10,10,10,0,0],
        [0,0,0,0,0,0,0], // Space
        // R
        [0,10,10,10,10,10,0], [0,10,0,10,0,0,0], [0,0,10,0,10,10,0],
        [0,0,0,0,0,0,0], // Space
        // L
        [0,10,10,10,10,10,0], [0,0,0,0,0,10,0], [0,0,0,0,0,10,0],
        [0,0,0,0,0,0,0], // Space
        // D
        [0,10,10,10,10,10,0], [0,10,0,0,0,10,0], [0,0,10,10,10,0,0],
        [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], // Gap
        [0,0,0,0,0,0,0], // Space

        ...Array(6).fill([0,0,0,0,0,0,0]) 
    ],
    "total": 3690
};

async function fetchGitHubActivity() {
    const totalDisplay = document.getElementById('total-commits');
    const streakDisplay = document.getElementById('day-streak');
    const statusNotice = document.getElementById('fetch-status');

    // ALWAYS USE FALLBACK DATA FOR GRID
    const flatFallback = {};
    const today = new Date();

    fallbackData.data.forEach((week, weekIndex) => {
        week.forEach((count, dayIndex) => {
            const d = new Date(today);
            const daysAgo = ((51 - weekIndex) * 7) + (6 - dayIndex);
            d.setDate(today.getDate() - daysAgo);
            flatFallback[d.toISOString().split('T')[0]] = count;
        });
    });

    // Always render fallback chart
    renderChart(flatFallback);
    totalDisplay.innerText = fallbackData.total;

    // Default UI state
    streakDisplay.innerText = "System Stable";

    // Try fetching last activity date only
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/events/public`);
        if (!response.ok) throw new Error();

        const events = await response.json();

        if (events.length > 0) {
            const lastDate = new Date(events[0].created_at)
                .toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            streakDisplay.innerText = lastDate;
        }

        // Hide warning if success
        if (statusNotice) statusNotice.classList.remove('hidden');

    } catch (error) {
        console.warn("GitHub Fetch Failed:", error);

        // Show warning but DO NOT change chart
        if (statusNotice) statusNotice.classList.remove('hidden');
    }
}

function renderChart(dataMap) {
    const chartContainer = document.getElementById('modal-commit-chart');
    if (!chartContainer) return;
    chartContainer.innerHTML = '';
    
    const today = new Date();
    // GitHub charts usually show 53 weeks (371 days) to fill the grid
    const totalDays = 52 * 7; 
    const weeks = [];

    for (let i = totalDays; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        weeks.push(date);
    }

    for (let i = 0; i < weeks.length; i += 7) {
        const column = weeks.slice(i, i + 7);

        column.forEach(date => {
            const dateString = date.toISOString().split('T')[0];
            const count = dataMap[dateString] || 0;

            const link = document.createElement('a');
            link.href = `https://github.com/${GITHUB_USER}?tab=overview&from=${dateString}&to=${dateString}`;
            link.target = "_blank";

            const cell = document.createElement('div');
            cell.className = 'w-[10px] h-[10px] rounded-[2px]';

            let color = 'var(--commit-color)'; 
            if (count > 0) color = '#0e4429';
            if (count > 2) color = '#006d32';
            if (count > 5) color = '#26a641';
            if (count >= 10) color = '#39d353';

            cell.style.backgroundColor = color;
            cell.title = `${dateString}: ${count} contributions`;

            link.appendChild(cell);
            chartContainer.appendChild(link);
        });
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", fetchGitHubActivity);

// Call the function
// renderCommitChart('modal-commit-chart', commitData.data);

// ==========================================
// MODAL
// ==========================================
window.openModal = function() {
    document.getElementById('modal-overlay').classList.add('active');
    document.getElementById('modal-panel').classList.add('active');
    document.body.style.overflow = 'hidden';
};
window.closeModal = function() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.getElementById('modal-panel').classList.remove('active');
    document.body.style.overflow = '';
};

window.copyEmail = function(button) {
    const email = "natty7kt@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
        // Save the original state (icon/text)
        const originalInner = button.innerHTML;

        // Set to Green Checkmark SVG
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
        
        // Revert back after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalInner;
        }, 2000);
    });
}
// document.getElementById('info-trigger').addEventListener('click', openModal);

// Scroll DOWN to open modal
let scrollTriggered = false;
window.addEventListener('wheel', (e) => {
    if (e.deltaY > 50 && window.scrollY < 100 && !scrollTriggered) {
        scrollTriggered = true;
        openModal();
        setTimeout(() => scrollTriggered = false, 2000);
    }
});

// ==========================================
// REVEAL ANIMATIONS
// ==========================================
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ==========================================
// REALISTIC 3D WORKSTATION
// ==========================================
const canvas = document.getElementById('workstation-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030303);
scene.fog = new THREE.FogExp2(0x030303, 0.08);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(2.5, 3.5, 3.5);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 8;
controls.maxPolarAngle = Math.PI / 2.1;
controls.target.set(0, 0.8, -0.2);
controls.enablePan = false;

// Lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
keyLight.position.set(3, 5, 3);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.bias = -0.0001;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x4466aa, 0.5);
fillLight.position.set(-3, 3, -2);
scene.add(fillLight);

const ceilingLight = new THREE.PointLight(0xffffff, 0.6, 8);
ceilingLight.position.set(0, 3.5, 0);
scene.add(ceilingLight);

const rimLight = new THREE.PointLight(0xffaa66, 0.4, 10);
rimLight.position.set(-2, 2, 3);
scene.add(rimLight);

// Screen glow lights
const screenGlow1 = new THREE.PointLight(0x273eff, 0.3, 3);
screenGlow1.position.set(-6.2, 1.3, 0.3);
scene.add(screenGlow1);

const screenGlow2 = new THREE.PointLight(0x4488ff, 0.4, 4);
screenGlow2.position.set(0, 1.3, 0.3);
scene.add(screenGlow2);

const screenGlow3 = new THREE.PointLight(0xff1944, 0.3, 3);
screenGlow3.position.set(1.2, 1.3, 0.3);
scene.add(screenGlow3);

// Materials
const deskMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6, metalness: 0.1 });
const darkMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4, metalness: 0.3 });
const metalMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.2, metalness: 0.8 });
const plasticMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.7, metalness: 0.0 });
const wallMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });

// Helper: create canvas texture for screens
function createScreenTexture(type) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 512;
    const ctx = c.getContext('2d');

    if (type === 'ui') {
        ctx.fillStyle = '#0a0f0a'; ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = '#1a3a1a'; 
        for (let i = 0; i < 20; i++) ctx.fillRect(20, 30 + i * 22, 200 + Math.random() * 150, 14);
        ctx.fillStyle = '#00ff66'; ctx.font = 'bold 20px monospace';
        ctx.fillText('COMPONENTS', 20, 24);
        ctx.fillStyle = '#44ff88'; ctx.font = '14px monospace';
        ctx.fillText('App.tsx', 30, 55); ctx.fillText('Navbar.tsx', 30, 77);
        ctx.fillText('Button.tsx', 30, 99); ctx.fillText('Card.tsx', 30, 121);
    } else if (type === 'agentic') {
        ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, 512, 512);

        const nodes = [
            { x: 256, y: 60, label: 'USER QUERY', color: '#4488ff', r: 40 },
            { x: 120, y: 160, label: 'PLANNER', color: '#44ff88', r: 35 },
            { x: 256, y: 160, label: 'MEMORY', color: '#ffaa44', r: 35 },
            { x: 392, y: 160, label: 'TOOLS', color: '#ff44aa', r: 35 },
            { x: 120, y: 280, label: 'RETRIEVER', color: '#44ff88', r: 35 },
            { x: 256, y: 280, label: 'REASONER', color: '#44ff88', r: 35 },
            { x: 392, y: 280, label: 'ACTION', color: '#ff44aa', r: 35 },
            { x: 256, y: 400, label: 'RESPONSE', color: '#4488ff', r: 40 }
        ];

        ctx.strokeStyle = '#2244aa'; ctx.lineWidth = 2;
        const connections = [
            [0,1], [0,2], [0,3], [1,4], [1,5], [2,5], [3,6], [4,7], [5,7], [6,7]
        ];
        connections.forEach(([a, b]) => {
            ctx.beginPath(); ctx.moveTo(nodes[a].x, nodes[a].y); ctx.lineTo(nodes[b].x, nodes[b].y); ctx.stroke();
        });

        nodes.forEach(node => {
            ctx.fillStyle = node.color; ctx.globalAlpha = 0.3;
            ctx.beginPath(); ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;
            ctx.strokeStyle = node.color; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
            ctx.fillText(node.label, node.x, node.y + 4);
        });

        ctx.fillStyle = '#4488ff'; ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center';
        ctx.fillText('AGENTIC AI WORKFLOW', 256, 30);
    } else {
        ctx.fillStyle = '#0f0a0a'; ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = '#ff8844'; ctx.font = '14px monospace';
        const code = ['def predict(model, X):', '    features = extract(X)', '    probs = model.forward(features)', '    return torch.argmax(probs)', '', 'class NeuralNet(nn.Module):', '    def __init__(self):', '        super().__init__()', '        self.fc1 = nn.Linear(784, 256)'];
        code.forEach((line, i) => { ctx.fillText(line, 20, 30 + i * 22); });
    }
    return new THREE.CanvasTexture(c);
}

const workstation = new THREE.Group();

// === DESK ===
const deskTop = new THREE.Mesh(new THREE.BoxGeometry(4, 0.06, 1.8), deskMat);
deskTop.position.y = 0.75;
deskTop.castShadow = true; deskTop.receiveShadow = true;
workstation.add(deskTop);

// Desk legs
const legGeo = new THREE.BoxGeometry(0.08, 0.75, 0.08);
[[-1.8, 0.375, 0.7], [1.8, 0.375, 0.7], [-1.8, 0.375, -0.7], [1.8, 0.375, -0.7]].forEach(pos => {
    const leg = new THREE.Mesh(legGeo, metalMat);
    leg.position.set(...pos);
    leg.castShadow = true;
    workstation.add(leg);
});

// === MONITOR 1: VERTICAL (UI) - LEFT MONITOR (BLUE) ===
const m1Stand = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.4, 0.15), metalMat);
m1Stand.position.set(-1.3, 0.95, -0.2);
workstation.add(m1Stand);
const m1Base = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.25), metalMat);
m1Base.position.set(-1.3, 0.78, -0.2);
workstation.add(m1Base);

const m1Group = new THREE.Group();
m1Group.position.set(-1.3, 1.45, -0.2);
m1Group.rotation.y = -0.35;

const m1Frame = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.1, 0.7), darkMat);
m1Group.add(m1Frame);

const uiTexture = createScreenTexture('ui');
const blueTintedMat = new THREE.MeshBasicMaterial({ 
    map: uiTexture,
    color: 0x4488ff
});
const m1Screen = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 1.0), blueTintedMat);
m1Screen.position.set(0.03, 0, 0);
m1Screen.rotation.y = Math.PI / 2;
m1Group.add(m1Screen);
workstation.add(m1Group);

// === MONITOR 2: ULTRAWIDE (Agentic AI) ===
const m2Stand = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.45, 0.15), metalMat);
m2Stand.position.set(0, 0.98, -0.25);
workstation.add(m2Stand);
const m2Base = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.3), metalMat);
m2Base.position.set(0, 0.78, -0.25);
workstation.add(m2Base);
const m2Frame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.55, 0.05), darkMat);
m2Frame.position.set(0, 1.35, -0.25);
workstation.add(m2Frame);
const m2Screen = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.45), new THREE.MeshBasicMaterial({ map: createScreenTexture('agentic') }));
m2Screen.position.set(0, 1.35, -0.22);
workstation.add(m2Screen);

// === MONITOR 3: STANDARD (Code) - RIGHT MONITOR (RED) ===
const m3Group = new THREE.Group();
m3Group.position.set(1.3, 1.4, -0.2);
m3Group.rotation.y = 0.35;

const m3Stand = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.4, 0.15), metalMat);
m3Stand.position.set(1.3, 0.95, -0.2);
workstation.add(m3Stand);
const m3Base = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.25), metalMat);
m3Base.position.set(1.3, 0.78, -0.2);
workstation.add(m3Base);

const m3Frame = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.7, 0.55), darkMat);
m3Group.add(m3Frame);

const codeTexture = createScreenTexture('code');
const redTintedMat = new THREE.MeshBasicMaterial({ 
    map: codeTexture,
    color: 0xff4466
});
const m3Screen = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.6), redTintedMat);
m3Screen.position.set(-0.03, 0, 0);
m3Screen.rotation.y = -Math.PI / 2;
m3Group.add(m3Screen);
workstation.add(m3Group);

// === KEYBOARD ===
const kbBase = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.03, 0.25), plasticMat);
kbBase.position.set(0, 0.785, 0.3);
workstation.add(kbBase);
for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 14; c++) {
        const key = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.015, 0.035), 
            new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 }));
        key.position.set(-0.45 + c * 0.048, 0.81, 0.22 + r * 0.04);
        workstation.add(key);
    }
}

// === MOUSE ===
const mouseBody = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.12), plasticMat);
mouseBody.position.set(0.55, 0.79, 0.3);
mouseBody.castShadow = true;
workstation.add(mouseBody);
const mouseScroll = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.015, 0.04), metalMat);
mouseScroll.position.set(0.55, 0.82, 0.28);
workstation.add(mouseScroll);

// === MOUSE PAD ===
const pad = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.005, 0.4), 
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 }));
pad.position.set(0.55, 0.775, 0.35);
workstation.add(pad);

// === LAPTOP ===
const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.35), 
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.5 }));
laptopBase.position.set(-0.6, 0.785, 0.35);
laptopBase.rotation.y = 0.3;
workstation.add(laptopBase);

// === DESK LAMP ===
const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.03, 16), metalMat);
lampBase.position.set(-1.6, 0.785, 0.5);
workstation.add(lampBase);
const lampArm1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.4, 0.03), metalMat);
lampArm1.position.set(-1.6, 0.98, 0.5);
lampArm1.rotation.x = -0.3;
workstation.add(lampArm1);
const lampHead = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 16, 1, true), metalMat);
lampHead.position.set(-1.6, 1.2, 0.45);
lampHead.rotation.x = 0.8;
workstation.add(lampHead);
const lampBulb = new THREE.PointLight(0xffaa55, 0.5, 2);
lampBulb.position.set(-1.6, 1.15, 0.42);
workstation.add(lampBulb);

// === WALL CLOCK ===
const clockGroup = new THREE.Group();
const clockFace = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.03, 32), 
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 }));
clockFace.rotation.x = Math.PI / 2;
clockGroup.add(clockFace);
const clockRim = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.015, 8, 32), metalMat);
clockGroup.add(clockRim);

for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const marker = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.04, 0.005), 
        new THREE.MeshBasicMaterial({ color: 0xffffff }));
    marker.position.set(Math.sin(angle) * 0.2, Math.cos(angle) * 0.2, 0.02);
    marker.rotation.z = -angle;
    clockGroup.add(marker);
}

const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.12, 0.005), 
    new THREE.MeshBasicMaterial({ color: 0xffffff }));
hourHand.position.z = 0.025;
hourHand.geometry.translate(0, 0.04, 0);
clockGroup.add(hourHand);

const minuteHand = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.18, 0.005), 
    new THREE.MeshBasicMaterial({ color: 0xaaaaaa }));
minuteHand.position.z = 0.03;
minuteHand.geometry.translate(0, 0.06, 0);
clockGroup.add(minuteHand);

const secondHand = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.2, 0.005), 
    new THREE.MeshBasicMaterial({ color: 0xff4444 }));
secondHand.position.z = 0.035;
secondHand.geometry.translate(0, 0.05, 0);
clockGroup.add(secondHand);

const centerDot = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), 
    new THREE.MeshBasicMaterial({ color: 0xffffff }));
centerDot.position.z = 0.04;
clockGroup.add(centerDot);

clockGroup.position.set(0, 2.3, -1.4);
workstation.add(clockGroup);

// ==========================================
// 3D WALL SWITCH - Now on the table
// ==========================================
const switchGroup = new THREE.Group();
switchGroup.position.set(1.6, 0.8, 0.6); // On the table, right side
switchGroup.rotation.y = Math.PI;

// Switch base plate on table
const switchBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.02, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3, metalness: 0.5 })
);
switchGroup.add(switchBase);

// Switch plate (vertical like a real desk switch)
const switchPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.1, 0.015),
    new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.3, metalness: 0.1 })
);
switchPlate.position.y = 0.06;
switchGroup.add(switchPlate);

// Switch toggle
const switchToggle = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.03, 0.008),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.2, metalness: 0.2 })
);
switchToggle.position.set(0, 0.04, 0); // OFF position (down)
switchGroup.add(switchToggle);

// Switch screws
const screwGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.008, 8);
const screwMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.5, metalness: 0.8 });

const screw1 = new THREE.Mesh(screwGeo, screwMat);
screw1.position.set(0, 0.095, 0.008);
switchGroup.add(screw1);

const screw2 = new THREE.Mesh(screwGeo, screwMat);
screw2.position.set(0, 0.025, 0.008);
switchGroup.add(screw2);

// Switch label "LIGHTS" on the table base
const switchCanvas = document.createElement('canvas');
switchCanvas.width = 128;
switchCanvas.height = 32;
const switchCtx = switchCanvas.getContext('2d');
switchCtx.fillStyle = '#ffffff';
switchCtx.font = 'bold 16px JetBrains Mono, monospace';
switchCtx.textAlign = 'center';
switchCtx.fillText('LIGHTS', 64, 20);

const switchLabelTexture = new THREE.CanvasTexture(switchCanvas);
switchLabelTexture.minFilter = THREE.LinearFilter;

const switchLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.08, 0.02),
    new THREE.MeshBasicMaterial({ map: switchLabelTexture, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
);
switchLabel.position.set(0, 0.015, 0.04);
switchLabel.rotation.x = -Math.PI / 2;
switchGroup.add(switchLabel);

// Indicator light on the base
const indicatorLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.008, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xff3333 })
);
indicatorLight.position.set(0, 0.015, -0.03);
switchGroup.add(indicatorLight);

workstation.add(switchGroup);

// Make switch interactive via raycaster
const switchRaycaster = new THREE.Raycaster();
const switchMouse = new THREE.Vector2();
let switchHovered = false;

// ==========================================
// 3D LAMBDA SIGN - On the wall opposite clock
// ==========================================
const lambdaGroup = new THREE.Group();
lambdaGroup.position.set(1.8, 2.0, -1.45);

// Lambda symbol as 3D texture
const lambdaCanvas = document.createElement('canvas');
lambdaCanvas.width = 128;
lambdaCanvas.height = 128;
const lambdaCtx = lambdaCanvas.getContext('2d');
lambdaCtx.fillStyle = '#ffffff';
lambdaCtx.font = 'bold 100px Space Grotesk, serif';
lambdaCtx.textAlign = 'center';
lambdaCtx.textBaseline = 'middle';
lambdaCtx.fillText('λ', 64, 64);

const lambdaTexture = new THREE.CanvasTexture(lambdaCanvas);
lambdaTexture.minFilter = THREE.LinearFilter;

const lambdaSymbol = new THREE.Mesh(
    new THREE.PlaneGeometry(0.2, 0.2),
    new THREE.MeshBasicMaterial({ map: lambdaTexture, transparent: true, opacity: 0.06, side: THREE.DoubleSide })
);
lambdaGroup.add(lambdaSymbol);

// Subtle glow behind lambda
const lambdaGlowGeo = new THREE.PlaneGeometry(0.25, 0.25);
const lambdaGlowMat = new THREE.MeshBasicMaterial({ 
    color: 0xffffff, 
    transparent: true, 
    opacity: 0.02,
    side: THREE.DoubleSide 
});
const lambdaGlow = new THREE.Mesh(lambdaGlowGeo, lambdaGlowMat);
lambdaGlow.position.z = -0.001;
lambdaGroup.add(lambdaGlow);

workstation.add(lambdaGroup);


// === WALL ===
const wall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMat);
wall.position.set(0, 2.5, -1.5);
wall.receiveShadow = true;
workstation.add(wall);

// === FLOOR ===
const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), 
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
workstation.add(floor);

// === FLOATING PARTICLES ===
// const particlesGeo = new THREE.BufferGeometry();
// const pCount = 300;
// const pPos = new Float32Array(pCount * 3);
// for (let i = 0; i < pCount * 3; i++) {
//     pPos[i] = (Math.random() - 0.5) * 6;
// }
// particlesGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
// const particlesMat = new THREE.PointsMaterial({ size: 0.015, color: 0xffffff, transparent: true, opacity: 0.2 });
// const particles = new THREE.Points(particlesGeo, particlesMat);
// scene.add(particles);

scene.add(workstation);


// === FLOATING PARTICLES ===
const particlesGeo = new THREE.BufferGeometry();
const pCount = 300;
const pPos = new Float32Array(pCount * 3);
for (let i = 0; i < pCount * 3; i++) {
    pPos[i] = (Math.random() - 0.5) * 6;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
const particlesMat = new THREE.PointsMaterial({ size: 0.015, color: 0xffffff, transparent: true, opacity: 0.2 });
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

// Clock animation
function updateClock3D() {
    const now = new Date();
    const h = now.getHours() % 12, m = now.getMinutes(), s = now.getSeconds(), ms = now.getMilliseconds();
    hourHand.rotation.z = -(h * 30 + m * 0.5) * Math.PI / 180;
    minuteHand.rotation.z = -(m * 6 + s * 0.1) * Math.PI / 180;
    secondHand.rotation.z = -(s * 6 + ms * 0.006) * Math.PI / 180;
}

// Animation loop
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    updateClock3D();
    controls.update();

    workstation.position.y = Math.sin(time * 0.3) * 0.02;

    screenGlow1.intensity = 0.25 + Math.sin(time * 2) * 0.1;
    screenGlow2.intensity = 0.35 + Math.sin(time * 1.5 + 1) * 0.1;
    screenGlow3.intensity = 0.25 + Math.sin(time * 2.5 + 2) * 0.1;

    particles.rotation.y += 0.0003;

    renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// ==========================================
// THEME TOGGLE LOGIC
// ==========================================
const body = document.body;
let isLightTheme = false;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    isLightTheme = true;
    body.classList.add('light-theme');
    switchToggle.position.y = 0.06; // ON position (up)
    indicatorLight.material.color.set(0x33ff33);
    updateSceneForTheme('light');
}

// Handle click on 3D switch
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    switchMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    switchMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    switchRaycaster.setFromCamera(switchMouse, camera);
    const intersects = switchRaycaster.intersectObjects([
        switchPlate, switchToggle, switchBase, 
        screw1, screw2, switchLabel, indicatorLight
    ]);

    if (intersects.length > 0) {
        toggleTheme();
    }
});

function toggleTheme() {
    isLightTheme = !isLightTheme;
    
    if (isLightTheme) {
        body.classList.add('light-theme');
        switchToggle.position.y = 0.06; // UP = ON
        indicatorLight.material.color.set(0x33ff33);
    } else {
        body.classList.remove('light-theme');
        switchToggle.position.y = 0.04; // DOWN = OFF
        indicatorLight.material.color.set(0xff3333);
    }
    
    localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
    updateSceneForTheme(isLightTheme ? 'light' : 'dark');
}

// Add hover effect for switch
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    switchMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    switchMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    switchRaycaster.setFromCamera(switchMouse, camera);
    const intersects = switchRaycaster.intersectObjects([
        switchPlate, switchToggle, switchBase,
        screw1, screw2, switchLabel, indicatorLight
    ]);

    if (intersects.length > 0 && !switchHovered) {
        switchHovered = true;
        document.body.style.cursor = 'pointer';
        switchPlate.material.emissive = new THREE.Color(0x333333);
        switchPlate.material.emissiveIntensity = 0.3;
    } else if (intersects.length === 0 && switchHovered) {
        switchHovered = false;
        document.body.style.cursor = 'none';
        switchPlate.material.emissive = new THREE.Color(0x000000);
        switchPlate.material.emissiveIntensity = 0;
    }
});

function updateSceneForTheme(theme) {
    if (theme === 'light') {
        // Light theme
        scene.background = new THREE.Color(0xf5f5f5);
        scene.fog = new THREE.FogExp2(0xf5f5f5, 0.04);
        ambient.intensity = 0.6;
        keyLight.intensity = 2.0;
        fillLight.intensity = 0.8;
        if (ceilingLight) ceilingLight.intensity = 1.0;
        renderer.toneMappingExposure = 1.8;
        
        deskMat.color.set(0x3a3a3a);
        wallMat.color.set(0xeeeeee);
        floor.material.color.set(0xd0d0d0);
        darkMat.color.set(0x2a2a2a);
        metalMat.color.set(0x666666);
        plasticMat.color.set(0x1a1a1a);
        
        screenGlow1.color.set(0x6688ff);
        screenGlow2.color.set(0x88aaff);
        screenGlow3.color.set(0xff6688);
        
        if (particles) particles.material.color.set(0x333333);
        
        lambdaSymbol.material.opacity = 0.08;
        lambdaGlow.material.opacity = 0.03;
        
    } else {
        // Dark theme with rgba(6, 11, 16, 0.7)
        scene.background = new THREE.Color('#060b10');
        scene.fog = new THREE.FogExp2(0x060b10, 0.08);
        ambient.intensity = 0.35;
        keyLight.intensity = 1.6;
        fillLight.intensity = 0.5;
        if (ceilingLight) ceilingLight.intensity = 0.6;
        renderer.toneMappingExposure = 1.5;
        
        deskMat.color.set(0x1a1a1a);
        wallMat.color.set(0x1a1a1a);
        floor.material.color.set(0x111111);
        darkMat.color.set(0x111111);
        metalMat.color.set(0x333333);
        plasticMat.color.set(0x0a0a0a);
        
        screenGlow1.color.set(0x273eff);
        screenGlow2.color.set(0x4488ff);
        screenGlow3.color.set(0xff1944);
        
        if (particles) particles.material.color.set(0xffffff);
        
        lambdaSymbol.material.opacity = 0.06;
        lambdaGlow.material.opacity = 0.02;
    }
}

// ==========================================
// 3D SKILLS KNOWLEDGE GRAPH (in modal)
// ==========================================
const skillsContainer = document.getElementById('skills-canvas');
const sScene = new THREE.Scene();
const sCamera = new THREE.PerspectiveCamera(60, skillsContainer.clientWidth / skillsContainer.clientHeight, 0.1, 100);
const sRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
sRenderer.setSize(skillsContainer.clientWidth, skillsContainer.clientHeight);
sRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
skillsContainer.appendChild(sRenderer.domElement);

const skillsGraph = {
    core: { name: "Engineer", level: 1.0, cat: "core" },
    nodes: [
        { id: "python", name: "Python", level: 0.95, cat: "ai", connections: ["pytorch", "tensorflow", "fastapi", "pandas", "langchain"] },
        { id: "pytorch", name: "PyTorch", level: 0.9, cat: "ai", connections: ["python", "llms", "mlops"] },
        { id: "tensorflow", name: "TensorFlow", level: 0.85, cat: "ai", connections: ["python", "mlops"] },
        { id: "llms", name: "LLMs", level: 0.88, cat: "ai", connections: ["pytorch", "langchain", "huggingface"] },
        { id: "mlops", name: "MLOps", level: 0.82, cat: "ai", connections: ["pytorch", "tensorflow", "docker", "kubernetes"] },
        { id: "langchain", name: "LangChain", level: 0.87, cat: "ai", connections: ["llms", "python"] },
        { id: "huggingface", name: "HuggingFace", level: 0.85, cat: "ai", connections: ["llms", "pytorch"] },
        { id: "fastapi", name: "FastAPI", level: 0.9, cat: "backend", connections: ["python", "nodejs", "graphql"] },
        { id: "nodejs", name: "Node.js", level: 0.85, cat: "backend", connections: ["fastapi", "react"] },
        { id: "postgresql", name: "PostgreSQL", level: 0.88, cat: "backend", connections: ["fastapi", "redis"] },
        { id: "redis", name: "Redis", level: 0.8, cat: "backend", connections: ["postgresql", "docker"] },
        { id: "go", name: "Go", level: 0.75, cat: "backend", connections: ["fastapi", "docker"] },
        { id: "graphql", name: "GraphQL", level: 0.82, cat: "backend", connections: ["fastapi", "react"] },
        { id: "react", name: "React", level: 0.87, cat: "frontend", connections: ["nodejs", "typescript", "nextjs", "graphql"] },
        { id: "typescript", name: "TypeScript", level: 0.9, cat: "frontend", connections: ["react", "nextjs"] },
        { id: "nextjs", name: "Next.js", level: 0.85, cat: "frontend", connections: ["react", "typescript"] },
        { id: "docker", name: "Docker", level: 0.88, cat: "devops", connections: ["mlops", "redis", "go", "kubernetes"] },
        { id: "kubernetes", name: "Kubernetes", level: 0.8, cat: "devops", connections: ["docker", "mlops"] },
        { id: "aws", name: "AWS", level: 0.85, cat: "devops", connections: ["docker", "kubernetes"] },
        { id: "pandas", name: "Pandas", level: 0.92, cat: "ai", connections: ["python"] },
    ]
};

const sGroup = new THREE.Group();
const sMeshes = [];
const nodeMap = {};

// Create core node
const coreGeo = new THREE.IcosahedronGeometry(0.35, 2);
const coreMat = new THREE.MeshBasicMaterial({ 
    color: 0xffffff, 
    transparent: true, 
    opacity: 0.9,
    wireframe: false 
});
const coreMesh = new THREE.Mesh(coreGeo, coreMat);
coreMesh.userData = { skill: skillsGraph.core, isCore: true };
sGroup.add(coreMesh);

const coreGlow = new THREE.PointLight(0xffffff, 0.5, 3);
coreGlow.position.set(0, 0, 0);
sGroup.add(coreGlow);

// Create skill nodes
const radius = 2.5;
skillsGraph.nodes.forEach((sk, i) => {
    const r = 0.12 + sk.level * 0.15;
    const geo = new THREE.IcosahedronGeometry(r, 1);

    let color = 0xffffff;
    let opacity = 0.6;
    if (sk.cat === 'ai') { color = 0x88ccff; opacity = 0.8; }
    else if (sk.cat === 'backend') { color = 0xffaa88; opacity = 0.6; }
    else if (sk.cat === 'frontend') { color = 0x88ffaa; opacity = 0.5; }
    else if (sk.cat === 'devops') { color = 0xff88cc; opacity = 0.4; }

    const mat = new THREE.MeshBasicMaterial({ 
        color: color, 
        transparent: true, 
        opacity: opacity * 0.6, 
        wireframe: false 
    });
    const mesh = new THREE.Mesh(geo, mat);

    const phi = Math.acos(-1 + (2 * i) / skillsGraph.nodes.length);
    const theta = Math.sqrt(skillsGraph.nodes.length * Math.PI) * phi;

    mesh.position.set(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
    );

    mesh.userData = {
        originalPos: mesh.position.clone(),
        skill: sk,
        phase: Math.random() * Math.PI * 2,
        id: sk.id
    };

    sMeshes.push(mesh);
    nodeMap[sk.id] = mesh;
    sGroup.add(mesh);

    const ringG = new THREE.RingGeometry(r * 1.3, r * 1.4, 24);
    const ringM = new THREE.MeshBasicMaterial({ 
        color: color, 
        transparent: true, 
        opacity: 0.15, 
        side: THREE.DoubleSide 
    });
    const ringMesh = new THREE.Mesh(ringG, ringM);
    ringMesh.position.copy(mesh.position);
    ringMesh.lookAt(0, 0, 0);
    sGroup.add(ringMesh);
});

// Create connections
const connectionMat = new THREE.LineBasicMaterial({ 
    color: 0x1850d6, 
    transparent: true, 
    opacity: 0.18 
});

const connections = [];
skillsGraph.nodes.forEach(node => {
    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(
            nodeMap[node.id].position.x * 0.5,
            nodeMap[node.id].position.y * 0.5,
            nodeMap[node.id].position.z * 0.5
        ),
        nodeMap[node.id].position
    );
    const points = curve.getPoints(20);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeo, connectionMat);
    sGroup.add(line);
    connections.push(line);

    node.connections.forEach(connId => {
        if (nodeMap[connId] && connId > node.id) {
            const start = nodeMap[node.id].position;
            const end = nodeMap[connId].position;
            const mid = new THREE.Vector3(
                (start.x + end.x) * 0.5,
                (start.y + end.y) * 0.5,
                (start.z + end.z) * 0.5
            ).multiplyScalar(0.7);

            const connCurve = new THREE.QuadraticBezierCurve3(start, mid, end);
            const connPoints = connCurve.getPoints(15);
            const connGeo = new THREE.BufferGeometry().setFromPoints(connPoints);
            const connLine = new THREE.Line(connGeo, connectionMat);
            sGroup.add(connLine);
            connections.push(connLine);
        }
    });
});

sScene.add(sGroup);
sCamera.position.z = 6;

// Tooltip setup
const tooltip = document.getElementById('skill-tooltip');
const tooltipName = tooltip.querySelector('.tooltip-name');
const tooltipCat = tooltip.querySelector('.tooltip-cat');
const tooltipFill = tooltip.querySelector('.level-fill');
const tooltipText = tooltip.querySelector('.level-text');

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredNode = null;

skillsContainer.addEventListener('mousemove', (e) => {
    const rect = skillsContainer.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
    tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
});

function animateSkills() {
    requestAnimationFrame(animateSkills);
    const t = Date.now() * 0.001;

    sGroup.rotation.y += 0.002;
    sGroup.rotation.x = Math.sin(t * 0.2) * 0.1;

    sMeshes.forEach((mesh) => {
        const original = mesh.userData.originalPos;
        mesh.position.x = original.x + Math.sin(t + mesh.userData.phase) * 0.08;
        mesh.position.y = original.y + Math.cos(t * 0.8 + mesh.userData.phase) * 0.08;
        mesh.position.z = original.z + Math.sin(t * 0.6 + mesh.userData.phase) * 0.08;

        const baseOpacity = mesh.userData.skill.cat === 'ai' ? 0.5 : 
                           mesh.userData.skill.cat === 'backend' ? 0.4 : 
                           mesh.userData.skill.cat === 'frontend' ? 0.3 : 0.25;
        mesh.material.opacity = baseOpacity + Math.sin(t * 2 + mesh.userData.phase) * 0.1;
    });

    coreMesh.rotation.x += 0.005;
    coreMesh.rotation.y += 0.008;
    coreGlow.intensity = 0.3 + Math.sin(t * 2) * 0.2;

    raycaster.setFromCamera(mouse, sCamera);
    const intersects = raycaster.intersectObjects(sMeshes);

    if (intersects.length > 0) {
        const node = intersects[0].object;
        if (hoveredNode !== node) {
            hoveredNode = node;
            const skill = node.userData.skill;

            tooltipName.textContent = skill.name;
            tooltipCat.textContent = skill.cat.toUpperCase();
            tooltipFill.style.width = (skill.level * 100) + '%';
            tooltipText.textContent = Math.round(skill.level * 100) + '% proficiency';
            tooltip.classList.add('visible');

            node.scale.setScalar(1.5);
            node.material.opacity = 1;
        }
    } else {
        if (hoveredNode) {
            hoveredNode.scale.setScalar(1);
            hoveredNode = null;
            tooltip.classList.remove('visible');
        }
    }

    sRenderer.render(sScene, sCamera);
}
animateSkills();

// Resize skills canvas
new ResizeObserver(() => {
    const w = skillsContainer.clientWidth, h = skillsContainer.clientHeight;
    sCamera.aspect = w / h; sCamera.updateProjectionMatrix(); sRenderer.setSize(w, h);
}).observe(skillsContainer);


console.log(
  "%cλ system::dev_mode_activated",
  "color:#3aa0ff; font-family:monospace; font-size:96px; font-weight:700; text-shadow:0 0 8px rgba(58,160,255,0.6);"
);
console.log(
  "%c hello, fellow debugger",
  "color:#3aa0ff; font-family:monospace; font-size:96px; font-weight:700; text-shadow:0 0 8px rgba(58,160,255,0.6);"
);