import { Component, Suspense, lazy } from 'react';

// Ported from 21st.dev "Spline Scene" (@serafim/splite) — Tailwind classes
// replaced with site CSS. Lazy-loads @splinetool/react-spline so the runtime
// (~1MB) only downloads when a scene is actually rendered.
const Spline = lazy(() => import('@splinetool/react-spline'));

class SplineErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function SplineScene({ scene, className }) {
  return (
    <SplineErrorBoundary>
      <Suspense
        fallback={
          <div className="spline-loading">
            <span className="spline-loader" />
          </div>
        }
      >
        <Spline scene={scene} className={className} />
      </Suspense>
    </SplineErrorBoundary>
  );
}
