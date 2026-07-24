import { lazy, Suspense, useMemo } from 'react';
import { TOOLS, CANDLES } from '../data/tools.js';

// Infinite Menu pulls in gl-matrix + a WebGL2 scene — code-split it.
const InfiniteMenu = lazy(() => import('./backgrounds/InfiniteMenu/InfiniteMenu.jsx'));

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// draw one tool as a candle-colored disc badge (data URL → texture atlas)
function discImage(label, color) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = color;
  x.fillRect(0, 0, 512, 512);
  x.strokeStyle = 'rgba(255,255,255,.55)';
  x.lineWidth = 10;
  x.beginPath(); x.arc(256, 256, 216, 0, Math.PI * 2); x.stroke();

  x.fillStyle = '#ffffff';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  const words = label.split(' ');
  let lines = [label];
  if (label.length > 12 && words.length > 1) {
    const mid = Math.ceil(words.length / 2);
    lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  } else if (label.length > 14 && label.includes('-')) {
    const i = label.indexOf('-');
    lines = [label.slice(0, i + 1), label.slice(i + 1)];
  }
  const size = Math.min(88, Math.floor(560 / Math.max(...lines.map(l => l.length)) * 1.6));
  x.font = `700 ${size}px -apple-system, "Segoe UI", Arial, sans-serif`;
  lines.forEach((l, i) => x.fillText(l, 256, 256 + (i - (lines.length - 1) / 2) * size * 1.15));
  return c.toDataURL('image/png');
}

export default function ToolSphere() {
  const items = useMemo(
    () =>
      TOOLS.map((t, i) => ({
        image: discImage(t, CANDLES[i % CANDLES.length]),
        link: '/projects',
        title: t,
        description: 'used in shipped projects'
      })),
    []
  );

  if (REDUCED) return null; // the skill tree already lists everything

  return (
    <section className="tool-sphere-section">
      <div className="wrap">
        <div className="sec-tag reveal">Toolbox</div>
        <h2 className="reveal">Spin the toolbox</h2>
        <p className="sec-sub reveal">
          Every disc is a tool used in a real project — drag the sphere, it never ends.
        </p>
      </div>
      <div className="wrap">
        <div className="tool-sphere reveal">
          <Suspense fallback={null}>
            <InfiniteMenu items={items} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
