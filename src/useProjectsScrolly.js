import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText'; // free since gsap 3.13

gsap.registerPlugin(ScrollTrigger, SplitText);

// Scrollytelling for the Projects page:
//   1. the title block pins and fades while the first project slides over it
//   2. each project card rises in, scrubbed to scroll position
//   3. figures / tables / code blocks get a lighter parallax scrub
//   4. .bigstat numbers count up from 0 when they enter the viewport
//   5. the fixed side rail tracks overall progress + the active project
//
// Everything is created inside a prefers-reduced-motion matchMedia branch and
// fully reverted on unmount (route change), so other pages are never affected.
export default function useProjectsScrolly(ref) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const splits = [];

      // --- 1. chapter scenes: pinned full-viewport intros, scrubbed ---
      // (the title-block pin itself now lives in PageHeader, shared by all pages)
      q('.chapter').forEach(ch => {
        const wrapEl = ch.querySelector('.wrap');
        const num = ch.querySelector('.ch-num');
        const title = ch.querySelector('.ch-title');
        const kicker = ch.querySelector('.ch-kicker');
        // Keep each word as one wrapping unit while retaining per-character animation.
        const split = new SplitText(title, { type: 'words,chars', wordsClass: 'ch-word' });
        splits.push(split);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ch, start: 'top top', end: '+=110%', pin: true, scrub: true }
        });
        tl.from(num, { yPercent: 45, opacity: 0, ease: 'power2.out', duration: 0.3 }, 0)
          .from(split.chars, {
            yPercent: 130, stagger: { each: 0.02 }, ease: 'power3.out', duration: 0.4
          }, 0.05)
          .from(kicker, { y: 40, opacity: 0, duration: 0.25 }, 0.4)
          .to(wrapEl, { scale: 0.92, opacity: 0, ease: 'power1.in', duration: 0.3 }, 0.72);
      });

      // --- 2 + 3. project card scenes ---
      q('.project-section').forEach(sec => {
        const wrapEl = sec.querySelector('.wrap');
        if (wrapEl) {
          gsap.from(wrapEl, {
            y: 90, opacity: 0, scale: 0.965, transformOrigin: '50% 100%', ease: 'none',
            scrollTrigger: { trigger: sec, start: 'top 88%', end: 'top 42%', scrub: true }
          });
        }
        sec.querySelectorAll('pre, .tablewrap, figure').forEach(el => {
          gsap.from(el, {
            y: 36, opacity: 0.25, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 60%', scrub: true }
          });
        });
      });

      // --- 4. stat counters (markup holds the final value; we zero it here so
      //         reduced-motion users simply see the real numbers) ---
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
          v: target, duration: 1.6, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => { el.textContent = pre + st.v.toFixed(dec) + suf; },
          onComplete: () => { el.textContent = finalText; }
        });
      });

      // --- 5. progress rail ---
      const bar = q('.rail-bar')[0];
      if (bar) {
        gsap.to(bar, {
          scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: true }
        });
      }
      // active region spans each project's chapter intro + its card section
      const chapters = q('.chapter');
      q('.rail button').forEach((btn, i) => {
        const sec = document.getElementById(btn.dataset.rail);
        if (!sec) return;
        ScrollTrigger.create({
          trigger: chapters[i] || sec, start: 'top 55%',
          endTrigger: sec, end: 'bottom 55%',
          onToggle: self => btn.classList.toggle('active', self.isActive)
        });
      });

      return () => splits.forEach(s => s.revert());
    });

    // lazy images change layout height when they arrive → re-measure triggers
    const imgs = Array.from(root.querySelectorAll('img'));
    const onLoad = () => ScrollTrigger.refresh();
    imgs.forEach(img => { if (!img.complete) img.addEventListener('load', onLoad, { once: true }); });

    return () => {
      imgs.forEach(img => img.removeEventListener('load', onLoad));
      mm.revert();
    };
  }, [ref]);
}
