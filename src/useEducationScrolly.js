import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import burstConfetti from './confetti.js';

gsap.registerPlugin(ScrollTrigger);

// Education scrollytelling: the timeline line draws itself, year stamps pop,
// milestone cards rise, counters count, and reaching "first-class with
// distinction" earns a confetti burst. The lanyard stays pinned alongside (CSS sticky).
export default function useEducationScrolly(ref) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const compact = window.matchMedia('(max-width: 640px)').matches;
      // 1. the line draws as you descend
      const fill = q('.edu-line-fill')[0];
      const story = q('.edu-story')[0];
      if (fill && story) {
        gsap.fromTo(fill, { scaleY: 0 }, {
          scaleY: 1, ease: 'none', transformOrigin: 'top',
          scrollTrigger: { trigger: story, start: 'top 70%', end: 'bottom 65%', scrub: true }
        });
      }

      // 2. milestones: year stamp pops, card rises
      q('.milestone').forEach(ms => {
        const year = ms.querySelector('.ms-year');
        const body = ms.querySelector('.ms-body');
        if (year) {
          gsap.from(year, {
            // A 1.7x centered scale made the phone layout visually wider than
            // the viewport. Phones get a short lateral pop instead.
            ...(compact ? { x: -18 } : { scale: 1.7, transformOrigin: 'left center' }),
            opacity: 0, duration: 0.6, ease: 'back.out(1.7)',
            scrollTrigger: { trigger: ms, start: 'top 78%', toggleActions: 'play none none reverse' }
          });
        }
        if (body) {
          gsap.from(body, {
            y: 46, opacity: 0, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: ms, start: 'top 74%', toggleActions: 'play none none reverse' }
          });
        }
      });

      // 3. counters (same contract as the projects page: final value in markup)
      q('.bigstat .num').forEach(el => {
        const target = parseFloat(el.dataset.count);
        if (Number.isNaN(target)) return;
        const dec = +(el.dataset.decimals || 0);
        const pre = el.dataset.prefix || '';
        const suf = el.dataset.suffix || '';
        const finalText = el.textContent;
        const st = { v: 0 };
        el.textContent = pre + (0).toFixed(dec) + suf;
        gsap.to(st, {
          v: target, duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => { el.textContent = pre + st.v.toFixed(dec) + suf; },
          onComplete: () => { el.textContent = finalText; }
        });
      });

      // 4. confetti when the first-class milestone lands
      const party = q('.ms-confetti')[0];
      let cleanupBurst;
      if (party) {
        ScrollTrigger.create({
          trigger: party, start: 'top 62%', once: true,
          onEnter: () => { cleanupBurst = burstConfetti(party); }
        });
      }
      return () => cleanupBurst && cleanupBurst();
    });

    return () => mm.revert();
  }, [ref]);
}
