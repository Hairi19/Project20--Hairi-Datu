/* ============================================================
   GHOSTBYTE // terminal.js
   ============================================================ */

/* ---------- Theme (persisted via localStorage) ---------- */
function applyTheme(theme){
  document.body.classList.toggle('light', theme === 'light');
  const btn = document.getElementById('themeToggle');
  if(btn) btn.textContent = theme === 'light' ? '\u263E' : '\u2600';
  localStorage.setItem('mad-theme', theme);
}

/* ---------- Boot sequence ---------- */
function runBootSequence(){
  const overlay = document.getElementById('bootOverlay');
  if(!overlay) return;
  const seen = sessionStorage.getItem('ghostbyte-booted');
  if(seen){ overlay.remove(); return; }

  const lines = [
    'INITIALIZING GHOSTBYTE TERMINAL...',
    'LOADING KERNEL MODULES [ OK ]',
    'MOUNTING /home/ghostbyte ... [ OK ]',
    'CHECKING CREDENTIALS ... VERIFIED',
    'ESTABLISHING SECURE CHANNEL ... [ OK ]',
    'DECRYPTING JOBSHEET ARCHIVE ... [ OK ]',
    'ACCESS GRANTED_'
  ];
  const container = document.getElementById('bootLines');
  let i = 0;
  function next(){
    if(i >= lines.length){
      setTimeout(() => {
        overlay.classList.add('hide');
        sessionStorage.setItem('ghostbyte-booted', '1');
        setTimeout(() => overlay.remove(), 500);
      }, 350);
      return;
    }
    const div = document.createElement('div');
    const isLast = i === lines.length - 1;
    div.className = isLast ? 'ok' : 'dim';
    div.textContent = (isLast ? '' : '> ') + lines[i];
    container.appendChild(div);
    i++;
    setTimeout(next, isLast ? 250 : 160);
  }
  next();
}

document.addEventListener('DOMContentLoaded', () => {
  runBootSequence();

  const saved = localStorage.getItem('mad-theme') || 'dark';
  applyTheme(saved);

  const themeBtn = document.getElementById('themeToggle');
  if(themeBtn){
    themeBtn.addEventListener('click', () => {
      const current = document.body.classList.contains('light') ? 'light' : 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  const nav = document.getElementById('siteNav');
  const hamburger = document.getElementById('hamburger');
  if(hamburger && nav){
    hamburger.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  /* ---------- Active nav link ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if(href === path || (path === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });

  /* ---------- Live clock + date ---------- */
  const clockEl = document.getElementById('liveClock');
  const dateEl = document.getElementById('liveDate');
  function tick(){
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const ss = String(now.getSeconds()).padStart(2,'0');
    if(clockEl) clockEl.textContent = `${hh}:${mm}:${ss}`;
    if(dateEl){
      const opts = { weekday:'short', year:'numeric', month:'short', day:'2-digit' };
      dateEl.textContent = now.toLocaleDateString('en-GB', opts).toUpperCase();
    }
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if(counters.length){
    const animate = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1200;
      const start = performance.now();
      function step(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if(progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.4 });
    counters.forEach(c => io.observe(c));
  }

  /* ---------- Jobsheet system (hardcoded data) ---------- */
  if(document.getElementById('jobGrid-hairi')){
    initJobsheetSystem();
  }

  /* ---------- 3D accent ---------- */
  init3DAccent();
});

/* ---------- Matrix rain background ---------- */
(function matrixRain(){
  const canvas = document.getElementById('matrix-rain');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, columns, drops;
  const chars = '\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD01ABCDEF{}<>/;$#';

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const fontSize = 15;
    columns = Math.floor(w / fontSize);
    drops = new Array(columns).fill(1);
  }
  resize();
  window.addEventListener('resize', resize);

  function draw(){
    ctx.fillStyle = 'rgba(5,8,6,0.06)';
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle = '#00ff41';
    ctx.font = '15px monospace';
    for(let i=0; i<drops.length; i++){
      const text = chars[Math.floor(Math.random()*chars.length)];
      ctx.fillText(text, i*15, drops[i]*15);
      if(drops[i]*15 > h && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(draw, 55);
})();

/* ============================================================
   Jobsheet system — hardcoded data (no database)
   Reads from JOBSHEET_DATA in jobsheet-data.js
   ============================================================ */

const OWNERS = [
  { key:'hairi', label:"MOHAMAD HAIRI", short:'MH' },
  { key:'datu',  label:"DATU REZWAN'NUR", short:'DR' }
];
const TOTAL_PER_OWNER = 14;

function initJobsheetSystem(){
  // Tabs
  document.querySelectorAll('.owner-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const owner = tab.getAttribute('data-owner');
      document.querySelectorAll('.owner-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.owner-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + owner).classList.add('active');
    });
  });

  renderGrids();
}

function findRecord(ownerKey, jobNumber){
  const list = (typeof JOBSHEET_DATA !== 'undefined' && JOBSHEET_DATA[ownerKey]) ? JOBSHEET_DATA[ownerKey] : [];
  return list.find(r => r.number === jobNumber) || null;
}

function renderJobCard(ownerKey, jobNumber, record){
  const card = document.createElement('div');
  const idStr = 'JOBSHEET_' + String(jobNumber).padStart(2,'0');
  const status = record ? record.status : 'empty';
  card.className = 'job-card status-' + status;

  const statusLabel = status === 'completed' ? 'COMPLETED' : status === 'incomplete' ? 'INCOMPLETE' : 'NOT UPLOADED';
  const pct = status === 'completed' ? '100%' : status === 'incomplete' ? '0%' : '--';
  const title = record ? record.title : 'No submission yet';
  const desc = record ? (record.description || 'No description provided.') : 'Add this jobsheet in jobsheet-data.js.';
  const fileLink = record && record.file
    ? `<button type="button" class="job-file-link" data-file="${record.file}" data-title="${escapeHtml(title)}">&#9656; VIEW PDF</button>`
    : '';

  card.innerHTML = `
    <div class="job-top">
      <span class="job-id">${idStr}</span>
      <span class="job-pct ${status === 'empty' ? 'incomplete' : status}">${pct}</span>
    </div>
    <h3 class="job-title">${escapeHtml(title)}</h3>
    <div class="job-tags"><span class="job-status ${status}">${statusLabel}</span></div>
    <div class="job-toggle">View details</div>
    <div class="job-detail">${escapeHtml(desc)}${fileLink}</div>
  `;
  card.addEventListener('click', (e) => {
    const fileBtn = e.target.closest('.job-file-link');
    if(fileBtn){
      e.stopPropagation();
      openPdfModal(fileBtn.getAttribute('data-file'), fileBtn.getAttribute('data-title'));
      return;
    }
    card.classList.toggle('expanded');
  });
  return card;
}

/* ---------- PDF modal viewer (PDF.js — renders every page, works on iOS Safari) ---------- */
const PDFJS_VERSION = '3.11.174';
let pdfJsLoadPromise = null;

function loadScriptOnce(src){
  return new Promise((resolve, reject) => {
    if(document.querySelector(`script[src="${src}"]`)){ resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });
}

function ensurePdfJs(){
  if(pdfJsLoadPromise) return pdfJsLoadPromise;
  const base = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}`;
  pdfJsLoadPromise = loadScriptOnce(`${base}/pdf.min.js`).then(() => {
    if(window.pdfjsLib){
      pdfjsLib.GlobalWorkerOptions.workerSrc = `${base}/pdf.worker.min.js`;
    }
  });
  return pdfJsLoadPromise;
}

function buildPdfModal(){
  if(document.getElementById('pdfModal')) return;
  const modal = document.createElement('div');
  modal.id = 'pdfModal';
  modal.className = 'pdf-modal';
  modal.innerHTML = `
    <div class="pdf-modal-overlay" data-close="1"></div>
    <div class="pdf-modal-content">
      <div class="pdf-modal-bar">
        <span class="pdf-modal-title" id="pdfModalTitle">JOBSHEET.pdf</span>
        <div class="pdf-modal-actions">
          <a id="pdfModalOpenNew" href="#" target="_blank" rel="noopener" class="pdf-modal-btn">&#8599; OPEN IN NEW TAB</a>
          <button type="button" class="pdf-modal-btn pdf-modal-close" data-close="1">&times; CLOSE</button>
        </div>
      </div>
      <div id="pdfModalPages" class="pdf-modal-pages"></div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if(e.target.closest('[data-close]')) closePdfModal();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && modal.classList.contains('open')) closePdfModal();
  });
}

async function renderPdfPages(file, pagesWrap){
  await ensurePdfJs();
  const pdf = await pdfjsLib.getDocument(file).promise;
  pagesWrap.innerHTML = '';
  const containerWidth = (pagesWrap.clientWidth || 800) - 24;
  const outputScale = window.devicePixelRatio || 1;

  for(let i = 1; i <= pdf.numPages; i++){
    const page = await pdf.getPage(i);
    const unscaled = page.getViewport({ scale: 1 });
    const scale = containerWidth / unscaled.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.className = 'pdf-modal-page';
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = Math.floor(viewport.width) + 'px';
    canvas.style.height = Math.floor(viewport.height) + 'px';
    const ctx = canvas.getContext('2d');
    const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

    pagesWrap.appendChild(canvas);
    await page.render({ canvasContext: ctx, viewport, transform }).promise;
  }
}

async function openPdfModal(file, title){
  buildPdfModal();
  const modal = document.getElementById('pdfModal');
  const titleEl = document.getElementById('pdfModalTitle');
  const openNew = document.getElementById('pdfModalOpenNew');
  const pagesWrap = document.getElementById('pdfModalPages');

  titleEl.textContent = title || 'JOBSHEET.pdf';
  openNew.href = file;
  modal.classList.add('open');
  document.body.classList.add('modal-lock');
  pagesWrap.innerHTML = '<div class="pdf-modal-loading">LOADING PDF…</div>';

  try{
    await renderPdfPages(file, pagesWrap);
  }catch(err){
    console.error('PDF render failed:', err);
    pagesWrap.innerHTML = '<div class="pdf-modal-loading">Could not load preview here — use "OPEN IN NEW TAB" above.</div>';
  }
}

function closePdfModal(){
  const modal = document.getElementById('pdfModal');
  if(!modal) return;
  modal.classList.remove('open');
  document.body.classList.remove('modal-lock');
  const pagesWrap = document.getElementById('pdfModalPages');
  setTimeout(() => { if(pagesWrap) pagesWrap.innerHTML = ''; }, 200);
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderGrids(){
  OWNERS.forEach(owner => {
    const grid = document.getElementById('jobGrid-' + owner.key);
    if(!grid) return;
    grid.innerHTML = '';
    for(let n=1; n<=TOTAL_PER_OWNER; n++){
      grid.appendChild(renderJobCard(owner.key, n, findRecord(owner.key, n)));
    }
  });
  updateProgressUI();
}

function updateProgressUI(){
  OWNERS.forEach(owner => {
    const list = (typeof JOBSHEET_DATA !== 'undefined' && JOBSHEET_DATA[owner.key]) ? JOBSHEET_DATA[owner.key] : [];
    const done = list.filter(r => r.status === 'completed').length;
    const pct = Math.round((done / TOTAL_PER_OWNER) * 100);
    const fill = document.getElementById('progress-' + owner.key);
    const label = document.getElementById('progress-label-' + owner.key);
    const tabPct = document.getElementById('tab-progress-' + owner.key);
    if(fill) fill.style.width = pct + '%';
    if(label) label.textContent = `${done}/${TOTAL_PER_OWNER} COMPLETED — ${pct}%`;
    if(tabPct) tabPct.textContent = `${done}/${TOTAL_PER_OWNER}`;
  });
}

/* ============================================================
   3D wireframe accent (Three.js, procedural — no file downloads)
   ============================================================ */
function init3DAccent(){
  const mount = document.getElementById('accent3d');
  if(!mount || typeof THREE === 'undefined') return;

  const size = mount.clientWidth || 160;
  const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true });
  renderer.setSize(size, size);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 4.2;

  const geometry = new THREE.IcosahedronGeometry(1.5, 0);
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x00ff41, wireframe: true, transparent:true, opacity:0.85 });
  const shape = new THREE.Mesh(geometry, wireMat);
  scene.add(shape);

  const glowGeo = new THREE.IcosahedronGeometry(1.5, 0);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x00ff41, wireframe:true, transparent:true, opacity:0.12 });
  const glowShape = new THREE.Mesh(glowGeo, glowMat);
  glowShape.scale.set(1.15,1.15,1.15);
  scene.add(glowShape);

  function animate(){
    requestAnimationFrame(animate);
    shape.rotation.x += 0.004;
    shape.rotation.y += 0.006;
    glowShape.rotation.x -= 0.002;
    glowShape.rotation.y -= 0.003;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const s = mount.clientWidth || 160;
    renderer.setSize(s, s);
  });

  /* ---------- Periodic glitch pulse ---------- */
  function scheduleGlitch(){
    const delay = 2500 + Math.random() * 4000;
    setTimeout(() => {
      mount.classList.add('glitching');
      setTimeout(() => mount.classList.remove('glitching'), 350);
      scheduleGlitch();
    }, delay);
  }
  scheduleGlitch();
}
