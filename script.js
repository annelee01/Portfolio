function buildNavbar() {
  const navbar = document.getElementById('site-navbar');
  if (!navbar) return;

  navbar.innerHTML = `
    <div class="inner-nav">
      <nav class="nav-links">
        <a href="#case-studies">Case Studies</a>
        <a href="#technology">Tech</a>
        <a href="#values">Values</a>
        <a href="#collaborators">Collaborators</a>
      </nav>
      <a href="mailto:anne@anneleedesigns.com" class="btn-contact">Contact</a>
      <button class="nav-hamburger" aria-label="Open menu" aria-expanded="false">
        <div class="nav-hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </div>
  `;

  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = navbar.querySelectorAll('.nav-links a');
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentFile) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  // Mobile overlay — appended to body so it sits outside the header stacking context
  let overlay = document.getElementById('nav-mobile-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'nav-mobile-overlay';
    overlay.className = 'nav-mobile-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <nav class="nav-mobile-links">
        <a href="#case-studies">Case Studies</a>
        <a href="#technology">Tech</a>
        <a href="#values">Values</a>
        <a href="#collaborators">Collaborators</a>
      </nav>
    `;
    document.body.appendChild(overlay);
  }

  const hamburger = navbar.querySelector('.nav-hamburger');

  function closeMenu() {
    hamburger.classList.remove('is-open');
    overlay.classList.remove('is-open');
    hamburger.setAttribute('aria-label', 'Open menu');
    hamburger.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('is-open');
    overlay.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    overlay.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  overlay.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

function initTechGridAnimation() {
  const canvas = document.getElementById('tech-grid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLS = 26, ROWS = 26;
  const BG = '#dad2be';
  const COLORS = [
    '#fcfc6d','#91784f','#ffa960','#f15858','#d36f8b',
    '#f98ca9','#8b5586','#9c92b6','#5c57a4',
  ];
  const cx = (COLS - 1) / 2, cy = (ROWS - 1) / 2;

  function hexToRgb(h) {
    return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  }

  const cells = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    cells.push({ r, c, color, rgb: hexToRgb(color), delay: Math.random(), speed: 0.08 + Math.random() * 0.12, alpha: 0, target: 0 });
  }

  function makeStar() {
    const g = Array.from({length:ROWS}, () => Array(COLS).fill(0));
    const pts = [], spikes = 5, outerR = 11.5, innerR = 4.8, a = Math.PI / spikes;
    for (let i = 0; i < spikes * 2; i++) {
      const ang = i * a - Math.PI / 2, r2 = i % 2 === 0 ? outerR : innerR;
      pts.push([cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2]);
    }
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      let inside = false, j = pts.length - 1;
      for (let i = 0; i < pts.length; i++) {
        const [xi,yi] = pts[i], [xj,yj] = pts[j];
        if ((yi > r) !== (yj > r) && c < (xj - xi) * (r - yi) / (yj - yi) + xi) inside = !inside;
        j = i;
      }
      if (inside) g[r][c] = 1;
    }
    return g;
  }

  function makeCircle() {
    const g = Array.from({length:ROWS}, () => Array(COLS).fill(0));
    const R = 11.8, S = 4;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      let hits = 0;
      for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) {
        const sc = c + (sx + 0.5) / S - 0.5, sr = r + (sy + 0.5) / S - 0.5;
        if ((sc - cx) ** 2 + (sr - cy) ** 2 <= R * R) hits++;
      }
      if (hits >= S * S * 0.4) g[r][c] = 1;
    }
    return g;
  }

  function makeSquare() {
    const g = Array.from({length:ROWS}, () => Array(COLS).fill(0));
    for (let r = 2; r < 24; r++) for (let c = 2; c < 24; c++) g[r][c] = 1;
    return g;
  }

  function makeDiamond() {
    const g = Array.from({length:ROWS}, () => Array(COLS).fill(0));
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++)
      if (Math.abs(c - cx) + Math.abs(r - cy) <= 11) g[r][c] = 1;
    return g;
  }

  const SHAPES = [makeStar(), makeCircle(), makeSquare(), makeDiamond()];
  const FADE_WINDOW = 50, HOLD_DUR = 30, SETTLE_BUFFER = 0;
  let currentShape = 0, phase = 'fadein', holdTimer = 0, phaseTimer = 0;

  function setTargets(shapeIdx) {
    cells.forEach(cell => { cell.target = shapeIdx >= 0 && SHAPES[shapeIdx][cell.r][cell.c] ? 1 : 0; });
  }
  function rerandomize() {
    cells.forEach(cell => { cell.delay = Math.random(); cell.speed = 0.08 + Math.random() * 0.12; });
  }
  function allSettled() {
    return cells.every(c => Math.abs(c.alpha - c.target) < 0.015);
  }

  setTargets(currentShape);

  let logicalSize = 0;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    logicalSize = Math.min(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight);
    canvas.width = logicalSize * dpr;
    canvas.height = logicalSize * dpr;
    canvas.style.width = logicalSize + 'px';
    canvas.style.height = logicalSize + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw() {
    const w = logicalSize, h = logicalSize;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);

    const cellW = w / COLS, cellH = h / ROWS;

    phaseTimer++;
    if (phase === 'fadein') {
      if (allSettled()) { phase = 'hold'; holdTimer = 0; phaseTimer = 0; }
    } else if (phase === 'hold') {
      holdTimer++;
      if (holdTimer >= HOLD_DUR) { phase = 'fadeout'; phaseTimer = 0; rerandomize(); setTargets(-1); }
    } else if (phase === 'fadeout') {
      if (phaseTimer >= FADE_WINDOW + SETTLE_BUFFER) { currentShape = (currentShape + 1) % SHAPES.length; rerandomize(); setTargets(currentShape); phase = 'fadein'; phaseTimer = 0; }
    }

    cells.forEach(cell => {
      if (phaseTimer < cell.delay * FADE_WINDOW) return;
      const diff = cell.target - cell.alpha;
      if (Math.abs(diff) < 0.002) { cell.alpha = cell.target; return; }
      cell.alpha += diff * cell.speed;
    });

    const sqW = cellW * 0.72, sqH = cellH * 0.72;
    cells.forEach(cell => {
      if (cell.alpha < 0.01) return;
      const x = cell.c * cellW + cellW / 2;
      const y = cell.r * cellH + cellH / 2;
      ctx.globalAlpha = cell.alpha;
      ctx.fillStyle = cell.color;
      ctx.fillRect(x - sqW / 2, y - sqH / 2, sqW, sqH);
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  resize();
  new ResizeObserver(resize).observe(canvas.parentElement);
  draw();
}

function initValuesSystemsIllustration() {
  const canvas = document.querySelector('.illustration-values-systems');
  if (!canvas) return;

  const W = 780, H = 512;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const baseColors = [
    '#CAFFD6', '#FFA961', '#FDFD6D', '#917851',
    '#FA8DAA', '#8B5586', '#6791E3', '#5C57A4', '#1C1C1C',
  ];
  const totalCols = baseColors.length;
  const rows = [1, 2, 4];
  const rowH = 128;
  const gradY = rowH * rows.length;

  function hexToRgb(h) {
    return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  }
  function lerpRgb(a, b, t) {
    return a.map((v,i) => Math.round(v+(b[i]-v)*t));
  }
  function screenBlend(base, op) {
    return base.map(b => { const bb=b/255, s=1-(1-bb)*(1-bb); return Math.round((bb+(s-bb)*op)*255); });
  }
  function multiplyBlend(base, op) {
    return base.map(b => { const bb=b/255, m=bb*bb; return Math.round((bb+(m-bb)*op)*255); });
  }
  function gradientColorAt(x) {
    const t = x/W*(totalCols-1);
    const c1=Math.floor(t), c2=Math.min(c1+1,totalCols-1);
    return lerpRgb(hexToRgb(baseColors[c1]), hexToRgb(baseColors[c2]), t-c1);
  }

  const screenOp = 0.45, multOp = 0.45;

  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, W, H);

  rows.forEach((mult, ri) => {
    const numRects = totalCols * mult;
    const rectW = W / numRects;
    const y = ri * rowH;

    for (let i = 0; i < numRects; i++) {
      const colorIdx = Math.min(Math.floor(i / mult), totalCols - 1);
      const bc = hexToRgb(baseColors[colorIdx]);
      const posInColor = i % mult;
      const t = mult === 1 ? 0.5 : posInColor / (mult - 1);
      const light = screenBlend(bc, screenOp);
      const dark  = multiplyBlend(bc, multOp);

      let rgb;
      if (ri === 0) {
        rgb = bc;
      } else if (ri === 1) {
        rgb = lerpRgb(light, dark, t);
      } else {
        const rectCenterX = (i + 0.5) * rectW;
        const gradRgb = gradientColorAt(rectCenterX);
        const sweepRgb = lerpRgb(light, dark, t);
        rgb = lerpRgb(sweepRgb, gradRgb, 0.78);
      }

      ctx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
      ctx.fillRect(i * rectW, y, rectW + 0.5, rowH);
    }
  });

  for (let x = 0; x < W; x++) {
    const rgb = gradientColorAt(x);
    ctx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    ctx.fillRect(x, gradY, 1, rowH);
  }

  const imageData = ctx.getImageData(0, 0, W, H);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    data[i]   = Math.max(0, Math.min(255, data[i]   + n));
    data[i+1] = Math.max(0, Math.min(255, data[i+1] + n));
    data[i+2] = Math.max(0, Math.min(255, data[i+2] + n));
  }
  ctx.putImageData(imageData, 0, 0);
}

function initCardScaling() {
  const cards = [
    {
      container: document.querySelector('.casper-card-image'),
      el:        document.querySelector('.casper-cross-sell'),
      designW:   358,
      designH:   237,
      center:    true,
    },
    {
      container: document.querySelector('.verizon-card-image'),
      el:        document.querySelector('.verizon-scaler'),
      designW:   453,
      designH:   340,
      center:    false,
    },
    {
      container: document.querySelector('.finde-card-image'),
      el:        document.querySelector('.finde-scaler'),
      designW:   453,
      designH:   340,
      center:    false,
    },
  ];

  function applyScale() {
    cards.forEach(({ container, el, designW, designH, center }) => {
      if (!container || !el) return;
      const style = getComputedStyle(container);
      const padW = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const padH = parseFloat(style.paddingTop)  + parseFloat(style.paddingBottom);
      const s = Math.min(
        (container.offsetWidth  - padW) / designW,
        (container.offsetHeight - padH) / designH
      );
      el.style.transform = center
        ? `translate(-50%, -50%) scale(${s})`
        : `scale(${s})`;
    });
  }

  applyScale();
  const ro = new ResizeObserver(applyScale);
  cards.forEach(({ container }) => { if (container) ro.observe(container); });
}

document.addEventListener('DOMContentLoaded', () => {
  buildNavbar();
  initTechGridAnimation();
  initValuesSystemsIllustration();
  initCardScaling();

  const introBtn = document.getElementById('introBtn');
  if (introBtn) {
    introBtn.addEventListener('click', () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
