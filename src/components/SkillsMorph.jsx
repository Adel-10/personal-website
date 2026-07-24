import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Recreation of 21st.dev "Scroll Morph Hero" (its source was behind the daily
// retrieval paywall — behavior rebuilt from the component's description/preview):
// chips start scattered, morph into a circle, then fan into a scroll-driven
// rainbow arc. Pinned + scrubbed with gsap.
//
import { TOOLS } from '../data/tools.js';

const CAPTIONS = [
  'The toolbox — every chip below shipped a real project.',
  'One stack, end to end.',
  '…in every color.'
];

// deterministic pseudo-random in [0,1)
function hash(i) {
  const x = Math.sin(i * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export default function SkillsMorph() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const stage = el.querySelector('.morph-stage');
      const chips = el.querySelectorAll('.morph-chip');
      const caps = el.querySelectorAll('.morph-cap');
      const W = stage.clientWidth, H = stage.clientHeight;
      const n = chips.length;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top top', end: '+=250%', pin: true, scrub: true }
      });

      chips.forEach((chip, i) => {
        // phase 0 — scattered
        const sx = (hash(i + 1) - 0.5) * W * 0.85;
        const sy = (hash(i + 101) - 0.5) * H * 0.7;
        const srot = (hash(i + 201) - 0.5) * 40;
        // phase 1 — circle
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const r = Math.min(W, H) * 0.36;
        // phase 2 — rainbow arc (fan across the upper half)
        const t = n > 1 ? i / (n - 1) : 0;
        const aa = Math.PI * (1 - t);
        const ar = Math.min(W * 0.42, H * 0.55);

        gsap.set(chip, { xPercent: -50, yPercent: -50, x: sx, y: sy, rotation: srot, opacity: 0 });
        tl.to(chip, { opacity: 1, duration: 0.08 }, i * 0.005)
          .to(chip, {
            x: Math.cos(a) * r, y: Math.sin(a) * r, rotation: 0,
            duration: 0.3, ease: 'power2.inOut'
          }, 0.25 + i * 0.004)
          .to(chip, {
            x: Math.cos(aa) * ar,
            y: -Math.sin(aa) * ar + H * 0.28,
            rotation: (t - 0.5) * 60,
            backgroundColor: `hsla(${t * 300}, 85%, 55%, 0.14)`,
            borderColor: `hsla(${t * 300}, 80%, 48%, 0.75)`,
            color: `hsl(${t * 300}, 85%, 34%)`, // dark enough to read on off-white
            duration: 0.3, ease: 'power2.inOut'
          }, 0.62 + i * 0.004);
      });

      // captions per phase
      tl.to(caps[0], { opacity: 1, duration: 0.08 }, 0.02)
        .to(caps[0], { opacity: 0, duration: 0.08 }, 0.24)
        .to(caps[1], { opacity: 1, duration: 0.08 }, 0.36)
        .to(caps[1], { opacity: 0, duration: 0.08 }, 0.6)
        .to(caps[2], { opacity: 1, duration: 0.08 }, 0.78);
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="skills-morph" ref={ref}>
      <div className="morph-stage">
        {CAPTIONS.map(c => <p className="morph-cap" key={c}>{c}</p>)}
        {TOOLS.map(t => <span className="morph-chip" key={t}>{t}</span>)}
      </div>
    </section>
  );
}
