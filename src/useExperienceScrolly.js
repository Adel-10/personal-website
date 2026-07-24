import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Experience scrollytelling: each .xp-pin section pins and vertical scroll
// drives a horizontal ride through its panels (the page has two rides —
// professional and leadership). Panel contents stagger in via
// containerAnimation triggers. Narrow screens / reduced motion: plain
// vertical stacks, no pin (CSS handles layout).
export default function useExperienceScrolly(ref) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
      q('.xp-pin').forEach(pinEl => {
        const track = pinEl.querySelector('.xp-track');
        if (!track) return;
        const dist = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: pinEl, start: 'top top',
            end: () => '+=' + dist(),
            pin: true, scrub: true, invalidateOnRefresh: true
          }
        });

        pinEl.querySelectorAll('.xp-panel').forEach(panel => {
          const bits = panel.querySelectorAll('.xp-li, .xp-big, .xp-chips, .xp-cta');
          if (!bits.length) return;
          gsap.from(bits, {
            y: 44, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out',
            scrollTrigger: {
              trigger: panel, containerAnimation: tween,
              start: 'left 65%', toggleActions: 'play none none reverse'
            }
          });
        });

        const hint = pinEl.querySelector('.xp-hint');
        if (hint) {
          gsap.to(hint, {
            opacity: 0, ease: 'none',
            scrollTrigger: { trigger: pinEl, start: 'top top', end: '+=400', scrub: true }
          });
        }
      });
    });

    return () => mm.revert();
  }, [ref]);
}
