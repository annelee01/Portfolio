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
      <button class="nav-hamburger" aria-label="Open menu">
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
