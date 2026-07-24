import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Ported from 21st.dev "Zoom Parallax" (@efferd/zoom-parallax): a 300vh section
// with a sticky viewport where up to 7 tiles zoom at different speeds as you
// scroll "through" them. Original used framer-motion + images; this port uses
// gsap (already a dep) and takes arbitrary React nodes as tiles.
const SCALES = [4, 5, 6, 5, 6, 8, 9];
// per-index tile geometry, translated from the original's Tailwind overrides
const POS = [
  { top: 0, left: 0, w: '25vw', h: '25vh' },
  { top: '-30vh', left: '5vw', w: '35vw', h: '30vh' },
  { top: '-10vh', left: '-25vw', w: '20vw', h: '45vh' },
  { top: 0, left: '27.5vw', w: '25vw', h: '25vh' },
  { top: '27.5vh', left: '5vw', w: '20vw', h: '25vh' },
  { top: '27.5vh', left: '-22.5vw', w: '30vw', h: '25vh' },
  { top: '22.5vh', left: '25vw', w: '15vw', h: '15vh' }
];

export default function ZoomParallax({ items }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      el.querySelectorAll('.zp-layer').forEach((layer, i) => {
        gsap.to(layer, {
          scale: SCALES[i % SCALES.length],
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: true }
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div className="zoom-parallax" ref={ref}>
      <div className="zp-sticky">
        {items.slice(0, 7).map((node, i) => {
          const p = POS[i];
          return (
            <div className="zp-layer" key={i}>
              <div
                className="zp-tile"
                style={{ top: p.top, left: p.left, width: p.w, height: p.h }}
              >
                {node}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
