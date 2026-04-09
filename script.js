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
  const onIndexPage = currentFile === 'index.html' || currentFile === '';

  // On case study pages, nav links go back to index + anchor rather than scrolling in-page
  if (!onIndexPage) {
    navbar.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
      link.href = 'index.html' + link.getAttribute('href');
    });
  }

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
    const base = onIndexPage ? '' : 'index.html';
    overlay.innerHTML = `
      <nav class="nav-mobile-links">
        <a href="${base}#case-studies">Case Studies</a>
        <a href="${base}#technology">Tech</a>
        <a href="${base}#values">Values</a>
        <a href="${base}#collaborators">Collaborators</a>
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

  const W = 704, H = 512;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const baseColors = [
    '#f3e7ce', '#FFA961', '#fcfc6d', '#917851',
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

  // Gaussian-approx box blur on the gradient band (4 passes, radius 20)
  const blurRadius = 20, blurPasses = 4;
  const tmp = new Uint8ClampedArray((H - gradY) * W * 4);
  for (let p = 0; p < blurPasses; p++) {
    // Horizontal pass: data -> tmp
    for (let y = gradY; y < H; y++) {
      for (let x = 0; x < W; x++) {
        let r = 0, g = 0, b = 0;
        for (let dx = -blurRadius; dx <= blurRadius; dx++) {
          const nx = Math.max(0, Math.min(W - 1, x + dx));
          const si = (y * W + nx) * 4;
          r += data[si]; g += data[si + 1]; b += data[si + 2];
        }
        const d = blurRadius * 2 + 1;
        const ti = ((y - gradY) * W + x) * 4;
        tmp[ti] = r / d; tmp[ti + 1] = g / d; tmp[ti + 2] = b / d; tmp[ti + 3] = 255;
      }
    }
    // Vertical pass: tmp -> data
    for (let y = gradY; y < H; y++) {
      for (let x = 0; x < W; x++) {
        let r = 0, g = 0, b = 0;
        for (let dy = -blurRadius; dy <= blurRadius; dy++) {
          const ny = Math.max(0, Math.min(H - gradY - 1, y - gradY + dy));
          const si = (ny * W + x) * 4;
          r += tmp[si]; g += tmp[si + 1]; b += tmp[si + 2];
        }
        const d = blurRadius * 2 + 1;
        const di = (y * W + x) * 4;
        data[di] = r / d; data[di + 1] = g / d; data[di + 2] = b / d;
      }
    }
  }

  // Progressive noise: 0 at top, full at bottom
  for (let i = 0; i < data.length; i += 4) {
    const y = Math.floor((i / 4) / W);
    const noiseAmt = (y / (H - 1)) * 24;
    const n = (Math.random() - 0.5) * noiseAmt;
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

function animateCountUp(slide) {
  if (slide.dataset.counted) return;
  slide.dataset.counted = '1';
  slide.querySelectorAll('.cs-count-up').forEach(el => {
    const target   = +el.dataset.target;
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const duration = 1400;
    const start    = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4); // ease-out quartic: fast start, crawls to exact value
      el.textContent = prefix + Math.round(ease * target) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

function triggerDesignAnimation(wrap) {
  const cartImg = wrap.querySelector('.cs-design-cart-img');
  const scrollImg = wrap.querySelector('.cs-design-scroll-img');
  const inner = wrap.querySelector('.cs-design-inner');
  if (cartImg && scrollImg && inner) {
    const run = () => {
      wrap.classList.remove('is-animated');
      scrollImg.style.transition = 'none';
      scrollImg.style.transform = 'translateY(0)';
      inner.style.height = cartImg.offsetHeight + 'px';
      scrollImg.offsetHeight; // force reflow
      scrollImg.style.transition = '';
      setTimeout(() => {
        scrollImg.style.transform = `translateY(-${scrollImg.offsetHeight - cartImg.offsetHeight}px)`;
        wrap.classList.add('is-animated');
      }, 800);
    };
    Promise.all([
      cartImg.complete ? Promise.resolve() : new Promise(r => cartImg.addEventListener('load', r, { once: true })),
      scrollImg.complete ? Promise.resolve() : new Promise(r => scrollImg.addEventListener('load', r, { once: true })),
    ]).then(() => {
      run();
      // Keep inner height in sync as the browser resizes
      if (!wrap._resizeObserver) {
        wrap._resizeObserver = new ResizeObserver(() => {
          inner.style.height = cartImg.offsetHeight + 'px';
        });
        wrap._resizeObserver.observe(cartImg);
      }
    });
  } else {
    wrap.classList.add('is-animated');
  }
}

function triggerMorphAnimation(slide) {
  const morphImg = slide.querySelector('.cs-morph-img');
  const morphVideo = slide.querySelector('.cs-morph-video');
  if (morphImg && morphVideo) {
    [morphImg, morphVideo].forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight; // force reflow
      el.style.animation = '';
    });
    morphVideo.currentTime = 0;
    morphVideo.play();
  }
}

function initMorphAnimationOnScroll() {
  const morphWraps = document.querySelectorAll('.cs-morph-wrap');
  if (!morphWraps.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (window.innerWidth > 768) return;
      const slide = entry.target.closest('.cs-hero-slide');
      if (entry.isIntersecting) {
        triggerMorphAnimation(slide);
      } else {
        // Reset so animations replay on re-entry
        const morphImg = slide.querySelector('.cs-morph-img');
        const morphVideo = slide.querySelector('.cs-morph-video');
        const captions = slide.querySelectorAll('.cs-morph-caption');
        if (morphImg && morphVideo) {
          [morphImg, morphVideo, ...captions].forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // force reflow
            el.style.animation = '';
          });
          morphVideo.currentTime = 0;
        }
      }
    });
  }, { threshold: 0.4 });
  morphWraps.forEach(wrap => observer.observe(wrap));
}

function initOverlayAnimationsOnScroll() {
  const wraps = document.querySelectorAll('.cs-problem-wrap, .cs-design-wrap');
  if (!wraps.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Only handle scroll-triggered animation in stacked (mobile) layout
      if (window.innerWidth > 768) return;
      if (entry.isIntersecting) {
        triggerDesignAnimation(entry.target);
      } else {
        // Reset when scrolled out so it replays on re-entry
        const scrollImg = entry.target.querySelector('.cs-design-scroll-img');
        if (scrollImg) {
          entry.target.classList.remove('is-animated');
          scrollImg.style.transition = 'none';
          scrollImg.style.transform = 'translateY(0)';
        }
      }
    });
  }, { threshold: 0.4 });
  wraps.forEach(wrap => observer.observe(wrap));
}

function initCountUpOnScroll() {
  const slidesWithStats = document.querySelectorAll('.cs-hero-slide:has(.cs-count-up)');
  if (!slidesWithStats.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCountUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  slidesWithStats.forEach(slide => observer.observe(slide));
}

function initCaseStudyPagination() {
  const slides = document.querySelectorAll('.cs-hero-slide');
  if (!slides.length) return;

  const prevBtn = document.querySelector('.cs-arrow--prev');
  const nextBtn = document.querySelector('.cs-arrow--next');
  const dots    = document.querySelectorAll('.cs-progress-seg');
  const hint    = document.querySelector('.cs-keyboard-hint');
  let current   = 0;
  const total   = slides.length;
  let hintDismissed = false;

  function goTo(index) {
    slides[current].classList.remove('cs-hero-slide--active');
    dots[current].classList.remove('cs-progress-seg--active');
    current = index;
    slides[current].classList.add('cs-hero-slide--active');
    dots[current].classList.add('cs-progress-seg--active');
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === total - 1;
    const id = slides[current].dataset.slideId;
    if (id) history.replaceState(null, '', '#' + id);
    // Reset morph animation and video if this slide has one
    triggerMorphAnimation(slides[current]);
    // Trigger count-up animation if this slide has metrics
    if (slides[current].querySelector('.cs-count-up')) animateCountUp(slides[current]);
    // Trigger overlay animations on problem/design slides (paginated layout only)
    if (window.innerWidth > 768) {
      const overlay = slides[current].querySelector('.cs-problem-wrap, .cs-design-wrap');
      if (overlay) triggerDesignAnimation(overlay);
    }
    // Dismiss hint once user navigates past slide 2
    if (current >= 1 && hint && !hintDismissed) {
      hintDismissed = true;
      hint.classList.remove('cs-keyboard-hint--visible');
    }
  }

  // Show hint on next-arrow hover, hide on leave (unless dismissed)
  if (nextBtn && hint) {
    nextBtn.addEventListener('mouseenter', () => {
      if (!hintDismissed) hint.classList.add('cs-keyboard-hint--visible');
    });
    nextBtn.addEventListener('mouseleave', () => {
      hint.classList.remove('cs-keyboard-hint--visible');
    });
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  if (prevBtn) prevBtn.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', () => { if (current < total - 1) goTo(current + 1); });

  document.addEventListener('keydown', (e) => {
    if (!document.querySelector('.cs-hero-slide')) return;
    if (e.key === 'ArrowLeft'  && current > 0)         goTo(current - 1);
    if (e.key === 'ArrowRight' && current < total - 1) goTo(current + 1);
  });

  // If a hash is present on load, jump to the matching slide
  const hash = window.location.hash.slice(1);
  const initial = hash ? Array.from(slides).findIndex(s => s.dataset.slideId === hash) : -1;
  goTo(initial >= 0 ? initial : 0);
}

document.addEventListener('DOMContentLoaded', () => {
  buildNavbar();
  initTechGridAnimation();
  initValuesSystemsIllustration();
  initCardScaling();
  initCaseStudyPagination();
  initOverlayAnimationsOnScroll();
  initMorphAnimationOnScroll();
  initCountUpOnScroll();

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
