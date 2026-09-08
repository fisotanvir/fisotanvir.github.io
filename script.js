/**
 * ==========================================================================
 * VIDEO GAME UI & AMBIENT LIQUID JAVASCRIPT ENGINE
 * Developer: TANVIRUL ISLAM (FISO)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ================= 1. FADE IN & FADE OUT ON SCROLL ================= */
  const fadeElements = document.querySelectorAll('.fade-target');

  const observerOptions = {
    threshold: 0.25,
    rootMargin: "0px 0px -50px 0px"
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-visible');
      } else {
        // Fade out smoothly when scrolling away
        entry.target.classList.remove('fade-visible');
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => fadeObserver.observe(el));


  /* ================= 2. PILL NAV SCROLLSPY & VISIBILITY ================= */
  const globalNav = document.getElementById('globalPillNav');
  const navPills = document.querySelectorAll('.nav-pill');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    // Hide pill navigation on the first start screen, show from screen 2
    if (scrollY > window.innerHeight * 0.4) {
      globalNav.style.opacity = '1';
      globalNav.style.pointerEvents = 'auto';
    } else {
      globalNav.style.opacity = '0';
      globalNav.style.pointerEvents = 'none';
    }

    // Active pill highlighting based on current view
    let currentActiveId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentActiveId = section.getAttribute('id');
      }
    });

    navPills.forEach(pill => {
      pill.classList.remove('active');
      if (pill.getAttribute('data-target') === currentActiveId) {
        pill.classList.add('active');
      }
    });
  });


  /* ================= 3. SYNTHESIZED GAME AUDIO (WEB AUDIO API) ================= */
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function playUiBeep(freq = 600, duration = 0.05) {
    try {
      if (!audioCtx) audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq + 400, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio fallback safe
    }
  }

  // Bind subtle sounds on menu interactions
  document.querySelectorAll('.menu-action, .nav-pill, .social-pill-btn, .soft-badge').forEach(item => {
    item.addEventListener('mouseenter', () => playUiBeep(850, 0.04));
    item.addEventListener('click', () => playUiBeep(450, 0.08));
  });

});
