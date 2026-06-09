/* ═══════════════════════════════════════
   PORTFOLIO — main.js
   Matteo Muccioli
═══════════════════════════════════════ */

// ─── Footer year ───────────────────────
document.getElementById('footerYear').textContent = new Date().getFullYear();

// ─── Navbar scroll state ───────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ─── Mobile burger menu ────────────────
const burger   = document.getElementById('navBurger');
const mobileMenu = document.getElementById('navMobile');

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});

// Close mobile menu on link click
document.querySelectorAll('.nav-mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// ─── Active nav link on scroll ─────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

// ─── Scroll-reveal animation ───────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings in the same parent
      const siblings = entry.target.parentElement
        ? [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')]
        : [];
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── Typed hero text ───────────────────
const phrases = [
  'Software Engineer',
  'Web Developer',
  'RAG Architect',
  'AI Integrator',
];
let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
const typedEl   = document.getElementById('typedText');

function typeLoop() {
  if (!typedEl) return;
  const current = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 55 : 90;

  if (!isDeleting && charIndex === current.length) {
    delay = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 350;
  }

  setTimeout(typeLoop, delay);
}
setTimeout(typeLoop, 900);

// ─── Modal system ──────────────────────
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  // Trigger transition after DOM paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { modal.style.opacity = '1'; });
  });
  // Focus trap: focus close button
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal(modal.id);
  });
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay:not([hidden])').forEach(m => closeModal(m.id));
  }
});

// Expose to HTML onclick handlers
window.openModal  = openModal;
window.closeModal = closeModal;

// ─── Contact form (mailto fallback) ────
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('formSubmit');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();

  const name    = document.getElementById('formName').value.trim();
  const email   = document.getElementById('formEmail').value.trim();
  const message = document.getElementById('formMessage').value.trim();

  if (!name || !email || !message) return;

  // Disable button during "send"
  submitBtn.disabled = true;
  submitBtn.textContent = 'Invio in corso…';

  // Compose mailto link as fallback (no backend needed for static hosting)
  const subject = encodeURIComponent(`Contatto Portfolio — ${name}`);
  const body    = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\n${message}`);
  const mailto  = `mailto:matteomuccioli49@gmail.com?subject=${subject}&body=${body}`;

  setTimeout(() => {
    window.location.href = mailto;
    successMsg.textContent = 'Apertura client email… In alternativa scrivimi direttamente a matteomuccioli49@gmail.com';
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      Invia Messaggio`;
    form.reset();
  }, 600);
});

// ─── Smooth scroll for all anchor links ─
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
