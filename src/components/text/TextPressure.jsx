import { useEffect, useRef } from 'react';

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// React Bits "Text Pressure" (port): a variable font whose weight/width react
// to cursor proximity per character. Roboto Flex is bundled locally from
// Fontsource so the CSP never needs a third-party font or an inline <style>.

export default function TextPressure({
  text = 'Text',
  accentFrom = -1, // chars from this index get the .tp-accent color
  minFontSize = 36,
  className = '',
  decorative = false
}) {
  const containerRef = useRef(null);
  const spansRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const chars = text.split('');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const setSize = () => {
      const { width } = container.getBoundingClientRect();
      const fs = Math.max(width / (chars.length / 1.9), minFontSize);
      container.style.fontSize = `${fs}px`;
      container.style.height = `${fs * 1.06}px`;
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    if (REDUCED) return () => ro.disconnect();

    const onMove = e => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    window.addEventListener('pointermove', onMove);
    const r = container.getBoundingClientRect();
    mouseRef.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    cursorRef.current = { ...mouseRef.current };

    let raf;
    const tick = () => {
      const m = mouseRef.current, c = cursorRef.current;
      m.x += (c.x - m.x) / 12;
      m.y += (c.y - m.y) / 12;
      const rect = container.getBoundingClientRect();
      const maxDist = rect.width / 2;
      spansRef.current.forEach(span => {
        if (!span) return;
        const sr = span.getBoundingClientRect();
        const d = Math.hypot(m.x - (sr.x + sr.width / 2), m.y - (sr.y + sr.height / 2));
        const p = Math.max(0, 1 - d / maxDist); // proximity 0..1
        const wght = Math.floor(100 + p * 800);
        const wdth = Math.floor(25 + p * 126);
        span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}`;
      });
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      ro.disconnect();
    };
  }, [text, minFontSize]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      className={`text-pressure ${className}`}
      aria-label={decorative ? undefined : text}
      aria-hidden={decorative || undefined}
    >
      {chars.map((ch, i) => (
        <span
          key={i}
          ref={el => { spansRef.current[i] = el; }}
          className={accentFrom >= 0 && i >= accentFrom ? 'tp-accent' : undefined}
          aria-hidden="true"
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </div>
  );
}
