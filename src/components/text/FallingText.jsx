import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// React Bits "Falling Text" (port, matter-js) + restart.
// HOVER the text → words drop with physics; drag them around; ↺ restores the
// original layout and re-arms (falls again on the next hover).
//
// Positioning notes: words are measured with offsetLeft/offsetTop (pure layout
// coordinates — immune to the pinned/animated header's transforms, which made
// getBoundingClientRect-based coords drift) and animated with DELTA transforms,
// so at trigger time every word is exactly where it rested.
export default function FallingText({ text = '', highlightWords = [], gravity = 1, className = '' }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const canvasRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [runKey, setRunKey] = useState(0);

  function startFromRealPointerMove(event) {
    if (started || event.pointerType === 'touch') return;
    // LOCAL PATCH: pointerenter can fire when the pinned title scrolls under a
    // stationary cursor. Requiring pointer movement keeps this a real hover.
    setStarted(true);
  }

  // (re)build static word spans — fresh elements carry no leftover inline styles.
  useEffect(() => {
    if (!textRef.current) return;
    const words = text.split(' ');
    const fragment = document.createDocumentFragment();
    words.forEach((word, index) => {
      if (index > 0) fragment.appendChild(document.createTextNode(' '));
      const hl = highlightWords.some(h => word.startsWith(h));
      const span = document.createElement('span');
      span.className = `ft-word${hl ? ' ft-highlight' : ''}`;
      span.textContent = word;
      fragment.appendChild(span);
    });
    textRef.current.replaceChildren(fragment);
  }, [text, highlightWords, runKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // physics run
  useEffect(() => {
    if (!started || REDUCED) return;
    const { Engine, Render, Runner, World, Bodies, Body, Mouse, MouseConstraint } = Matter;
    const container = containerRef.current;
    const w = container.offsetWidth, h = container.offsetHeight;

    const engine = Engine.create();
    engine.world.gravity.y = gravity;
    const render = Render.create({
      element: canvasRef.current,
      engine,
      options: { width: w, height: h, background: 'transparent', wireframes: false }
    });

    const wallOpts = { isStatic: true, render: { fillStyle: 'transparent' } };
    const walls = [
      Bodies.rectangle(w / 2, h + 25, w + 100, 50, wallOpts),  // floor
      Bodies.rectangle(-25, h / 2, 50, h * 3, wallOpts),       // left
      Bodies.rectangle(w + 25, h / 2, 50, h * 3, wallOpts),    // right
      Bodies.rectangle(w / 2, -h, w + 100, 50, wallOpts)       // ceiling, high above
    ];

    // measure every span in layout coordinates BEFORE mutating any styles
    const spans = [...textRef.current.querySelectorAll('.ft-word')];
    const metrics = spans.map(el => ({
      x0: el.offsetLeft, y0: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight
    }));
    const items = spans.map((el, i) => {
      const m = metrics[i];
      const cx = m.x0 + m.w / 2, cy = m.y0 + m.h / 2;
      const body = Bodies.rectangle(cx, cy, m.w, m.h, {
        restitution: 0.8, frictionAir: 0.01, friction: 0.2,
        render: { fillStyle: 'transparent' }
      });
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 5, y: 0 });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);
      // pin the word to its exact resting spot; physics moves it by delta only
      el.style.position = 'absolute';
      el.style.left = `${m.x0}px`;
      el.style.top = `${m.y0}px`;
      el.style.margin = '0';
      el.style.transform = 'translate(0, 0)';
      return { el, body, cx, cy };
    });

    const mouse = Mouse.create(container);
    // Matter's wheel handlers block page scrolling over the container — remove them
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
    const mc = MouseConstraint.create(engine, {
      mouse, constraint: { stiffness: 0.2, render: { visible: false } }
    });
    render.mouse = mouse;

    World.add(engine.world, [...walls, ...items.map(it => it.body), mc]);
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    let raf;
    const sync = () => {
      items.forEach(({ el, body, cx, cy }) => {
        el.style.transform =
          `translate(${body.position.x - cx}px, ${body.position.y - cy}px) rotate(${body.angle}rad)`;
      });
      raf = requestAnimationFrame(sync);
    };
    sync();

    return () => {
      cancelAnimationFrame(raf);
      Render.stop(render);
      Runner.stop(runner);
      render.canvas.remove();
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [started, runKey, gravity]);

  // restore the original layout and RE-ARM: stays put until the next hover
  function restart(e) {
    e.stopPropagation();
    setStarted(false);      // tears down the physics world
    setRunKey(k => k + 1);  // rebuilds pristine static spans
  }

  if (REDUCED) {
    return <span className={`falling-text-static ${className}`}>{text}</span>;
  }

  return (
    <span
      className={`falling-text-container ${className}`}
      ref={containerRef}
      onPointerMove={startFromRealPointerMove}
      title={started ? undefined : 'hover me'}
    >
      <span className="ft-canvas" ref={canvasRef} aria-hidden="true" />
      <span className="ft-words" ref={textRef} />
      {started && (
        <button className="ft-restart" onClick={restart} aria-label="Restore the title">↺ restart</button>
      )}
    </span>
  );
}
