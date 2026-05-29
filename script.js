/* ═══════════════════════════════════════════════
   MADAMEROSE — script.js
═══════════════════════════════════════════════ */

// ── CUSTOM ARROW CURSOR ────────────────────────
(function () {
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursor-dot');

  // Hide the old dot — arrow replaces both
  if (dot) dot.style.display = 'none';

  // Build SVG arrow cursor element
  cursor.innerHTML = `
    <svg id="cursor-arrow-svg" width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2L2 28L8.5 21.5L13.5 33L17 31.5L12 19.5L21.5 19.5L2 2Z"
        fill="#0a0a0a" stroke="#fafafa" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
  `;

  // Override circle styles — make it a plain positioned container
  cursor.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 28px; height: 36px;
    pointer-events: none;
    z-index: 9999;
    transform: translate(0, 0);
    transition: none;
    mix-blend-mode: normal;
    border: none;
    background: none;
    border-radius: 0;
  `;

  let mx = 0, my = 0;
  let cx = 0, cy = 0;
  let isHover = false;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  const arrowSvg = cursor.querySelector('#cursor-arrow-svg');

  function animateCursor() {
    // Snappy follow for arrow feel
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;

    // Scale up on hover
    const scale = isHover ? 1.35 : 1;
    arrowSvg.style.transform = `scale(${scale})`;
    arrowSvg.style.transition = 'transform 0.2s cubic-bezier(0.22,1,0.36,1)';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover state — fill inverts to white arrow on dark bg
  const hoverTargets = 'a, button, .tag, .service-card, .portfolio-item, input, select, textarea';

  function setHover(on) {
    isHover = on;
    document.body.classList.toggle('cursor-hover', on);
    const path = arrowSvg.querySelector('path');
    if (on) {
      path.setAttribute('fill', '#fafafa');
      path.setAttribute('stroke', '#0a0a0a');
    } else {
      path.setAttribute('fill', '#0a0a0a');
      path.setAttribute('stroke', '#fafafa');
    }
  }

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest && e.target.closest(hoverTargets)) setHover(true);
    else setHover(false);
  });

  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest(hoverTargets)) {
      setHover(false);
    }
  });
})();


// ── PROGRESS BAR ──────────────────────────────
(function () {
  const bar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  });
})();


// ── NAV: Active link + Toggle ──────────────────
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const spans = toggle ? toggle.querySelectorAll('span') : [];

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      // Animate hamburger → X
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close on nav link click (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // Highlight active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');

  function setActive() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActive);
  setActive();
})();


// ── REVEAL ON SCROLL ───────────────────────────
(function () {
  const revealEls = [
    ...document.querySelectorAll('.service-card'),
    ...document.querySelectorAll('.portfolio-item'),
    ...document.querySelectorAll('.about-right'),
    ...document.querySelectorAll('.about-left'),
    ...document.querySelectorAll('.contact-grid'),
    ...document.querySelectorAll('.hero-meta'),
    ...document.querySelectorAll('.hero-headline-wrap'),
    ...document.querySelectorAll('.hero-badge-col'),
    ...document.querySelectorAll('.section-label-row'),
    ...document.querySelectorAll('.section-sub'),
  ];

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 0.1 + 's';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08 });

  revealEls.forEach(el => observer.observe(el));
})();


// ── MODAL ─────────────────────────────────────
(function () {
  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('closeModal');
  const openBtn = document.getElementById('openModal');
  const openBtn2 = document.getElementById('openModal2');
  const heroContact = document.getElementById('heroContact');
  const submitBtn = document.getElementById('submitBtn');
  const formContent = document.getElementById('formContent');
  const successMsg = document.getElementById('successMsg');

  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  [openBtn, openBtn2, heroContact].forEach(btn => {
    if (btn) btn.addEventListener('click', openModal);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Form submit (demo)
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const firstName = document.getElementById('firstName').value.trim();
      const email = document.getElementById('email').value.trim();
      const service = document.getElementById('service').value;

      if (!firstName || !email || !service) {
        // Simple shake on required fields
        [document.getElementById('firstName'), document.getElementById('email'), document.getElementById('service')].forEach(el => {
          if (!el.value.trim()) {
            el.style.borderColor = '#000';
            el.style.animation = 'shake 0.4s';
            setTimeout(() => {
              el.style.animation = '';
              el.style.borderColor = '';
            }, 400);
          }
        });
        return;
      }

      formContent.style.display = 'none';
      successMsg.classList.add('show');
    });
  }

  // Add shake keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-5px)}
      40%{transform:translateX(5px)}
      60%{transform:translateX(-5px)}
      80%{transform:translateX(5px)}
    }
  `;
  document.head.appendChild(style);
})();


// ── SERVICES: Subtle parallax number ──────────
(function () {
  const cards = document.querySelectorAll('.service-card');
  document.addEventListener('mousemove', (e) => {
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      card.style.transform = `translate(${dx * 4}px, ${dy * 4}px)`;
    });
  });

  cards.forEach(card => {
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


// ── NAV ACTIVE STYLE (CSS add-on) ─────────────
(function () {
  const style = document.createElement('style');
  style.textContent = `.nav-links a.active { color: var(--black) !important; }
  .nav-links a.active::after { transform: scaleX(1) !important; }`;
  document.head.appendChild(style);
})();