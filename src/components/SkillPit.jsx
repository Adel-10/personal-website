import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { TOOLS, CANDLES } from '../data/tools.js';

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const MAX_BODIES = 70;

// The skill ball pit: every tool chip drops into a glass box with real physics.
// Grab and throw them, add balloon balls, flip gravity off, reset.
export default function SkillPit() {
  const boxRef = useRef(null);
  const apiRef = useRef(null);
  const [zeroG, setZeroG] = useState(false);
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    if (REDUCED) return;
    const box = boxRef.current;
    if (!box) return;
    let cleanup = () => {};
    let built = false;

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !built) {
        built = true;
        cleanup = build();
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(box);

    function build() {
      const { Engine, Render, Runner, World, Bodies, Body, Mouse, MouseConstraint } = Matter;
      const w = box.clientWidth, h = box.clientHeight;

      const engine = Engine.create();
      const render = Render.create({
        element: box, engine,
        options: { width: w, height: h, background: 'transparent', wireframes: false }
      });

      const wallOpts = { isStatic: true, render: { fillStyle: 'transparent' } };
      World.add(engine.world, [
        Bodies.rectangle(w / 2, h + 25, w + 100, 50, wallOpts),
        Bodies.rectangle(-25, h / 2, 50, h * 4, wallOpts),
        Bodies.rectangle(w + 25, h / 2, 50, h * 4, wallOpts),
        Bodies.rectangle(w / 2, -h - 25, w + 100, 50, wallOpts) // ceiling high above (spawn room)
      ]);

      const mouse = Mouse.create(box);
      mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
      const mc = MouseConstraint.create(engine, {
        mouse, constraint: { stiffness: 0.2, render: { visible: false } }
      });
      render.mouse = mouse;
      World.add(engine.world, mc);

      const items = [];

      function track(el, body, hw, hh) {
        box.appendChild(el);
        World.add(engine.world, body);
        items.push({ el, body, hw, hh });
      }

      function spawnChip(label, i) {
        if (items.length >= MAX_BODIES) return;
        const el = document.createElement('span');
        el.className = 'pit-chip';
        el.textContent = label;
        const col = CANDLES[i % CANDLES.length];
        el.style.borderColor = col;
        el.style.color = col;
        box.appendChild(el);
        const bw = el.offsetWidth, bh = el.offsetHeight;
        box.removeChild(el);
        const x = 40 + bw / 2 + Math.random() * Math.max(1, w - bw - 80);
        const body = Bodies.rectangle(x, -30 - Math.random() * 60, bw, bh, {
          restitution: 0.55, friction: 0.3, frictionAir: 0.012,
          chamfer: { radius: bh / 2 },
          render: { fillStyle: 'transparent' }
        });
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);
        el.style.transform = `translate(${x - bw / 2}px, -60px)`; // no corner-flash on first frame
        track(el, body, bw / 2, bh / 2);
      }

      function spawnBalls(n) {
        for (let k = 0; k < n && items.length < MAX_BODIES; k++) {
          const d = 26 + Math.random() * 26;
          const el = document.createElement('span');
          el.className = 'pit-ball';
          el.style.width = `${d}px`;
          el.style.height = `${d}px`;
          el.style.background = CANDLES[(Math.random() * CANDLES.length) | 0];
          const x = 40 + Math.random() * (w - 80);
          const body = Bodies.circle(x, -30 - Math.random() * 80, d / 2, {
            restitution: 0.85, friction: 0.1, frictionAir: 0.008,
            render: { fillStyle: 'transparent' }
          });
          el.style.transform = `translate(${x - d / 2}px, -60px)`;
          track(el, body, d / 2, d / 2);
        }
      }

      // drop the chips in, one by one
      const timers = TOOLS.map((t, i) => setTimeout(() => spawnChip(t, i), i * 100));

      const runner = Runner.create();
      Runner.run(runner, engine);
      Render.run(render);

      let raf;
      const sync = () => {
        items.forEach(({ el, body, hw, hh }) => {
          el.style.transform =
            `translate(${body.position.x - hw}px, ${body.position.y - hh}px) rotate(${body.angle}rad)`;
        });
        raf = requestAnimationFrame(sync);
      };
      sync();

      apiRef.current = {
        spawnBalls,
        setGravity(on) {
          engine.world.gravity.y = on ? 0 : 1;
          if (on) {
            items.forEach(({ body }) => {
              Body.setVelocity(body, { x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 6 });
            });
          }
        }
      };

      return () => {
        timers.forEach(clearTimeout);
        cancelAnimationFrame(raf);
        Render.stop(render);
        Runner.stop(runner);
        render.canvas.remove();
        items.forEach(({ el }) => el.remove());
        World.clear(engine.world, false);
        Engine.clear(engine);
        apiRef.current = null;
      };
    }

    return () => { io.disconnect(); cleanup(); };
  }, [runKey]);

  if (REDUCED) {
    return (
      <section className="skill-pit-section">
        <div className="wrap">
          <div className="sec-tag">Toolbox</div>
          <h2>The tools</h2>
          <div className="pit-static">
            {TOOLS.map((t, i) => (
              <span key={t} className="pit-chip-static" style={{ color: CANDLES[i % CANDLES.length], borderColor: CANDLES[i % CANDLES.length] }}>{t}</span>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="skill-pit-section">
      <div className="wrap">
        <div className="sec-tag reveal">Playground</div>
        <h2 className="reveal">The ball pit</h2>
        <p className="sec-sub reveal">Same eighteen tools — now with physics. Grab one and throw it.</p>
      </div>
      <div className="wrap">
        <div className="pit-box" ref={boxRef}>
          <div className="pit-controls">
            <button onClick={() => apiRef.current?.spawnBalls(8)}>🎈 more</button>
            <button onClick={() => {
              const next = !zeroG;
              setZeroG(next);
              apiRef.current?.setGravity(next);
            }}>{zeroG ? '🌍 gravity' : '🚀 zero-g'}</button>
            <button onClick={() => { setZeroG(false); setRunKey(k => k + 1); }}>↺ reset</button>
          </div>
        </div>
      </div>
    </section>
  );
}
