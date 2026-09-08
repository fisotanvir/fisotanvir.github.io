/**
 * ==========================================================================
 * CYBERPUNK VIDEO GAME UI JAVASCRIPT ENGINE
 * Developer: TANVIRUL ISLAM (FISO)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ================= 1. WEB AUDIO API SYNTHESIZER (NO EXTERNAL FILES REQUIRED) ================= */
  let soundEnabled = true;
  const soundToggle = document.getElementById('sound-toggle');
  const soundStatus = document.getElementById('sound-status');
  
  // AudioContext instantiation
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
  }

  // Play sci-fi UI blip sound
  function playSound(type = 'blip') {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'hover') {
        // High pitched short futuristic chirp
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'click') {
        // Confirm confirmation beep
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  // Toggle Sound Button
  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundStatus.textContent = soundEnabled ? 'ON' : 'OFF';
    soundStatus.style.color = soundEnabled ? 'var(--neon-cyan)' : 'var(--neon-pink)';
    playSound('click');
  });


  /* ================= 2. HUD DIGITAL CLOCK ================= */
  function updateHudClock() {
    const clockElem = document.getElementById('system-time');
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    clockElem.textContent = `${hrs}:${mins}:${secs}`;
  }
  setInterval(updateHudClock, 1000);
  updateHudClock();


  /* ================= 3. TYPEWRITER EFFECT ================= */
  const typewriterElem = document.getElementById('typewriter');
  const roles = [
    "Competitive Gamer & Strategist",
    "Mobile Tech & iOS Enthusiast",
    "Creative Photographer & Visual Artist",
    "Video & Digital Photo Editor",
    "HSC 2026 @ Dhaka Commerce College"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeWriter() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typewriterElem.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typewriterElem.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(typeWriter, typingSpeed);
  }
  typeWriter();


  /* ================= 4. CUSTOM GLOWING RING CURSOR ================= */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 300, fill: "forwards" });
  });

  // Attach sound and cursor scale on interactive elements
  const interactiveTargets = document.querySelectorAll('a, button, .tilt-card, .spec-row, .ping-code');
  interactiveTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.6)';
      cursorOutline.style.borderColor = 'var(--neon-pink)';
      playSound('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorOutline.style.borderColor = 'var(--neon-cyan)';
    });
    el.addEventListener('click', () => {
      playSound('click');
    });
  });


  /* ================= 5. INTERACTIVE BACKGROUND CANVAS ================= */
  const canvas = document.getElementById('cyber-canvas');
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.color = Math.random() > 0.6 ? '#00d2ff' : '#ff0055';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Generate particle nodes
  const particleCount = Math.min(Math.floor(window.innerWidth / 16), 75);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function renderScene() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting cyber lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.strokeStyle = `rgba(0, 210, 255, ${0.15 - dist / 110 * 0.15})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(renderScene);
  }
  renderScene();


  /* ================= 6. 3D TILT EFFECT ON CARDS ================= */
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });


  /* ================= 7. QUICK-COPY EMAIL TERMINAL ================= */
  const emailCopyBtn = document.getElementById('email-copy');
  const copyTooltip = document.getElementById('copy-tooltip');

  if (emailCopyBtn) {
    emailCopyBtn.addEventListener('click', () => {
      const email = emailCopyBtn.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        copyTooltip.style.display = 'inline';
        setTimeout(() => {
          copyTooltip.style.display = 'none';
        }, 2200);
      });
    });
  }

});
