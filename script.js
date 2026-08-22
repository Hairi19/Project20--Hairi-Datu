// ============================================================
// GHOSTBYTE — Main Script
// Shared functionality across all pages
// ============================================================

(function() {
  'use strict';

  // ============================================
  // AUDIO SYSTEM
  // ============================================
  let audioCtx = null;
  let audioEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch(e) {
        audioEnabled = false;
      }
    }
  }

  function playBeep(freq = 800, duration = 0.05, type = 'square', volume = 0.05) {
    if (!audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = freq;
      osc.type = type;
      gain.gain.setValueAtTime(volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch(e) {}
  }

  function playKeyClick() {
    playBeep(1000 + Math.random() * 600, 0.012, 'square', 0.03);
  }

  function playError() {
    playBeep(180, 0.15, 'sawtooth', 0.06);
  }

  function playSuccess() {
    playBeep(880, 0.08, 'sine', 0.05);
    setTimeout(() => playBeep(1320, 0.1, 'sine', 0.05), 80);
  }

  function playGlitch() {
    playBeep(200 + Math.random() * 2000, 0.05, 'sawtooth', 0.04);
  }

  // ============================================
  // MATRIX RAIN BACKGROUND
  // ============================================
  function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>/\\|_+-=*&^%$#@!';
    const fontSize = 14;
    let columns, drops;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
      }
    }

    function draw() {
      ctx.fillStyle = 'rgba(5, 8, 6, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00ff41';
      ctx.fillStyle = accent;
      ctx.font = fontSize + 'px "Share Tech Mono", monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
  }

  // ============================================
  // CRT EFFECTS
  // ============================================
  function initCRTEffects() {
    // Random screen glitch
    setInterval(() => {
      if (Math.random() < 0.12) {
        triggerGlitch();
      }
    }, 4000);
  }

  function triggerGlitch() {
    const overlay = document.getElementById('glitch-overlay');
    if (!overlay) return;
    
    overlay.classList.add('active');
    playGlitch();
    
    setTimeout(() => {
      overlay.classList.remove('active');
    }, 200);
  }

  // ============================================
  // CUSTOM CURSOR
  // ============================================
  function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('button, a, .jobsheet-card, input, textarea, select, .quick-cmd, .tech-card, .stat-card, .team-card, .op-tab')) {
        ring.classList.add('hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('button, a, .jobsheet-card, input, textarea, select, .quick-cmd, .tech-card, .stat-card, .team-card, .op-tab')) {
        ring.classList.remove('hover');
      }
    });

    document.addEventListener('mousedown', () => ring.classList.add('click'));
    document.addEventListener('mouseup', () => ring.classList.remove('click'));
  }

  // ============================================
  // SYSTEM STATUS BAR
  // ============================================
  const bootTime = Date.now() - Math.floor(Math.random() * 86400000 * 3);

  function getUptime() {
    const diff = Math.floor((Date.now() - bootTime) / 1000);
    const d = Math.floor(diff / 86400);
    const h = Math.floor((diff % 86400) / 3600);
    const m = Math.floor((diff % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  }

  function updateSysbar() {
    const now = new Date();
    const timeEl = document.getElementById('live-clock');
    const uptimeEl = document.getElementById('uptime-stat');
    const memEl = document.getElementById('memory-stat');
    
    if (timeEl) {
      timeEl.textContent = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' });
    }
    if (uptimeEl) {
      uptimeEl.textContent = 'UPTIME: ' + getUptime();
    }
    if (memEl) {
      memEl.textContent = 'MEM: ' + (2.5 + Math.sin(Date.now() / 5000) * 0.8 + Math.random() * 0.2).toFixed(1) + 'GB/8GB';
    }
  }

  // ============================================
  // BOOT SEQUENCE
  // ============================================
  function runBootSequence(callback) {
    const overlay = document.getElementById('boot-overlay');
    const content = document.getElementById('boot-content');
    if (!overlay || !content) {
      if (callback) callback();
      return;
    }

    // Check if already booted in this session
    if (window.location.search.includes('reboot') || window.location.hash.includes('reboot')) { sessionStorage.removeItem('ghostbyte_booted'); }
    if (sessionStorage.getItem('ghostbyte_booted')) {
      overlay.classList.add('hidden');
      setTimeout(() => {
        overlay.style.display = 'none';
        if (callback) callback();
      }, 300);
      return;
    }

    const bootLines = [
      { text: '[    0.000000] GHOSTBYTE OS v5.0.0 booting...', delay: 100 },
      { text: '[    0.024156] CPU: Mobile Application Development Core', delay: 80 },
      { text: '[    0.048231] MEM: 8192MB PHANTOM-RAM @ 3200MHz', delay: 80 },
      { text: '[    0.072104] NET: Establishing secure tunnel...', delay: 120 },
      { text: '[    0.120451] NET: Secure channel established [TLS 1.3]', delay: 60, ok: true },
      { text: '[    0.156782] KERNEL: Loading ghostbyte.ko module', delay: 80 },
      { text: '[    0.201345] KERNEL: Module loaded successfully', delay: 60, ok: true },
      { text: '[    0.245678] FS: Mounting /dev/ghost/root on /', delay: 100 },
      { text: '[    0.301234] FS: Verifying jobsheet archive integrity', delay: 150 },
      { text: '[    0.423456] FS: Archive verified — 28 entries found', delay: 60, ok: true },
      { text: '[    0.489012] AUTH: Checking operative credentials', delay: 120 },
      { text: '[    0.580123] AUTH: HAIRI — VERIFIED', delay: 50, ok: true },
      { text: '[    0.612345] AUTH: DATU — VERIFIED', delay: 50, ok: true },
      { text: '[    0.678901] SYS: Initializing Matrix rain protocol', delay: 80 },
      { text: '[    0.734567] SYS: CRT shader engine online', delay: 60, ok: true },
      { text: '[    0.801234] SYS: GHOST_PROTOCOL_v3 — ACTIVE', delay: 80 },
      { text: '', delay: 200 },
      { text: '╔══════════════════════════════════════════════════════════╗', delay: 30, info: true },
      { text: '║      ██████╗ ██╗  ██╗ ██████╗ ███████╗████████╗██████╗  ║', delay: 30, info: true },
      { text: '║      ██╔══██╗██║  ██║██╔═══██╗██╔════╝╚══██╔══╝╚════██╗ ║', delay: 30, info: true },
      { text: '║      ██████╔╝███████║██║   ██║███████╗   ██║    █████╔╝ ║', delay: 30, info: true },
      { text: '║      ██╔══██╗██╔══██║██║   ██║╚════██║   ██║   ██╔═══╝  ║', delay: 30, info: true },
      { text: '║      ██║  ██║██║  ██║╚██████╔╝███████║   ██║   ███████╗ ║', delay: 30, info: true },
      { text: '║      ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝ ║', delay: 30, info: true },
      { text: '╚══════════════════════════════════════════════════════════╝', delay: 30, info: true },
      { text: '', delay: 100 },
      { text: 'Welcome, Operative. System ready.', delay: 100, info: true },
      { text: 'Type "help" to see available commands.', delay: 50, dim: true }
    ];

    let idx = 0;

    function nextLine() {
      if (idx >= bootLines.length) {
        sessionStorage.setItem('ghostbyte_booted', 'true');
        setTimeout(() => {
          overlay.classList.add('hidden');
          setTimeout(() => {
            overlay.style.display = 'none';
            if (callback) callback();
          }, 500);
        }, 400);
        return;
      }

      const line = bootLines[idx];
      const div = document.createElement('div');
      
      if (line.text === '') {
        div.innerHTML = '&nbsp;';
      } else if (line.ok) {
        div.innerHTML = line.text + ' <span style="color: var(--accent-soft);">[ OK ]</span>';
      } else if (line.info) {
        div.style.color = 'var(--info)';
        div.textContent = line.text;
      } else if (line.dim) {
        div.style.color = 'var(--accent-dim)';
        div.textContent = line.text;
      } else {
        div.textContent = line.text;
      }
      
      content.appendChild(div);
      content.scrollTop = content.scrollHeight;
      playKeyClick();
      idx++;
      setTimeout(nextLine, line.delay);
    }

    nextLine();
  }

  // ============================================
  // THEME & LIGHT MODE TOGGLE
  // ============================================
  function initThemeToggles() {
    const themeBtn = document.getElementById('theme-toggle');
    const lightBtn = document.getElementById('light-toggle');
    const audioBtn = document.getElementById('audio-toggle');

    // Load saved preferences
    const savedTheme = localStorage.getItem('ghostbyte_theme');
    const savedLight = localStorage.getItem('ghostbyte_lightmode');
    
    if (savedTheme === 'amber') document.body.classList.add('theme-amber');
    if (savedTheme === 'cyan') document.body.classList.add('theme-cyan');
    if (savedLight === 'true') document.body.classList.add('light-mode');

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        initAudio();
        const themes = ['', 'theme-amber', 'theme-cyan'];
        const labels = ['G', 'A', 'C'];
        let current = 0;
        if (document.body.classList.contains('theme-amber')) current = 1;
        if (document.body.classList.contains('theme-cyan')) current = 2;
        
        document.body.classList.remove('theme-amber', 'theme-cyan');
        current = (current + 1) % themes.length;
        if (themes[current]) document.body.classList.add(themes[current]);
        themeBtn.textContent = labels[current];
        localStorage.setItem('ghostbyte_theme', current === 0 ? '' : (current === 1 ? 'amber' : 'cyan'));
        playSuccess();
        triggerGlitch();
      });
    }

    if (lightBtn) {
      lightBtn.addEventListener('click', () => {
        initAudio();
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        lightBtn.textContent = isLight ? '☾' : '☀';
        localStorage.setItem('ghostbyte_lightmode', isLight);
        playSuccess();
      });
    }

    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        audioBtn.textContent = audioEnabled ? '♪' : '✕';
        audioBtn.style.color = audioEnabled ? '' : 'var(--error)';
        audioBtn.style.borderColor = audioEnabled ? '' : 'var(--error)';
        if (audioEnabled) {
          initAudio();
          playSuccess();
        }
      });
    }
  }

  // ============================================
  // NAVIGATION (active page highlighting)
  // ============================================
  function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        playKeyClick();
      });
    }
  }

  // ============================================
  // KONAMI CODE EASTER EGG
  // ============================================
  function initKonami() {
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let idx = 0;

    document.addEventListener('keydown', (e) => {
      if (e.key === konami[idx]) {
        idx++;
        if (idx === konami.length) {
          document.body.classList.toggle('rainbow-mode');
          playSuccess();
          setTimeout(() => playBeep(600, 0.1), 100);
          setTimeout(() => playBeep(800, 0.1), 200);
          setTimeout(() => playBeep(1000, 0.15), 300);
          idx = 0;
        }
      } else {
        idx = e.key === konami[0] ? 1 : 0;
      }
    });
  }

  // ============================================
  // THREE.JS 3D PARTICLE SKULL
  // ============================================
  function init3DModel(containerId, size = 'normal') {
    const container = document.getElementById(containerId);
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = size === 'large' ? 350 : 220;
    
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create skull-like particle formation
    const particleCount = size === 'large' ? 2500 : 1500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      
      let r = 1.0;
      const yFactor = phi < Math.PI / 2 ? 0.85 : 1.2;
      
      let nx = Math.cos(theta) * Math.sin(phi);
      let ny = Math.sin(theta) * Math.sin(phi);
      let nz = Math.cos(phi);
      
      // Eye sockets
      let indent = 1.0;
      if (Math.abs(nx) > 0.3 && nz > 0.2 && nz < 0.6 && ny > -0.1 && ny < 0.3) {
        indent = 0.65 + Math.random() * 0.1;
      }
      // Nasal cavity
      if (Math.abs(nx) < 0.15 && nz > 0.4 && ny < -0.1 && ny > -0.4) {
        indent = 0.55 + Math.random() * 0.1;
      }
      // Jaw/teeth
      let teethBump = 1.0;
      if (ny < -0.5 && ny > -0.8 && Math.abs(nx) < 0.4 && nz > 0.3) {
        teethBump = 1.12 + Math.sin(nx * 25) * 0.06;
      }
      // Top flattening
      let topFlat = 1.0;
      if (ny > 0.6) {
        topFlat = 0.88;
      }

      positions[i * 3] = r * nx * indent * teethBump * topFlat * (1 + (Math.random() - 0.5) * 0.06);
      positions[i * 3 + 1] = r * ny * yFactor * indent * topFlat * (1 + (Math.random() - 0.5) * 0.06);
      positions[i * 3 + 2] = r * nz * indent * (1 + (Math.random() - 0.5) * 0.06);
      
      originalPositions[i * 3] = positions[i * 3];
      originalPositions[i * 3 + 1] = positions[i * 3 + 1];
      originalPositions[i * 3 + 2] = positions[i * 3 + 2];
      
      const brightness = 0.4 + Math.random() * 0.6;
      colors[i * 3] = 0;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness * 0.25;
      
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: size === 'large' ? 0.028 : 0.022,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    
    // Correct orientation
    particles.rotation.x = Math.PI / 2;
    
    scene.add(particles);
    camera.position.z = size === 'large' ? 3.2 : 2.8;

    let mouseX = 0, mouseY = 0;
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.008;
      
      particles.rotation.y += 0.002 + mouseX * 0.005;
      particles.rotation.x = Math.PI / 2 + mouseY * 0.15;
      
      // Floating animation
      const posAttr = geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
        const phase = phases[i];
        posAttr.array[ix] = originalPositions[ix] + Math.sin(time * 2 + phase) * 0.006;
        posAttr.array[iy] = originalPositions[iy] + Math.cos(time * 1.5 + phase * 1.3) * 0.005;
        posAttr.array[iz] = originalPositions[iz] + Math.sin(time * 1.8 + phase * 0.7) * 0.004;
      }
      posAttr.needsUpdate = true;
      
      // Occasional glitch flash
      if (Math.random() < 0.004) {
        material.opacity = 0.4;
        setTimeout(() => { material.opacity = 0.9; }, 80);
      }
      
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      const w = container.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    });
  }

  // ============================================
  // STAT COUNTER ANIMATION
  // ============================================
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    counters.forEach(el => {
      const target = parseInt(el.dataset.target);
      let current = 0;
      const duration = 1500;
      let startTime = null;
      
      function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    });
  }

  // ============================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ============================================
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('stats-grid')) {
            animateCounters();
          }
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stats-grid, .tech-grid, .progress-section, .team-grid, .cta-panel').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // ============================================
  // MODAL SYSTEM
  // ============================================
  function openModal(contentHtml, title = 'GHOSTBYTE') {
    let overlay = document.getElementById('modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'modal-overlay';
      overlay.className = 'modal-overlay';
      overlay.innerHTML = `
        <div class="modal">
          <div class="modal-header">
            <span class="modal-title">${title}</span>
            <button class="modal-close" onclick="closeModal()">&times;</button>
          </div>
          <div class="modal-body" id="modal-body"></div>
        </div>
      `;
      document.body.appendChild(overlay);
      
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
      });
    }
    
    document.getElementById('modal-body').innerHTML = contentHtml;
    overlay.querySelector('.modal-title').textContent = title;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    playKeyClick();
  }

  function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Expose globally
  // Expose globally for page-specific scripts
  window.closeModal = closeModal;
  window.openModal = openModal;
  window.triggerGlitch = triggerGlitch;
  window.getUptime = getUptime;
  window.playKeyClick = playKeyClick;
  window.playSuccess = playSuccess;
  window.playError = playError;
  window.playGlitch = playGlitch;
  window.playBeep = playBeep;
  window.initAudio = initAudio;
  window.init3DModel = init3DModel;
  window.animateCounters = animateCounters;

  // ============================================
  // INITIALIZATION
  // ============================================
  document.addEventListener('click', initAudio, { once: true });

  // Initialize on DOM ready
  function init() {
    initMatrixRain();
    initCRTEffects();
    initCursor();
    initThemeToggles();
    initNavigation();
    initKonami();
    initScrollAnimations();
    
    updateSysbar();
    setInterval(updateSysbar, 1000);
    
    // Run boot sequence, then initialize page-specific content
    runBootSequence(() => {
      // Try multiple times to catch late-defined initPageContent
      let attempts = 0;
      const tryInit = () => {
        if (typeof window.initPageContent === 'function') {
          window.initPageContent();
        } else if (typeof initPageContent === 'function') {
          initPageContent();
        } else if (attempts < 10) {
          attempts++;
          setTimeout(tryInit, 100);
        } else {
          console.log('[GHOSTBYTE] No page-specific init found, running base init only');
        }
      };
      tryInit();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
