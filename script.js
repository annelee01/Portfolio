function buildNavbar() {
  const navbar = document.getElementById('site-navbar');
  if (!navbar) return;

  navbar.innerHTML = `
    <div class="inner-nav">
      <a href="#contact" class="btn-contact">Contact</a>
      <nav class="nav-links">
        <a href="index.html">Case Studies</a>
        <a href="finde.html">Tech</a>
        <a href="verizon.html">Values</a>
        <a href="#">Thought Leadership</a>
        <a href="#">Collaborators</a>
      </nav>
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
