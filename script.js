/* ============================================================
   SELF-MARIA — Interactive Layer
   Adds the polish: nav rendering, animations, micro-interactions
   ============================================================ */

(function () {
  'use strict';

  /* --------------------------------------------------------
     1) RENDER SHARED NAV + ANNOUNCEMENT BAR + FOOTER
     This keeps each HTML page DRY. Each page only needs:
       <body data-page="home">  ...content...
     -------------------------------------------------------- */
  const PAGES = [
    { key: 'home',   href: 'index.html',  label: 'Home',   num: '01' },
    { key: 'about',  href: 'about.html',  label: 'About',  num: '02' },
    { key: 'enroll', href: 'enroll.html', label: 'Enroll', num: '03' },
  ];

  const currentPage = document.body.dataset.page || 'home';

  /* Announcement bar */
  const announce = document.createElement('div');
  announce.className = 'announce';
  announce.innerHTML = `
    <span class="pulse-dot"></span>
    <strong>Cohort closing soon —</strong>
    Only <span id="seats-left">17</span> seats left
    <span id="countdown" class="countdown">--d : --h : --m : --s</span>
  `;
  document.body.insertBefore(announce, document.body.firstChild);

  /* Mobile menu toggle */
  const toggle = document.createElement('button');
  toggle.className = 'menu-toggle';
  toggle.setAttribute('aria-label', 'Toggle menu');
  toggle.innerHTML = '<span class="bar"></span>';
  document.body.appendChild(toggle);

  /* Right-side navigation */
  const sidenav = document.createElement('aside');
  sidenav.className = 'sidenav';
  sidenav.innerHTML = `
    <div class="sidenav-brand">
      <a href="index.html" class="sidenav-logo">
        <img src="assets/logo.jpeg" alt="Self-Maria">
      </a>
      <div>
        <div class="sidenav-name">Self-MARIA</div>
        <div class="sidenav-tag">Self Mastery</div>
      </div>
    </div>

    <nav class="sidenav-links">
      ${PAGES.map(p => `
        <a href="${p.href}" class="sidenav-link ${p.key === currentPage ? 'active' : ''}">
          <span>${p.label}</span>
        </a>
      `).join('')}
    </nav>

    <a href="enroll.html" class="sidenav-cta">Get the 5 elements →</a>

    <div class="sidenav-foot">
      <small>© ${new Date().getFullYear()}</small>
    </div>
  `;
  document.body.appendChild(sidenav);

  toggle.addEventListener('click', function () {
    sidenav.classList.toggle('open');
    toggle.classList.toggle('open');
  });

  /* Close menu on link click (mobile) */
  sidenav.querySelectorAll('.sidenav-link, .sidenav-cta').forEach(function (a) {
    a.addEventListener('click', function () {
      sidenav.classList.remove('open');
      toggle.classList.remove('open');
    });
  });


  /* --------------------------------------------------------
     2) PAGE LOADER — fade out on load
     -------------------------------------------------------- */
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = '<div class="loader-mark"></div>';
  document.body.insertBefore(loader, document.body.firstChild);

  window.addEventListener('load', function () {
    setTimeout(function () { loader.classList.add('hidden'); }, 300);
  });


  /* --------------------------------------------------------
     3) COUNTDOWN TIMER (urgency)
     -------------------------------------------------------- */
  const STORAGE_KEY = 'sm_enroll_deadline';
  const DAYS = 7;
  let deadline = parseInt(localStorage.getItem(STORAGE_KEY), 10);
  if (isNaN(deadline)) {
    deadline = Date.now() + DAYS * 86400000;
    localStorage.setItem(STORAGE_KEY, deadline);
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function tickCountdown() {
    const el = document.getElementById('countdown');
    if (!el) return;
    let diff = deadline - Date.now();
    if (diff <= 0) {
      deadline = Date.now() + DAYS * 86400000;
      localStorage.setItem(STORAGE_KEY, deadline);
      diff = deadline - Date.now();
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff / 3600000) % 24);
    const mins = Math.floor((diff / 60000) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    el.textContent = `${pad(days)}d : ${pad(hours)}h : ${pad(mins)}m : ${pad(secs)}s`;
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);


  /* --------------------------------------------------------
     4) SEAT COUNTER — slowly drops over the session
     -------------------------------------------------------- */
  const SEAT_KEY = 'sm_seats_left';
  let seats = parseInt(localStorage.getItem(SEAT_KEY), 10);
  if (isNaN(seats)) { seats = 17; localStorage.setItem(SEAT_KEY, seats); }
  const seatEl = document.getElementById('seats-left');
  if (seatEl) seatEl.textContent = seats;
  setTimeout(function () {
    if (seats > 3) {
      seats -= 1;
      localStorage.setItem(SEAT_KEY, seats);
      if (seatEl) {
        seatEl.style.transition = 'all 0.4s ease';
        seatEl.style.transform = 'scale(1.4)';
        seatEl.style.color = '#D4B48A';
        seatEl.textContent = seats;
        setTimeout(function () {
          seatEl.style.transform = 'scale(1)';
          seatEl.style.color = '';
        }, 400);
      }
    }
  }, (4 + Math.random() * 5) * 60000);


  /* --------------------------------------------------------
     5) REVEAL ON SCROLL — auto-tag main content blocks
     -------------------------------------------------------- */
  const revealSelectors = [
    '.section-head', '.pain-card', '.feature', '.testi',
    '.value-card', '.module', '.faq-item', '.stat', '.hero-card',
    '.floating-stat', '.enroll-card', '.cta-strip .container > *'
  ];
  document.querySelectorAll(revealSelectors.join(',')).forEach(function (el, i) {
    el.classList.add('reveal');
    const delay = (i % 4) * 80;
    el.style.transitionDelay = delay + 'ms';
  });

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });


  /* --------------------------------------------------------
     6) ANIMATED NUMBER COUNTERS  (use data-count="4200")
     -------------------------------------------------------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1600;
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = target * eased;
      el.textContent = prefix + (target % 1 === 0 ? Math.round(v).toLocaleString() : v.toFixed(1)) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const countObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) { countObs.observe(el); });


  /* --------------------------------------------------------
     7) FAQ ACCORDION
     -------------------------------------------------------- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });


  /* --------------------------------------------------------
     8) CURRICULUM MODULES — same accordion behavior
     -------------------------------------------------------- */
  document.querySelectorAll('.module-head').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const m = btn.parentElement;
      m.classList.toggle('open');
    });
  });


  /* --------------------------------------------------------
     9) MAGNETIC BUTTONS
     -------------------------------------------------------- */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });


  /* --------------------------------------------------------
     10) CURSOR GLOW (subtle aurora following the cursor)
     -------------------------------------------------------- */
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX; mouseY = e.clientY;
  });
  function followGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(followGlow);
  }
  followGlow();


  /* --------------------------------------------------------
     11) PARALLAX BLOBS in hero
     -------------------------------------------------------- */
  const blobs = document.querySelectorAll('.blob');
  if (blobs.length) {
    document.addEventListener('mousemove', function (e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      blobs.forEach(function (b, i) {
        const factor = (i + 1) * 0.4;
        b.style.translate = `${x * factor}px ${y * factor}px`;
      });
    });
  }


  /* --------------------------------------------------------
     12) LEAD FORM (placeholder — replaced by ConvertKit embed)
     -------------------------------------------------------- */
  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      try {
        await fetch('https://app.kit.com/forms/9541872/subscriptions',
                    { method: 'POST',
  headers: {'Content-Type':
 'application/x-www-form-urlencoded'
  },body: new URLSearchParams({
 email_address: email

            })

          }

        );

        leadForm.innerHTML = `
   <div style=" padding:22px 28px;  background:#005B5B;  color:#F5EFDE;
 border-radius:100px; font-weight:600;
width:100%; text-align:center;
 font-family:Fraunces,serif;
font-size:1.05rem;   ">
  ✓ Success! Check your inbox for your free introductory video.  </div>

        `;

      } catch (error) {

        alert( 'Something went wrong. Please try again.' ); }
    });

  }

  /* --------------------------------------------------------
     13) FOOTER YEAR
     -------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

})();
