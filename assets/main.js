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
      input: 'Brief: Promote a ₹999 yoga course to busy professionals in Bangalore. Tone: motivating, no fluff.',
      skill: 'Ad Copy Generator',
      output: `HEADLINE: Yoga For People Who "Don't Have Time."\n\nPRIMARY: You don't need 1 hour. You need 20 focused minutes. Our Bangalore-built program is designed for professionals who can't sit still — built around energy, posture and stress recovery.\n\nCTA: Start Today — ₹999`,
    },
    research: {
      input: 'Topic: Direct-to-consumer skincare in India. Find the top 3 emerging trends and 1 untapped angle.',
      skill: 'Market Analyzer',
      output: `TREND 1: Bakuchiol replacing retinol in younger demos (18-26).\nTREND 2: "Skin-fasting" content driving 3x engagement on Reels.\nTREND 3: Ayurvedic + clinical hybrid claims (e.g. "kumkumadi + niacinamide").\n\nUNTAPPED: Male grooming SKUs framed as performance — not vanity. CAC is 40% lower in this segment.`,
    },
    content: {
      input: 'Write a LinkedIn post about why AI execution beats AI knowledge. Audience: founders.',
      skill: 'Content Studio',
      output: `Most founders don't lose because they don't know AI.\n\nThey lose because they're using it manually.\n\nOne prompt at a time.\nOne tab at a time.\nOne thought at a time.\n\nThe winners aren't smarter.\nThey've just built a system around the model.\n\nThat's the gap. And it's closing fast.`,
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

  // ===== Countdown =====
  const KEY = 'cs_launch_deadline_v1';
  const DURATION = 72 * 60 * 60 * 1000; // 72h
  let deadline = parseInt(localStorage.getItem(KEY) || '0', 10);
  if (!deadline || isNaN(deadline) || deadline < Date.now()) {
    deadline = Date.now() + DURATION;
    localStorage.setItem(KEY, String(deadline));
  }
  const pad = (n) => String(n).padStart(2, '0');
  const updateCountdown = () => {
    const left = Math.max(0, deadline - Date.now());
    const h = Math.floor(left / 3_600_000);
    const m = Math.floor((left % 3_600_000) / 60_000);
    const s = Math.floor((left % 60_000) / 1000);
    document.querySelectorAll('[data-count="h"]').forEach(el => el.textContent = pad(h));
    document.querySelectorAll('[data-count="m"]').forEach(el => el.textContent = pad(m));
    document.querySelectorAll('[data-count="s"]').forEach(el => el.textContent = pad(s));
  };
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ===== Year =====
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = String(new Date().getFullYear()));
})();
