import { Suspense, lazy } from 'react';

// Ported from 21st.dev "Spline Scene" (@serafim/splite) — Tailwind classes
// replaced with site CSS. Lazy-loads @splinetool/react-spline so the runtime
// (~1MB) only downloads when a scene is actually rendered.
const Spline = lazy(() => import('@splinetool/react-spline'));

export default function SplineScene({ scene, className }) {
  return (
    <Suspense
      fallback={
        <div className="spline-loading">
          <span className="spline-loader" />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
