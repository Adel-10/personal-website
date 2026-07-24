import { useEffect } from 'react';
import { CANDLES } from '../data/tools.js';

// Magic UI "Cool Mode", ported and adapted: instead of wrapping every button,
// one delegated listener applies the particle spray to all body buttons/pills
// (selector list below). Navbar and title-block controls are deliberately
// excluded. Particles are candle-colored circles; physics is the original's.
const SELECTORS = [
  '.quick-links a',
  '.project .links a',
  '.rail button',
  '.xp-cta',
  '.contact-links a',
  '.stree-proof a',
  '.stree-cta a'
].join(', ');

const SIZES = [10, 14, 18, 24, 30];
const LIMIT = 45;
const GEN_DELAY = 30; // ms between particles while held

export default function CoolModeZone() {
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const container = document.createElement('div');
    container.id = '_coolMode_effect';
    container.setAttribute(
      'style',
      'overflow:hidden;position:fixed;inset:0;pointer-events:none;z-index:9999'
    );
    document.body.appendChild(container);

    let particles = [];
    let auto = false;
    let mouseX = 0, mouseY = 0;
    let raf, last = 0;

    function generate() {
      const size = SIZES[(Math.random() * SIZES.length) | 0];
      const el = document.createElement('div');
      el.innerHTML =
        `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" ` +
        `fill="${CANDLES[(Math.random() * CANDLES.length) | 0]}"/></svg>`;
      container.appendChild(el);
      particles.push({
        el,
        left: mouseX - size / 2,
        top: mouseY - size / 2,
        size,
        direction: Math.random() <= 0.5 ? -1 : 1,
        speedHorz: Math.random() * 10,
        speedUp: Math.random() * 25,
        spinVal: Math.random() * 360,
        spinSpeed: Math.random() * 35 * (Math.random() <= 0.5 ? -1 : 1)
      });
    }

    function refresh() {
      particles = particles.filter(p => {
        p.left -= p.speedHorz * p.direction;
        p.top -= p.speedUp;
        p.speedUp = Math.min(p.size, p.speedUp - 1);
        p.spinVal += p.spinSpeed;
        if (p.top >= Math.max(window.innerHeight, document.body.clientHeight) + p.size) {
          p.el.remove();
          return false;
        }
        p.el.setAttribute(
          'style',
          `position:absolute;will-change:transform;top:${p.top}px;left:${p.left}px;transform:rotate(${p.spinVal}deg)`
        );
        return true;
      });
    }

    function loop() {
      const now = performance.now();
      if (auto && particles.length < LIMIT && now - last > GEN_DELAY) {
        generate();
        last = now;
      }
      refresh();
      raf = requestAnimationFrame(loop);
    }
    loop();

    const down = e => {
      if (!e.target.closest || !e.target.closest(SELECTORS)) return;
      mouseX = e.clientX; mouseY = e.clientY;
      auto = true;
    };
    const move = e => { if (auto) { mouseX = e.clientX; mouseY = e.clientY; } };
    const up = () => { auto = false; };

    document.addEventListener('pointerdown', down, { passive: true });
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerup', up, { passive: true });
    document.addEventListener('pointercancel', up, { passive: true });

    return () => {
      document.removeEventListener('pointerdown', down);
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', up);
      cancelAnimationFrame(raf);
      container.remove();
    };
  }, []);
  return null;
}
