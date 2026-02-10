const revealItems = document.querySelectorAll('.reveal');
const header = document.querySelector('.site-header');
const navAllLinks = document.querySelectorAll('.nav-links a');
const navHashLinks = Array.from(navAllLinks).filter((link) => {
  const href = link.getAttribute('href') || '';
  return href.startsWith('#');
});
const sections = document.querySelectorAll('section[id]');
const yearNode = document.querySelector('#year');
const navToggle = document.querySelector('#nav-toggle');
const navLinksWrap = document.querySelector('#nav-links');
const navIndicator = document.querySelector('#nav-indicator');
const progress = document.querySelector('#scroll-progress');
const orbOne = document.querySelector('.orb-1');
const orbTwo = document.querySelector('.orb-2');
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const introScreen = document.querySelector('#intro-screen');
const introSkip = document.querySelector('#intro-skip');
const introVideo = document.querySelector('.intro-video');
const introSoundButton = document.querySelector('#intro-sound');
const introStrike = document.querySelector('#intro-strike');
const introTitle = document.querySelector('.intro-title');
const introTyped = document.querySelector('#intro-typed');
const introSubtitle = document.querySelector('#intro-subtitle');
const introFireCurtain = document.querySelector('#intro-fire-curtain');
const curtainWingLeft = document.querySelector('.curtain-wing.left');
const curtainWingRight = document.querySelector('.curtain-wing.right');
const aiGrid = document.querySelector('#ai-grid');
const energyField = document.querySelector('#energy-field');
const robotScene = document.querySelector('#robot-scene');
const tiltItems = document.querySelectorAll('.tilt');
const hero = document.querySelector('.hero');
const depthLayers = document.querySelectorAll('.depth-layer');
const aiCore = document.querySelector('#ai-core');
let introFxActive = true;
let introHidden = false;
let introTimers = [];
let introCurtainOpenedAt = 0;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const moveNavIndicator = (link) => {
  if (!navIndicator || !navLinksWrap || !link) return;
  if (!(link instanceof HTMLElement)) return;
  const wrapRect = navLinksWrap.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  navIndicator.style.width = `${linkRect.width}px`;
  navIndicator.style.transform = `translateX(${linkRect.left - wrapRect.left}px)`;
  navIndicator.style.opacity = '1';
};

const updateActiveSection = () => {
  let currentId = '';
  sections.forEach((section) => {
    const top = section.offsetTop - 140;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      currentId = section.id;
    }
  });

  navHashLinks.forEach((link) => {
    link.classList.toggle('active', currentId && link.getAttribute('href') === `#${currentId}`);
  });

  if (currentId) {
    const activeLink = navLinksWrap?.querySelector(`a[href="#${currentId}"]`);
    if (activeLink) moveNavIndicator(activeLink);
  }
};

const updateProgress = () => {
  if (!progress) return;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const value = total > 0 ? (window.scrollY / total) * 100 : 0;
  progress.style.width = `${value}%`;
};

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 8);
};

const moveOrbs = () => {
  if (orbOne) {
    orbOne.style.transform = `translateY(${window.scrollY * 0.06}px)`;
  }
  if (orbTwo) {
    orbTwo.style.transform = `translateY(${-window.scrollY * 0.04}px)`;
  }
};

const closeMenu = () => {
  navLinksWrap?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
};

const smoothToSection = (id) => {
  if (!id) return;
  const target = document.querySelector(id);
  if (!(target instanceof HTMLElement)) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 92;
  window.scrollTo({ top, behavior: 'smooth' });
};

const initAiGrid = () => {
  if (!(aiGrid instanceof HTMLCanvasElement)) return;
  const ctx = aiGrid.getContext('2d');
  if (!ctx) return;

  const resize = () => {
    aiGrid.width = window.innerWidth;
    aiGrid.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const points = Array.from({ length: 45 }, () => ({
    x: Math.random() * aiGrid.width,
    y: Math.random() * aiGrid.height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35
  }));

  const draw = () => {
    ctx.clearRect(0, 0, aiGrid.width, aiGrid.height);
    ctx.fillStyle = 'rgba(240,207,122,0.38)';

    for (let i = 0; i < points.length; i += 1) {
      const p = points[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > aiGrid.width) p.vx *= -1;
      if (p.y < 0 || p.y > aiGrid.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < points.length; j += 1) {
        const q = points[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(212,175,55,${(120 - dist) / 620})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    window.requestAnimationFrame(draw);
  };

  draw();
};

const initEnergyField = () => {
  if (!(energyField instanceof HTMLCanvasElement)) return;
  const ctx = energyField.getContext('2d');
  if (!ctx) return;

  const resize = () => {
    energyField.width = window.innerWidth;
    energyField.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const sparks = Array.from({ length: 70 }, () => ({
    x: Math.random() * energyField.width,
    y: Math.random() * energyField.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: -(Math.random() * 0.7 + 0.2),
    life: Math.random() * 1
  }));

  const bolts = [];
  let lastBolt = 0;

  const createBolt = () => {
    const startX = energyField.width * (0.62 + Math.random() * 0.32);
    const startY = -20;
    const segments = 8 + Math.floor(Math.random() * 6);
    const points = [{ x: startX, y: startY }];
    let x = startX;
    let y = startY;
    for (let i = 0; i < segments; i += 1) {
      x += (Math.random() - 0.5) * 44;
      y += 28 + Math.random() * 30;
      points.push({ x, y });
    }
    bolts.push({ points, life: 1 });
  };

  const draw = (time) => {
    ctx.clearRect(0, 0, energyField.width, energyField.height);

    sparks.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.005;

      if (p.y < -10 || p.life <= 0) {
        p.x = Math.random() * energyField.width;
        p.y = energyField.height + Math.random() * 30;
        p.vx = (Math.random() - 0.5) * 0.6;
        p.vy = -(Math.random() * 0.8 + 0.25);
        p.life = 1;
      }

      const alpha = Math.max(0.12, p.life);
      ctx.beginPath();
      ctx.fillStyle = `rgba(198,150,74,${alpha * 0.42})`;
      ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    });

    if (time - lastBolt > 900 + Math.random() * 800) {
      createBolt();
      lastBolt = time;
    }

    for (let i = bolts.length - 1; i >= 0; i -= 1) {
      const bolt = bolts[i];
      bolt.life -= 0.05;
      if (bolt.life <= 0) {
        bolts.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      bolt.points.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = `rgba(240,207,122,${bolt.life * 0.56})`;
      ctx.lineWidth = 1.6;
      ctx.shadowColor = 'rgba(212,175,55,0.44)';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    window.requestAnimationFrame(draw);
  };

  window.requestAnimationFrame(draw);
};

const initIntroStrike = () => {
  if (!(introStrike instanceof HTMLCanvasElement) || !(introTitle instanceof HTMLElement) || !introScreen) return;
  const ctx = introStrike.getContext('2d');
  if (!ctx) return;

  const resize = () => {
    introStrike.width = window.innerWidth;
    introStrike.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const embers = Array.from({ length: 40 }, () => ({
    x: 0,
    y: 0,
    vx: (Math.random() - 0.5) * 0.6,
    vy: -(Math.random() * 0.9 + 0.35),
    life: Math.random()
  }));

  const resetEmber = (p, rect) => {
    p.x = rect.left + Math.random() * rect.width;
    p.y = rect.bottom - 8 + Math.random() * 6;
    p.vx = (Math.random() - 0.5) * 0.7;
    p.vy = -(Math.random() * 1 + 0.4);
    p.life = 1;
  };

  const bolts = [];
  let lastBolt = 0;

  const createIntroBolt = (rect) => {
    const targetX = rect.left + rect.width * (0.15 + Math.random() * 0.7);
    const targetY = rect.top + rect.height * (0.22 + Math.random() * 0.52);
    const segments = 7 + Math.floor(Math.random() * 4);
    let x = targetX + (Math.random() - 0.5) * 150;
    let y = -20;
    const points = [{ x, y }];

    for (let i = 0; i < segments; i += 1) {
      x += (targetX - x) * 0.32 + (Math.random() - 0.5) * 28;
      y += ((targetY - y) / (segments - i + 1)) + 18 + Math.random() * 10;
      points.push({ x, y });
    }
    points.push({ x: targetX, y: targetY });
    bolts.push({ points, life: 1 });
  };

  const draw = (time) => {
    if (!introFxActive || introScreen.classList.contains('is-hidden')) {
      ctx.clearRect(0, 0, introStrike.width, introStrike.height);
      return;
    }

    ctx.clearRect(0, 0, introStrike.width, introStrike.height);
    const rect = introTitle.getBoundingClientRect();

    embers.forEach((p) => {
      if (p.life <= 0 || p.y < rect.top - 70 || p.x < rect.left - 25 || p.x > rect.right + 25) {
        resetEmber(p, rect);
      }

      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.025;

      const alpha = Math.max(0, p.life) * 0.46;
      ctx.beginPath();
      ctx.fillStyle = `rgba(205,159,85,${alpha})`;
      ctx.arc(p.x, p.y, 1.25, 0, Math.PI * 2);
      ctx.fill();
    });

    if (time - lastBolt > 260 + Math.random() * 520) {
      createIntroBolt(rect);
      lastBolt = time;
    }

    for (let i = bolts.length - 1; i >= 0; i -= 1) {
      const bolt = bolts[i];
      bolt.life -= 0.07;
      if (bolt.life <= 0) {
        bolts.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      bolt.points.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = `rgba(240,207,122,${bolt.life * 0.62})`;
      ctx.lineWidth = 1.4;
      ctx.shadowColor = 'rgba(212,175,55,0.5)';
      ctx.shadowBlur = 9;
      ctx.stroke();
      ctx.shadowBlur = 0;

      const hit = bolt.points[bolt.points.length - 1];
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,229,173,${bolt.life * 0.36})`;
      ctx.arc(hit.x, hit.y, 4.2, 0, Math.PI * 2);
      ctx.fill();
    }

    window.requestAnimationFrame(draw);
  };

  embers.forEach((p) => resetEmber(p, introTitle.getBoundingClientRect()));
  window.requestAnimationFrame(draw);
};

const initTilt = () => {
  tiltItems.forEach((item) => {
    item.addEventListener('mousemove', (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -8;
      const ry = ((x / rect.width) - 0.5) * 8;
      item.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });
};

const initHeroParallax = () => {
  if (!hero || depthLayers.length === 0) return;

  hero.addEventListener('mousemove', (event) => {
    const rect = hero.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) - 0.5;
    const py = ((event.clientY - rect.top) / rect.height) - 0.5;

    depthLayers.forEach((layer, idx) => {
      const speed = (idx + 1) * 12;
      const tx = px * speed;
      const ty = py * speed;
      layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    depthLayers.forEach((layer) => {
      layer.style.transform = '';
    });
  });
};

const initRobotScene = () => {
  if (!(robotScene instanceof HTMLElement)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const count = window.innerWidth < 760 ? 4 : 7;
  const robots = [];

  for (let i = 0; i < count; i += 1) {
    const robot = document.createElement('div');
    robot.className = 'robot-unit';
    robot.innerHTML = `
      <span class="robot-aura"></span>
      <span class="robot-body">
        <span class="robot-head">
          <span class="robot-eye"></span>
          <span class="robot-eye"></span>
        </span>
        <span class="robot-core"></span>
      </span>
      <span class="robot-arm left"></span>
      <span class="robot-arm right"></span>
    `;

    const unitSize = 62 + Math.random() * 52;
    const glow = 0.34 + Math.random() * 0.38;
    const hueShift = -10 + Math.random() * 24;
    robot.style.setProperty('--size', `${unitSize}px`);
    robot.style.setProperty('--glow', `${glow}`);
    robot.style.setProperty('--delay', `${Math.random() * 1.8}s`);
    robot.style.setProperty('--hue-shift', `${hueShift}deg`);
    robotScene.appendChild(robot);

    robots.push({
      el: robot,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.24,
      amp: 8 + Math.random() * 26,
      speed: 0.001 + Math.random() * 0.0015,
      phase: Math.random() * Math.PI * 2,
      depth: 0.56 + Math.random() * 0.68
    });
  }

  let targetX = 0;
  let targetY = 0;
  let pointerX = 0;
  let pointerY = 0;

  const handlePointer = (event) => {
    targetX = ((event.clientX / window.innerWidth) - 0.5) * 18;
    targetY = ((event.clientY / window.innerHeight) - 0.5) * 14;
  };

  window.addEventListener('pointermove', handlePointer, { passive: true });
  window.addEventListener('resize', () => {
    robots.forEach((bot) => {
      bot.x = Math.min(Math.max(bot.x, 24), window.innerWidth - 24);
      bot.y = Math.min(Math.max(bot.y, 24), window.innerHeight - 24);
    });
  });

  const animate = (time) => {
    pointerX += (targetX - pointerX) * 0.045;
    pointerY += (targetY - pointerY) * 0.045;

    robots.forEach((bot) => {
      bot.x += bot.vx;
      bot.y += bot.vy;

      if (bot.x < -90 || bot.x > window.innerWidth + 90) bot.vx *= -1;
      if (bot.y < -90 || bot.y > window.innerHeight + 90) bot.vy *= -1;

      const sway = Math.cos((time * bot.speed) + bot.phase) * bot.amp;
      const bob = Math.sin((time * bot.speed * 0.86) + bot.phase) * bot.amp * 0.62;
      const scrollParallax = window.scrollY * (0.015 * bot.depth);
      const tx = bot.x + sway + pointerX * bot.depth;
      const ty = bot.y + bob - scrollParallax + pointerY * bot.depth;
      const scale = 0.68 + (bot.depth * 0.42);
      const depth = Math.round(bot.depth * 70);
      bot.el.style.transform = `translate3d(${tx}px, ${ty}px, ${depth}px) scale(${scale})`;
    });

    window.requestAnimationFrame(animate);
  };

  window.requestAnimationFrame(animate);
};

const initAICore = () => {
  if (!(aiCore instanceof HTMLElement) || !(hero instanceof HTMLElement)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let targetTiltX = 0;
  let targetTiltY = 0;
  let targetShiftX = 0;
  let targetShiftY = 0;
  let tiltX = 0;
  let tiltY = 0;
  let shiftX = 0;
  let shiftY = 0;

  hero.addEventListener('mousemove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) - 0.5;
    const y = ((event.clientY - rect.top) / rect.height) - 0.5;
    targetTiltX = y * -16;
    targetTiltY = x * 16;
    targetShiftX = x * 16;
    targetShiftY = y * 16;
  });

  hero.addEventListener('mouseleave', () => {
    targetTiltX = 0;
    targetTiltY = 0;
    targetShiftX = 0;
    targetShiftY = 0;
  });

  const animate = () => {
    tiltX += (targetTiltX - tiltX) * 0.08;
    tiltY += (targetTiltY - tiltY) * 0.08;
    shiftX += (targetShiftX - shiftX) * 0.08;
    shiftY += (targetShiftY - shiftY) * 0.08;

    aiCore.style.setProperty('--core-tilt-x', `${tiltX.toFixed(2)}deg`);
    aiCore.style.setProperty('--core-tilt-y', `${tiltY.toFixed(2)}deg`);
    aiCore.style.setProperty('--core-shift-x', `${shiftX.toFixed(2)}px`);
    aiCore.style.setProperty('--core-shift-y', `${shiftY.toFixed(2)}px`);

    window.requestAnimationFrame(animate);
  };

  window.requestAnimationFrame(animate);
};

const initInteractiveCurtain = () => {
  if (!(introScreen instanceof HTMLElement)) return;
  if (!(curtainWingLeft instanceof HTMLElement) || !(curtainWingRight instanceof HTMLElement)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (introHidden) return;

  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  const segments = 12;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const buildLeftClip = (time, px, py, progress) => {
    const points = ['0% 0%'];
    const openness = 1 - (progress * 0.45);
    for (let i = 0; i <= segments; i += 1) {
      const y = (i / segments) * 100;
      const waveA = Math.sin((time * 0.0022) + (i * 0.92)) * 2.4 * openness;
      const waveB = Math.cos((time * 0.0031) + (i * 1.34) + 0.8) * 1.7;
      const local = 1 - Math.min(Math.abs((py * 30) - (y - 50)) / 50, 1);
      const interact = (px * 2.8 * local) + (py * ((y - 50) / 50) * 1.15);
      const x = clamp(93.6 + waveA + waveB + interact, 84.5, 99.5);
      points.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
    }
    points.push('0% 100%');
    return `polygon(${points.join(',')})`;
  };

  const buildRightClip = (time, px, py, progress) => {
    const points = ['100% 0%'];
    const openness = 1 - (progress * 0.45);
    for (let i = 0; i <= segments; i += 1) {
      const y = (i / segments) * 100;
      const waveA = Math.sin((time * 0.0022) + (i * 0.92) + 1.25) * 2.4 * openness;
      const waveB = Math.cos((time * 0.0031) + (i * 1.34) + 2.1) * 1.7;
      const local = 1 - Math.min(Math.abs((py * 30) - (y - 50)) / 50, 1);
      const interact = (-px * 2.8 * local) + (py * ((y - 50) / 50) * 1.15);
      const x = clamp(6.4 - waveA - waveB + interact, 0.5, 15.5);
      points.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
    }
    points.push('100% 100%');
    return `polygon(${points.join(',')})`;
  };

  const handlePointerMove = (event) => {
    const rect = introScreen.getBoundingClientRect();
    targetX = (((event.clientX - rect.left) / rect.width) - 0.5) * 2;
    targetY = (((event.clientY - rect.top) / rect.height) - 0.5) * 2;
  };

  const handlePointerLeave = () => {
    targetX = 0;
    targetY = 0;
  };

  introScreen.addEventListener('pointermove', handlePointerMove, { passive: true });
  introScreen.addEventListener('pointerleave', handlePointerLeave, { passive: true });

  const animate = (time) => {
    if (introHidden || introScreen.classList.contains('is-hidden')) return;

    pointerX += (targetX - pointerX) * 0.08;
    pointerY += (targetY - pointerY) * 0.08;
    const progress = introCurtainOpenedAt > 0
      ? Math.min((time - introCurtainOpenedAt) / 5200, 1)
      : 0;

    curtainWingLeft.style.clipPath = buildLeftClip(time, pointerX, pointerY, progress);
    curtainWingRight.style.clipPath = buildRightClip(time, pointerX, pointerY, progress);

    if (introFireCurtain instanceof HTMLElement) {
      introFireCurtain.style.transform = `perspective(1100px) rotateX(${(pointerY * -1.5).toFixed(2)}deg) rotateY(${(pointerX * 2.2).toFixed(2)}deg)`;
    }

    window.requestAnimationFrame(animate);
  };

  window.requestAnimationFrame(animate);
};

const queueIntroTimer = (callback, delay) => {
  const id = window.setTimeout(() => {
    introTimers = introTimers.filter((timer) => timer !== id);
    callback();
  }, delay);
  introTimers.push(id);
  return id;
};

const clearIntroTimers = () => {
  introTimers.forEach((id) => window.clearTimeout(id));
  introTimers = [];
};

const startIntroTyping = () => {
  if (!(introTyped instanceof HTMLElement)) {
    queueIntroTimer(hideIntro, 2400);
    return;
  }
  const text = 'Welcome To My AI Portfolio';
  let cursor = 0;
  introTyped.textContent = '';
  introTitle?.classList.remove('done');

  const tick = () => {
    if (introHidden) return;
    cursor += 1;
    introTyped.textContent = text.slice(0, cursor);
    if (cursor < text.length) {
      queueIntroTimer(tick, 40 + Math.floor(Math.random() * 26));
      return;
    }
    introTitle?.classList.add('done');
    introSubtitle?.classList.add('show');
    queueIntroTimer(hideIntro, 1450);
  };

  queueIntroTimer(tick, 160);
};

const runIntroSequence = () => {
  if (!introScreen || introHidden) return;
  introCurtainOpenedAt = performance.now();
  introScreen.classList.add('curtain-open');
  introSubtitle?.classList.remove('show');
  queueIntroTimer(startIntroTyping, 2400);
};

const hideIntro = () => {
  if (!introScreen || introHidden) return;
  introHidden = true;
  clearIntroTimers();
  introFxActive = false;
  introScreen.classList.add('intro-end');
  window.setTimeout(() => {
    introScreen.classList.add('is-hidden');
  }, 260);
  document.body.classList.remove('intro-lock');
  sessionStorage.setItem('portfolio_intro_seen', '1');
  if (introVideo) {
    introVideo.pause();
  }
};

if (introScreen) {
  const seenIntro = sessionStorage.getItem('portfolio_intro_seen') === '1';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (seenIntro || reducedMotion) {
    introHidden = true;
    introFxActive = false;
    introScreen.classList.add('is-hidden');
  } else {
    document.body.classList.add('intro-lock');
    runIntroSequence();
  }

  introSkip?.addEventListener('click', hideIntro);
}

if (introSoundButton) {
  introSoundButton.addEventListener('click', () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    const master = audioCtx.createGain();
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1300, now);
    lowpass.frequency.exponentialRampToValueAtTime(2600, now + 1.2);

    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.14, now + 0.12);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    lowpass.connect(master);
    master.connect(audioCtx.destination);

    const pad = audioCtx.createOscillator();
    const rise = audioCtx.createOscillator();
    const sparkle = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    pad.type = 'sine';
    rise.type = 'triangle';
    sparkle.type = 'sawtooth';

    pad.frequency.setValueAtTime(130, now);
    pad.frequency.exponentialRampToValueAtTime(220, now + 1.1);
    rise.frequency.setValueAtTime(220, now);
    rise.frequency.exponentialRampToValueAtTime(780, now + 1.2);
    sparkle.frequency.setValueAtTime(660, now + 0.15);
    sparkle.frequency.exponentialRampToValueAtTime(1240, now + 0.85);

    pad.connect(gain);
    rise.connect(gain);
    sparkle.connect(gain);
    gain.connect(lowpass);

    pad.start(now);
    rise.start(now);
    sparkle.start(now + 0.1);
    pad.stop(now + 1.6);
    rise.stop(now + 1.5);
    sparkle.stop(now + 1.2);
    introSoundButton.classList.add('is-on');
    introSoundButton.textContent = 'Sound Enabled';
  });
}

window.addEventListener('scroll', () => {
  updateHeader();
  updateActiveSection();
  updateProgress();
  moveOrbs();
});

navAllLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href') || '';
    const isModified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    if (isModified) return;

    if (href.startsWith('#')) {
      event.preventDefault();
      smoothToSection(href);
      link.classList.add('active');
      moveNavIndicator(link);
    } else if (href && !href.startsWith('mailto:') && !href.startsWith('http')) {
      document.body.classList.add('page-leave');
      event.preventDefault();
      window.setTimeout(() => {
        window.location.href = href;
      }, 180);
    }

    closeMenu();
  });
});

navToggle?.addEventListener('click', () => {
  const isOpen = navLinksWrap?.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

document.addEventListener('click', (event) => {
  if (!navLinksWrap || !navToggle) return;
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (!navLinksWrap.contains(target) && !navToggle.contains(target)) {
    closeMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

if (contactForm) {
  let emailJsReady = false;
  const serviceId = String(contactForm.dataset.emailjsService || '').trim();
  const templateId = String(contactForm.dataset.emailjsTemplate || '').trim();
  const publicKey = String(contactForm.dataset.emailjsPublic || '').trim();

  if (typeof window.emailjs !== 'undefined' && serviceId && templateId && publicKey && !publicKey.includes('YOUR_EMAILJS_PUBLIC_KEY')) {
    window.emailjs.init({ publicKey });
    emailJsReady = true;
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const fullName = String(formData.get('fullName') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const service = String(formData.get('service') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!fullName || !email || !service || !message) {
      if (formStatus) formStatus.textContent = 'Please fill in all fields.';
      return;
    }

    const subjectPlain = `Project Request - ${service}`;
    const bodyPlain = `Name: ${fullName}\nEmail: ${email}\nService: ${service}\n\nProject Brief:\n${message}`;
    const mailtoUrl = `mailto:askasem76@gmail.com?subject=${encodeURIComponent(subjectPlain)}&body=${encodeURIComponent(bodyPlain)}`;

    const sendViaFormSubmit = async () => {
      const response = await fetch('https://formsubmit.co/ajax/askasem76@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: fullName,
          email,
          message: bodyPlain,
          _subject: subjectPlain,
          _captcha: 'false'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const isSuccess = result.success === true || result.success === 'true';
      if (!isSuccess) {
        const msg = String(result.message || 'Form service rejected the request.');
        if (msg.toLowerCase().includes('activation')) {
          const activationError = new Error('FORM_ACTIVATION_REQUIRED');
          activationError.name = 'FormActivationRequired';
          throw activationError;
        }
        throw new Error(msg);
      }
    };

    if (formStatus) {
      formStatus.textContent = 'Sending your request...';
    }

    try {
      if (emailJsReady) {
        try {
          await window.emailjs.send(serviceId, templateId, {
            from_name: fullName,
            reply_to: email,
            requester_email: email,
            service_name: service,
            message,
            subject: subjectPlain,
            body: bodyPlain,
            to_email: 'askasem76@gmail.com'
          });
        } catch (emailJsError) {
          await sendViaFormSubmit();
        }
      } else {
        await sendViaFormSubmit();
      }

      if (formStatus) {
        formStatus.textContent = 'Sent successfully. I will reply to you soon.';
      }
      contactForm.reset();
    } catch (error) {
      if (formStatus) {
        if (error instanceof Error && error.name === 'FormActivationRequired') {
          formStatus.innerHTML = 'First-time setup required: open Gmail for <strong>askasem76@gmail.com</strong> and click the FormSubmit activation link (check Spam too), then send again.';
          return;
        }
        const reason = error instanceof Error ? error.message : 'unknown error';
        formStatus.innerHTML = `Direct send failed (${reason}). <a href="${mailtoUrl}">Send using your mail app</a>.`;
      }
    }
  });
}

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const handleCrossPageHash = () => {
  const hash = window.location.hash;
  if (!hash) return;
  const target = document.querySelector(hash);
  if (!(target instanceof HTMLElement)) return;
  window.setTimeout(() => {
    smoothToSection(hash);
    const active = navLinksWrap?.querySelector(`a[href="${hash}"]`);
    if (active instanceof HTMLElement) {
      active.classList.add('active');
      moveNavIndicator(active);
    }
  }, 120);
};

updateHeader();
updateActiveSection();
updateProgress();
initAiGrid();
initEnergyField();
initIntroStrike();
initInteractiveCurtain();
initTilt();
initHeroParallax();
initRobotScene();
initAICore();
handleCrossPageHash();

const initialActive = navLinksWrap?.querySelector('a.active') || navLinksWrap?.querySelector('a[href="#about"]');
if (initialActive instanceof HTMLElement) {
  moveNavIndicator(initialActive);
}

window.addEventListener('resize', () => {
  const active = navLinksWrap?.querySelector('a.active');
  if (active instanceof HTMLElement) {
    moveNavIndicator(active);
  }
});
