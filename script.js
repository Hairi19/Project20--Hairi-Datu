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

  /* ---------- Jobsheet system (Supabase-backed) ---------- */
  if(document.getElementById('jobGrid-hairi')){
    initJobsheetSystem();
  }
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
   Jobsheet system — Supabase backed
   Table: jobsheets
     id          bigint (PK, identity)
     owner       text   'hairi' | 'datu'
     job_number  int    1-14
     title       text
     description text
     status      text   'completed' | 'incomplete'
     updated_at  timestamptz
   ============================================================ */

const OWNERS = [
  { key:'hairi', label:"MOHAMAD HAIRI", short:'MH' },
  { key:'datu',  label:"DATU REZWAN'NUR", short:'DR' }
];
const TOTAL_PER_OWNER = 14;

let supabaseClient = null;
let jobsheetCache = { hairi:{}, datu:{} };

function getSupabaseClient(){
  if(supabaseClient) return supabaseClient;
  if(typeof window.supabase === 'undefined') return null;
  if(typeof SUPABASE_URL === 'undefined' || SUPABASE_URL.includes('PASTE_YOUR')){
    return null;
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}

function initJobsheetSystem(){
  const client = getSupabaseClient();
  const banner = document.getElementById('dbBanner');

  if(!client){
    if(banner){
      banner.style.display = 'flex';
      banner.textContent = '\u26A0 DATABASE NOT CONNECTED — edit config.js with your Supabase URL + anon key to enable live uploads. Showing local placeholders only.';
    }
  } else if(banner){
    banner.style.display = 'none';
  }

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

  // Populate owner select in form
  const ownerSelect = document.getElementById('jf-owner');
  if(ownerSelect){
    OWNERS.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.key;
      opt.textContent = o.label;
      ownerSelect.appendChild(opt);
    });
  }

  // Populate job number select 1-14
  const numSelect = document.getElementById('jf-number');
  if(numSelect){
    for(let n=1; n<=TOTAL_PER_OWNER; n++){
      const opt = document.createElement('option');
      opt.value = n;
      opt.textContent = 'JOBSHEET_' + String(n).padStart(2,'0');
      numSelect.appendChild(opt);
    }
  }

  buildEmptyGrids();
  loadJobsheets();

  const form = document.getElementById('jobsheetForm');
  if(form){
    form.addEventListener('submit', handleJobsheetSubmit);
  }
}

function buildEmptyGrids(){
  OWNERS.forEach(owner => {
    const grid = document.getElementById('jobGrid-' + owner.key);
    if(!grid) return;
    grid.innerHTML = '';
    for(let n=1; n<=TOTAL_PER_OWNER; n++){
      grid.appendChild(renderJobCard(owner.key, n, null));
    }
  });
}

function renderJobCard(ownerKey, jobNumber, record){
  const card = document.createElement('div');
  const idStr = 'JOBSHEET_' + String(jobNumber).padStart(2,'0');
  const status = record ? record.status : 'empty';
  card.className = 'job-card status-' + status;

  const statusLabel = status === 'completed' ? 'COMPLETED' : status === 'incomplete' ? 'INCOMPLETE' : 'NOT UPLOADED';
  const pct = status === 'completed' ? '100%' : status === 'incomplete' ? '0%' : '--';
  const title = record ? record.title : 'No submission yet';
  const desc = record ? (record.description || 'No description provided.') : 'Use the upload console above to submit this jobsheet.';

  card.innerHTML = `
    <div class="job-top">
      <span class="job-id">${idStr}</span>
      <span class="job-pct ${status === 'empty' ? 'incomplete' : status}">${pct}</span>
    </div>
    <h3 class="job-title">${escapeHtml(title)}</h3>
    <div class="job-tags"><span class="job-status ${status}">${statusLabel}</span></div>
    <div class="job-toggle">View details</div>
    <div class="job-detail">${escapeHtml(desc)}</div>
  `;
  card.addEventListener('click', () => card.classList.toggle('expanded'));
  return card;
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function loadJobsheets(){
  const client = getSupabaseClient();
  if(!client){
    updateProgressUI();
    return;
  }
  const { data, error } = await client.from('jobsheets').select('*');
  if(error){
    console.error('Supabase load error:', error);
    return;
  }
  jobsheetCache = { hairi:{}, datu:{} };
  (data || []).forEach(row => {
    if(jobsheetCache[row.owner]) jobsheetCache[row.owner][row.job_number] = row;
  });
  refreshGrids();
}

function refreshGrids(){
  OWNERS.forEach(owner => {
    const grid = document.getElementById('jobGrid-' + owner.key);
    if(!grid) return;
    grid.innerHTML = '';
    for(let n=1; n<=TOTAL_PER_OWNER; n++){
      grid.appendChild(renderJobCard(owner.key, n, jobsheetCache[owner.key][n] || null));
    }
  });
  updateProgressUI();
}

function updateProgressUI(){
  OWNERS.forEach(owner => {
    const done = Object.values(jobsheetCache[owner.key]).filter(r => r.status === 'completed').length;
    const pct = Math.round((done / TOTAL_PER_OWNER) * 100);
    const fill = document.getElementById('progress-' + owner.key);
    const label = document.getElementById('progress-label-' + owner.key);
    const tabPct = document.getElementById('tab-progress-' + owner.key);
    if(fill) fill.style.width = pct + '%';
    if(label) label.textContent = `${done}/${TOTAL_PER_OWNER} COMPLETED — ${pct}%`;
    if(tabPct) tabPct.textContent = `${done}/${TOTAL_PER_OWNER}`;
  });
}

async function handleJobsheetSubmit(e){
  e.preventDefault();
  const statusEl = document.getElementById('formStatus');
  const client = getSupabaseClient();

  const owner = document.getElementById('jf-owner').value;
  const jobNumber = parseInt(document.getElementById('jf-number').value, 10);
  const title = document.getElementById('jf-title').value.trim();
  const description = document.getElementById('jf-desc').value.trim();
  const status = document.getElementById('jf-status').value;

  if(!owner || !jobNumber || !title){
    statusEl.textContent = '\u2717 ERROR: fill in owner, jobsheet number and title.';
    statusEl.className = 'form-status err';
    return;
  }

  if(!client){
    statusEl.textContent = '\u2717 NOT CONNECTED: add your Supabase URL + anon key to config.js first.';
    statusEl.className = 'form-status err';
    return;
  }

  statusEl.textContent = 'UPLOADING...';
  statusEl.className = 'form-status';

  const { error } = await client.from('jobsheets').upsert(
    { owner, job_number: jobNumber, title, description, status, updated_at: new Date().toISOString() },
    { onConflict: 'owner,job_number' }
  );

  if(error){
    console.error('Supabase upsert error:', error);
    statusEl.textContent = '\u2717 UPLOAD FAILED: ' + error.message;
    statusEl.className = 'form-status err';
    return;
  }

  statusEl.textContent = '\u2713 SAVED TO DATABASE.';
  statusEl.className = 'form-status ok';
  e.target.reset();
  loadJobsheets();
}
