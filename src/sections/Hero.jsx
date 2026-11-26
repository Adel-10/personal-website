import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SplineScene from '../components/SplineScene.jsx';

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Home hero — text left, interactive 3D robot (Spline, via 21st.dev SplineScene) right.
// A soft light follows the cursor inside the robot's area only (the robot tracks the
// mouse, so the glow shows the user what it's looking at); outside, the cursor is normal.
export default function Hero() {
  const splineRef = useRef(null);
  const glowRef = useRef(null);
  const [splineReady, setSplineReady] = useState(false);

  function onGlowMove(e) {
    const box = splineRef.current;
    const glow = glowRef.current;
    if (!box || !glow) return;
    const r = box.getBoundingClientRect();
    // 90 = half the glow's 180px size, so it centers on the cursor
    glow.style.transform = `translate(${e.clientX - r.left - 90}px, ${e.clientY - r.top - 90}px)`;
  }

  function onSplineLoad(app) {
    // Hold the first live frame briefly so the poster hands off into the scene's
    // own close-up before its zoom-out animation continues.
    const canvas = splineRef.current?.querySelector('canvas');
    if (!canvas) return;
    app.stop?.();
    requestAnimationFrame(() => {
      if (!canvas.isConnected) return;
      setSplineReady(true);
      requestAnimationFrame(() => {
        if (canvas.isConnected) app.play?.();
      });
    });
  }

  return (
    <header id="top">
      <div className="wrap wrap-wide hero-grid">
        <div className="hero-text">
          <div className="kicker reveal">ML/AI Engineer · Bahrain</div>
          <h1 className="hero-name">Adel <span>Mithaiwala</span></h1>
          <p className="lede reveal">
            Aspiring AI/ML engineer, passionate about reliable machine learning for real-world decisions.
          </p>
          <p className="lede reveal">
            First-class BSc (Hons) <strong>Computer Science with Management</strong>, King's College London
            (with distinction). Previously an intern on <strong>KPMG's AI team</strong> and at{' '}
            <strong>Batelco</strong>.
          </p>
          <div className="quick-links reveal">
            <Link to="/projects">projects →</Link>
            <Link to="/skills">skills →</Link>
            <Link to="/education">education →</Link>
            <Link to="/experience">experience →</Link>
            <Link to="/contact">contact →</Link>
          </div>
        </div>
        <div
          className={`hero-spline${splineReady ? ' is-ready' : ''}`}
          aria-hidden="true"
          ref={splineRef}
          onMouseMove={onGlowMove}
        >
          {!REDUCED_MOTION && (
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="spline-canvas"
              onLoad={onSplineLoad}
            />
          )}
          <img
            className="spline-poster"
            src="/assets/robot-intro-poster.webp"
            alt=""
            width="1146"
            height="1176"
            loading="eager"
            fetchPriority="high"
            draggable="false"
          />
          {!REDUCED_MOTION && <div className="spline-glow" ref={glowRef} />}
        </div>
      </div>
    </header>
  );
}
