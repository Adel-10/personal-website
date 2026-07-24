import { useMemo } from 'react';
import { CANDLES } from '../data/tools.js';

// Magic UI "Warp Background", ported from Tailwind + framer-motion to plain
// CSS (container-query units + CSS keyframes — beams are simple infinite
// linear travels, no JS animation needed). Beam colors: candles, not random hues.
export default function WarpBackground({
  children,
  beamsPerSide = 3,
  beamSize = 5,       // % of a side
  beamDuration = 3,   // s
  beamDelayMax = 3,   // s
  className = ''
}) {
  const sides = useMemo(() => {
    const make = () =>
      Array.from({ length: beamsPerSide }, (_, i) => ({
        x: Math.floor(i * (Math.floor(100 / beamSize) / beamsPerSide)) * beamSize,
        delay: Math.random() * beamDelayMax,
        ar: Math.floor(Math.random() * 10) + 1,
        color: CANDLES[(Math.random() * CANDLES.length) | 0]
      }));
    return ['top', 'bottom', 'left', 'right'].map(side => ({ side, beams: make() }));
  }, [beamsPerSide, beamSize, beamDelayMax]);

  return (
    <div className={`warp-card ${className}`} style={{ '--beam-size': `${beamSize}%` }}>
      <div className="warp-bg" aria-hidden="true">
        {sides.map(({ side, beams }) => (
          <div key={side} className={`warp-side warp-${side}`}>
            {beams.map((b, i) => (
              <span
                key={i}
                className="warp-beam"
                style={{
                  '--x': `${b.x}%`,
                  '--ar': b.ar,
                  '--dur': `${beamDuration}s`,
                  '--delay': `${b.delay}s`,
                  '--beam-color': b.color
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="warp-content">{children}</div>
    </div>
  );
}
