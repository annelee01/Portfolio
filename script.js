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

document.addEventListener('DOMContentLoaded', () => {
  buildNavbar();

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
