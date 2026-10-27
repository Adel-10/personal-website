import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionBackground from './SectionBackground.jsx';

gsap.registerPlugin(ScrollTrigger);

// Banner block at the top of each routed page: tag + title + subtitle,
// with an optional animated React Bits background behind just this block.
// On scroll it pins briefly and shrinks/fades while the page content
// slides over it (skipped for reduced-motion users).
export default function PageHeader({ tag, title, titleLabel, sub, background }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      ScrollTrigger.create({
        trigger: el, start: 'top top', end: '+=45%',
        pin: true, pinSpacing: false
      });
      gsap.to(el.children, {
        opacity: 0, scale: 0.92, transformOrigin: '50% 30%', ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: '+=42%', scrub: true }
      });
    });
    return () => mm.revert();
  }, []);

  const cls = 'page-header' + (background ? ' has-bg' : '');
  return (
    <section className={cls} ref={ref}>
      {background && <SectionBackground kind={background} />}
      <div className="wrap">
        {tag && <div className="sec-tag reveal">{tag}</div>}
        <h1 className="reveal" aria-label={titleLabel}>{title}</h1>
        {sub && <p className="sec-sub reveal">{sub}</p>}
      </div>
    </section>
  );
}
