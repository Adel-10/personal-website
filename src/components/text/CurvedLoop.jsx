import { useEffect, useMemo, useRef, useState } from 'react';

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// React Bits "Curved Loop" (dependency-free port): marquee text flowing along
// a curved SVG path; drag it to shove it in either direction.
export default function CurvedLoop({
  marqueeText = '',
  speed = 1.6,
  curveAmount = 120,
  className = ''
}) {
  const text = useMemo(() => marqueeText.replace(/\s+$/, '') + ' ', [marqueeText]);
  const measureRef = useRef(null);
  const tpRef = useRef(null);
  const [spacing, setSpacing] = useState(0);
  const offsetRef = useRef(0);
  const dirRef = useRef(-Math.abs(speed));
  const dragRef = useRef({ on: false, x: 0, lastDx: 0 });
  const id = useMemo(() => `cl-${Math.random().toString(36).slice(2)}`, []);
  const pathD = `M-100,60 Q720,${60 + curveAmount} 1540,60`;

  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
  }, [text]);

  useEffect(() => {
    if (!spacing || REDUCED) return;
    let raf;
    const tick = () => {
      if (!dragRef.current.on) offsetRef.current += dirRef.current;
      let o = offsetRef.current % spacing;
      if (o > 0) o -= spacing;
      tpRef.current?.setAttribute('startOffset', `${o}px`);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [spacing]);

  const repeats = spacing ? Math.ceil(2000 / spacing) + 2 : 1;

  function onDown(e) {
    dragRef.current = { on: true, x: e.clientX, lastDx: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onMove(e) {
    const d = dragRef.current;
    if (!d.on) return;
    const dx = e.clientX - d.x;
    d.x = e.clientX;
    d.lastDx = dx || d.lastDx;
    offsetRef.current += dx;
    let o = offsetRef.current % spacing;
    if (o > 0) o -= spacing;
    tpRef.current?.setAttribute('startOffset', `${o}px`);
  }
  function onUp() {
    const d = dragRef.current;
    d.on = false;
    dirRef.current = d.lastDx > 0 ? Math.abs(speed) : -Math.abs(speed);
  }

  return (
    <div className={`curved-loop ${className}`} aria-label={marqueeText}>
      <svg
        className="curved-loop-svg"
        viewBox="0 0 1440 260"
        onPointerDown={REDUCED ? undefined : onDown}
        onPointerMove={REDUCED ? undefined : onMove}
        onPointerUp={REDUCED ? undefined : onUp}
        onPointerCancel={REDUCED ? undefined : onUp}
      >
        <text ref={measureRef} xmlSpace="preserve" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
          {text}
        </text>
        <defs>
          <path id={id} d={pathD} fill="none" />
        </defs>
        {spacing > 0 && (
          <text xmlSpace="preserve" className="cl-text">
            <textPath ref={tpRef} href={`#${id}`} startOffset="0" xmlSpace="preserve">
              {Array(repeats).fill(text).join('')}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
}
