(() => {
  'use strict';

  // ===== Preloader =====
  window.addEventListener('load', () => {
    const p = document.getElementById('preloader');
    if (p) setTimeout(() => p.classList.add('hidden'), 250);
  });

  // ===== Scroll reveal =====
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  // ===== Navbar shadow on scroll =====
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 16) navbar.classList.add('is-scrolled');
      else navbar.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ===== Mobile nav =====
  const navOpen = document.getElementById('nav-open');
  const navClose = document.getElementById('nav-close');
  const mobileNav = document.getElementById('mobile-nav');
  const openNav = () => { mobileNav?.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
  const closeNav = () => { mobileNav?.classList.remove('is-open'); document.body.style.overflow = ''; };
  navOpen?.addEventListener('click', openNav);
  navClose?.addEventListener('click', closeNav);
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  // ===== Sticky bottom CTA =====
  const stickyCta = document.getElementById('sticky-cta');
  const hero = document.getElementById('hero');
  if (stickyCta && hero) {
    const heroObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) stickyCta.classList.remove('is-visible');
        else stickyCta.classList.add('is-visible');
      });
    }, { threshold: 0.15 });
    heroObs.observe(hero);
  }

  // ===== Demo tab switcher + typewriter =====
  const demoData = {
    ad: {
      input: 'Write ad copy for a ₹999 yoga course aimed at busy Bangalore professionals.',
      skill: 'Ad Copy Engine',
      output: `HOOK: You don't need more time. You need 20 honest minutes.\n\nPOSITIONING: A yoga program built for people who can't sit still — stress recovery, posture, energy.\n\nOFFER: 30-day Bangalore-built program. Live sessions. Mobile-first replays.\n\nCTA: Start Today — ₹999. No equipment, no excuses.`,
    },
    research: {
      input: 'Research the market for direct-to-consumer skincare in India.',
      skill: 'Research Analyst',
      output: `AUDIENCE: 22–34 urban, mostly female, mid-income, reads ingredient labels, shops via Reels.\n\nPAIN POINTS: Decision fatigue from 100s of brands. Trust gap on claims. Sensitive skin reactions.\n\nOPPORTUNITY: Male grooming framed as performance — CAC ~40% lower, near-zero competition above ₹1,200 AOV.`,
    },
    content: {
      input: 'Create content about why AI execution beats AI knowledge. Audience: founders.',
      skill: 'Content Strategist',
      output: `IDEAS:\n• "I stopped writing prompts. Here's what happened."\n• Manual AI vs Operating AI — 90s breakdown.\n• Why your tool stack isn't your bottleneck.\n\nSCRIPT (Reel, 38s): Hook → Problem → Reframe → Proof → CTA.\n\nDISTRIBUTION: LinkedIn post first, Reel second, newsletter teardown third.`,
    },
  };

  const tabs = document.querySelectorAll('[data-tab]');
  const inputEl = document.getElementById('demo-input');
  const skillEl = document.getElementById('demo-skill');
  const outEl = document.getElementById('demo-output');
  let typingTimer = null;
  const typeOut = (el, text) => {
    if (!el) return;
    if (typingTimer) clearTimeout(typingTimer);
    el.textContent = '';
    el.classList.add('type-cursor');
    let i = 0;
    const step = () => {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i += Math.max(1, Math.round(text.length / 280));
        typingTimer = setTimeout(step, 14);
      } else {
        el.textContent = text;
        setTimeout(() => el.classList.remove('type-cursor'), 600);
      }
    };
    step();
  };

  const setTab = (key) => {
    const d = demoData[key];
    if (!d) return;
    tabs.forEach(t => {
      const on = t.dataset.tab === key;
      t.classList.toggle('mock-pill', true);
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (inputEl) inputEl.textContent = d.input;
    if (skillEl) skillEl.textContent = d.skill;
    typeOut(outEl, d.output);
  };
  tabs.forEach(t => t.addEventListener('click', () => setTab(t.dataset.tab)));

  // Lazy-init demo when scrolled into view
  const demoSection = document.getElementById('demo');
  if (demoSection) {
    const demoObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTab('ad');
          demoObs.disconnect();
        }
      });
    }, { threshold: 0.3 });
    demoObs.observe(demoSection);
  }

  // ===== FAQ — single open behaviour =====
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        document.querySelectorAll('.faq-item').forEach(other => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // ===== Year =====
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = String(new Date().getFullYear()));
})();
