import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';

// Each React Bits background is code-split into its own chunk and only mounted
// while its section is near the viewport (±25% margin) — so at most ~2 WebGL
// contexts are alive at any moment while scrolling.
const LiquidEther = lazy(() => import('./backgrounds/LiquidEther/LiquidEther.jsx'));
const GridScan = lazy(() => import('./backgrounds/GridScan/GridScan.jsx').then(m => ({ default: m.GridScan })));
const DotGrid = lazy(() => import('./backgrounds/DotGrid/DotGrid.jsx'));
const Hyperspeed = lazy(() => import('./backgrounds/Hyperspeed/Hyperspeed.jsx'));

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let webglOK = null;
function hasWebGL() {
  if (webglOK !== null) return webglOK;
  try {
    const c = document.createElement('canvas');
    webglOK = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    webglOK = false;
  }
  return webglOK;
}

const HYPERSPEED_COLORS = {
  roadColor: 0xefe8db,
  islandColor: 0xf2ecdf,
  background: 0xfaf6ef,
  shoulderLines: 0xd9d0c0,
  brokenLines: 0xd9d0c0,
  leftCars: [0xff4d4d, 0xff9f1c, 0x8b5cf6],
  rightCars: [0x3b82f6, 0x2ec27e, 0xffd23f],
  sticks: 0xff9f1c
};

function backgroundFor(kind) {
  switch (kind) {
    case 'liquid-ether':
      // warm candles only — blue/purple dyes go muddy-dark on the cream base
      return (
        <LiquidEther
          colors={['#ff4d4d', '#ff9f1c', '#ffd23f']}
          mouseForce={20}
          cursorSize={110}
          resolution={0.5}
          autoDemo
          autoSpeed={0.6}
          autoIntensity={2.2}
        />
      );
    case 'grid-scan':
      // "graph paper": faint ink lines on the deeper-cream band (.bg-layer below),
      // candle-red scan beam sweeping across
      return (
        <GridScan
          linesColor="#c6b89b"
          scanColor="#7cc4ff"
          scanOpacity={0.5}
          gridScale={0.12}
          lineThickness={1}
          lineJitter={0}
          scanDuration={2.5}
          scanDelay={2.5}
          enablePost={false}
          chromaticAberration={0}
          noiseIntensity={0}
        />
      );
    case 'dot-grid':
      return (
        <DotGrid
          dotSize={4}
          gap={26}
          baseColor="#b6dcc6"
          activeColor="#2ec27e"
          proximity={140}
          shockRadius={220}
          shockStrength={4}
        />
      );
    case 'hyperspeed':
      return <Hyperspeed effectOptions={{ colors: HYPERSPEED_COLORS }} />;
    default:
      return null;
  }
}

export default function SectionBackground({ kind }) {
  const ref = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setNear(true); return; }
    const io = new IntersectionObserver(
      ([e]) => setNear(e.isIntersecting),
      { rootMargin: '25% 0px 25% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const el = useMemo(() => {
    if (REDUCED_MOTION) return null;
    if (kind !== 'dot-grid' && !hasWebGL()) return null; // DotGrid is 2D canvas, the rest need WebGL
    return backgroundFor(kind);
  }, [kind]);

  return (
    <div
      ref={ref}
      className="bg-layer"
      aria-hidden="true"
      style={kind === 'grid-scan' ? { background: 'var(--bg-alt)' } : undefined}
    >
      {near && el && <Suspense fallback={null}>{el}</Suspense>}
      <div className="bg-veil" />
    </div>
  );
}
