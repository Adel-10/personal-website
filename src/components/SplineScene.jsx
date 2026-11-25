import { lazy } from 'react';
import RendererBoundary from './RendererBoundary.jsx';

// Ported from 21st.dev "Spline Scene" (@serafim/splite) — Tailwind classes
// replaced with site CSS. Lazy-loads @splinetool/react-spline so the runtime
// (~1MB) only downloads when a scene is actually rendered.
const Spline = lazy(() => import('@splinetool/react-spline'));

// LOCAL PATCH: gate the scene on WebGL 2 and let Home reveal the live canvas on load.
export default function SplineScene({ scene, className, onLoad }) {
  return (
    <RendererBoundary loading={<div className="spline-loading"><span className="spline-loader" /></div>}>
      <Spline scene={scene} className={className} onLoad={onLoad} />
    </RendererBoundary>
  );
}
