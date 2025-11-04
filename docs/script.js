/* script.js - interacciones: menú, scroll suave, reveal, contadores, acordeón, portafolio, formularios */
document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------
     🧭 MENÚ DE NAVEGACIÓN
  ------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('navMenu');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  // Scroll suave para los enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        nav?.classList.remove('open');
      }
    });
  });

  // Actualizar año automático en el footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------
     ✨ EFECTO REVEAL EN SCROLL
  ------------------------------ */
  const revealEls = document.querySelectorAll('.card, .service, .step, .pricing-card, .event-card, .testimonial-card');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('reveal');
        revealObserver.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(e => revealObserver.observe(e));

  /* ------------------------------
     🔢 CONTADORES ANIMADOS
  ------------------------------ */
  const counters = document.querySelectorAll('.count');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target || 100;
      const duration = 1500;
      let start = null;
      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.2 });
  counters.forEach(c => counterObserver.observe(c));

  /* ------------------------------
     📚 ACORDEÓN DE PREGUNTAS
  ------------------------------ */
  document.querySelectorAll('.accordion-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.querySelector('.panel');
      const open = panel.style.maxHeight && panel.style.maxHeight !== '0px';
      document.querySelectorAll('.accordion-item .panel').forEach(p => p.style.maxHeight = null);
      if (!open) panel.style.maxHeight = panel.scrollHeight + 'px';
    });
  });

  /* ------------------------------
     🖼️ MODAL DE PORTAFOLIO
  ------------------------------ */
  const modal = document.getElementById('portfolioModal');
  const modalImage = document.getElementById('modalImage');
  const modalType = document.getElementById('modalType');
  const modalTool = document.getElementById('modalTool');
  const modalDesc = document.getElementById('modalDesc');

  document.querySelectorAll('.portfolio-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const img = btn.dataset.img || btn.querySelector('img')?.src;
      const type = btn.dataset.type || '';
      const tool = btn.dataset.tool || '';
      const desc = btn.dataset.desc || '';
      if (modalImage) modalImage.src = img;
      if (modalImage) modalImage.alt = type;
      if (modalType) modalType.textContent = type;
      if (modalTool) modalTool.textContent = tool;
      if (modalDesc) modalDesc.textContent = desc;
      modal?.classList.add('open');
      modal?.setAttribute('aria-hidden', 'false');
    });
  });

  document.querySelectorAll('.modal-close, .modal').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || el.classList.contains('modal-close')) {
        modal?.classList.remove('open');
        modal?.setAttribute('aria-hidden', 'true');
      }
    });
  });

  document.querySelector('.modal-content')?.addEventListener('click', e => e.stopPropagation());

  /* ------------------------------
     💬 FORMULARIO DE CONTACTO
  ------------------------------ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      // Muestra un mensaje amigable, sin backend
      setTimeout(() => {
        alert('Gracias — tu mensaje ha sido enviado (o se abrió el cliente de correo). Te responderemos pronto.');
      }, 300);
    });
  }

  /* ------------------------------
     📧 NEWSLETTER → GOOGLE SHEETS
  ------------------------------ */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (!email || !email.includes('@')) {
        alert('Por favor, ingresa un correo válido.');
        return;
      }

      // 🔗 URL del Google Apps Script (tu Web App publicada)
      const scriptURL = 'https://script.google.com/macros/s/AKfycbzBSr2eBKVoTJAlJEZ49YkTSEjasa3v3Tv4pYyn4lweDib9F7Chex7pR52hDaEE_yj-WQ/exec';

      try {
        const response = await fetch(scriptURL, {
          method: 'POST',
          body: new URLSearchParams({ email })
        });

        if (response.ok) {
          alert('🎉 ¡Gracias por suscribirte! Tu correo ha sido guardado correctamente.');
          newsletterForm.reset();
        } else {
          alert('Hubo un error al guardar tu suscripción.');
        }
      } catch (error) {
        console.error(error);
        alert('No se pudo conectar al servidor de suscripción.');
      }
    });
  }

  /* ------------------------------
     🧠 BOTONES "SABER MÁS"
  ------------------------------ */
  document.querySelectorAll('.js-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const svc = btn.dataset.service || 'Servicio';
      alert(`${svc}\n\nGracias por tu interés. Agenda una sesión exploratoria o escríbenos por WhatsApp para una cotización personalizada.`);
    });
  });
});