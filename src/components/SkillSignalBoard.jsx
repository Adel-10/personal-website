import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Matter from 'matter-js';
import { Activity, ArrowUpRight, RotateCcw } from 'lucide-react';

const CHANNELS = [
  {
    id: 'dl', code: 'DL', label: 'Deep learning', color: '#ff4d4d', proof: 'shakespeare-gpt',
    tools: ['Python', 'PyTorch'],
    capabilities: [
      { label: 'Transformers by hand', desc: 'Multi-head causal self-attention, pre-norm residual blocks and weight tying, implemented without transformer libraries.' },
      { label: 'PyTorch systems', desc: 'Raw training loops with AdamW, cosine warmup, clipping, dropout and validation-led early stopping.' },
      { label: 'Training diagnostics', desc: 'Reading train and validation curves, diagnosing memorization and measuring what changes actually improve generalization.' }
    ]
  },
  {
    id: 'ret', code: 'RET', label: 'Retrieval', color: '#ff9f1c', proof: 'Bilingual RAG + dialect fine-tune',
    tools: ['sentence-transformers', 'BGE-M3', 'ONNX Runtime'],
    capabilities: [
      { label: 'Dense retrieval', desc: 'A shared English and Arabic embedding space with exact cosine search across 1,133 structured chunks.' },
      { label: 'Section-aware chunking', desc: 'Structure-preserving extraction that keeps tables atomic and retains headings through the retrieval pipeline.' },
      { label: 'Contrastive fine-tuning', desc: 'Two-phase CachedMNRL training with no-duplicate sampling and held-out checkpoint selection.' }
    ]
  },
  {
    id: 'llm', code: 'LLM', label: 'LLM systems', color: '#3b82f6', proof: 'Bilingual RAG + minimal-agent',
    tools: ['Anthropic API', 'Azure OpenAI'],
    capabilities: [
      { label: 'Grounded generation', desc: 'Grounding-only prompts with numbered citations mapped back to official source passages.' },
      { label: 'Structural abstention', desc: 'Score gates, fixed refusal templates and citation post-checks enforced around the model.' },
      { label: 'Agent loops', desc: 'Plan, execute and reflect in about 230 lines, with tool failures returned as recoverable data.' }
    ]
  },
  {
    id: 'eval', code: 'EVAL', label: 'Evaluation', color: '#2ec27e', proof: 'every project ships one',
    tools: ['SQL'],
    capabilities: [
      { label: 'Deterministic + judged', desc: 'Retrieval and citation metrics paired with LLM-judged faithfulness, split by language and register.' },
      { label: 'Held-out honesty', desc: 'Fresh question sets run once and reported as-is, including misses and false abstentions.' },
      { label: 'Forgetting guards', desc: 'Every fine-tune checkpoint gated on held-out MRR before it can replace the baseline.' }
    ]
  },
  {
    id: 'eng', code: 'ENG', label: 'Engineering', color: '#8b5cf6', proof: 'Bilingual RAG + dissertation app',
    tools: ['FastAPI', 'React', 'JavaScript', 'TypeScript', 'Django', 'Node.js'],
    capabilities: [
      { label: 'Model-serving interfaces', desc: 'FastAPI services, React chat interfaces and React Native with on-device ONNX inference.' },
      { label: 'Crawlers & pipelines', desc: 'Manifest-driven crawling, deterministic extraction and reproducible data preparation.' },
      { label: 'Data systems', desc: 'MySQL, SQLite, Cosmos DB and an LLM-assisted spreadsheet-to-SQL converter.' }
    ]
  },
  {
    id: 'ops', code: 'OPS', label: 'Delivery & ops', color: '#d6a600', proof: 'ci-k8s',
    tools: ['Docker', 'Kubernetes', 'Jenkins', 'Git'],
    capabilities: [
      { label: 'Reproducible builds', desc: 'Container images tagged by Git SHA and promoted through a traceable delivery path.' },
      { label: 'Kubernetes runtime', desc: 'Replicated deployments with readiness and liveness probes behind a stable service.' },
      { label: 'CI/CD automation', desc: 'Build, tag, push and roll out as one automated Jenkins pipeline.' }
    ]
  }
];

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function SkillSignalBoard() {
  const [channelIndex, setChannelIndex] = useState(0);
  const [capabilityIndex, setCapabilityIndex] = useState(0);
  const [activeTool, setActiveTool] = useState(null);
  const [layoutKey, setLayoutKey] = useState(0);
  const [ready, setReady] = useState(false);
  const [signalKey, setSignalKey] = useState(0);
  const fieldRef = useRef(null);
  const moduleRefs = useRef([]);
  const cableRefs = useRef([]);
  const apiRef = useRef(null);

  const channel = CHANNELS[channelIndex];
  const capability = channel.capabilities[capabilityIndex];

  function pulseSignal() {
    setSignalKey(key => key + 1);
  }

  function selectChannel(index) {
    setChannelIndex(index);
    setCapabilityIndex(0);
    setActiveTool(null);
    pulseSignal();
  }

  function selectCapability(index) {
    setCapabilityIndex(index);
    setActiveTool(null);
    apiRef.current?.nudge(index);
    pulseSignal();
  }

  function triggerTool(tool, index) {
    const target = index % channel.capabilities.length;
    setActiveTool(tool);
    setCapabilityIndex(target);
    apiRef.current?.nudge(target);
    pulseSignal();
  }

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    setReady(false);
    const width = field.clientWidth;
    const height = field.clientHeight;
    const mobile = width < 560;
    const moduleWidth = Math.min(230, Math.max(166, width * (mobile ? 0.52 : 0.4)));
    const moduleHeight = 64;
    const anchorX = mobile ? 30 : 54;
    const restingX = mobile ? width * 0.61 : width * 0.58;
    const rows = [height * 0.24, height * 0.5, height * 0.76];
    const starts = rows.map((y, index) => ({
      x: restingX + (index === 1 ? moduleWidth * 0.08 : 0),
      y
    }));

    const placeStatic = () => {
      starts.forEach((position, index) => {
        const element = moduleRefs.current[index];
        const cable = cableRefs.current[index];
        if (element) {
          element.style.width = `${moduleWidth}px`;
          element.style.transform = `translate(${position.x - moduleWidth / 2}px, ${position.y - moduleHeight / 2}px)`;
        }
        if (cable) {
          cable.setAttribute('x1', anchorX);
          cable.setAttribute('y1', rows[index]);
          cable.setAttribute('x2', position.x - moduleWidth / 2);
          cable.setAttribute('y2', position.y);
        }
      });
      setReady(true);
    };

    if (REDUCED) {
      placeStatic();
      apiRef.current = { nudge() {}, reset: placeStatic };
      return () => { apiRef.current = null; };
    }

    const { Bodies, Body, Constraint, Engine, Events, Mouse, MouseConstraint, Query, Runner, World } = Matter;
    const engine = Engine.create({ gravity: { x: 0, y: 0 } });
    engine.world.gravity.scale = 0;

    const wallOptions = { isStatic: true, render: { visible: false } };
    const walls = [
      Bodies.rectangle(width / 2, -24, width + 80, 48, wallOptions),
      Bodies.rectangle(width / 2, height + 24, width + 80, 48, wallOptions),
      Bodies.rectangle(-24, height / 2, 48, height + 80, wallOptions),
      Bodies.rectangle(width + 24, height / 2, 48, height + 80, wallOptions)
    ];

    const bodies = starts.map((position, index) => {
      const body = Bodies.rectangle(position.x, position.y, moduleWidth, moduleHeight, {
        restitution: 0.72,
        frictionAir: 0.045,
        friction: 0.08,
        chamfer: { radius: 8 },
        render: { visible: false }
      });
      body.skillIndex = index;
      return body;
    });

    const constraints = bodies.map((body, index) => Constraint.create({
      pointA: { x: anchorX, y: rows[index] },
      bodyB: body,
      pointB: { x: -moduleWidth / 2, y: 0 },
      length: Math.max(80, starts[index].x - moduleWidth / 2 - anchorX),
      stiffness: 0.055,
      damping: 0.14,
      render: { visible: false }
    }));

    World.add(engine.world, [...walls, ...bodies, ...constraints]);

    const mouse = Mouse.create(field);
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.18, damping: 0.12, render: { visible: false } }
    });
    World.add(engine.world, mouseConstraint);

    const chooseAtPointer = event => {
      const rect = field.getBoundingClientRect();
      const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      const hit = Query.point(bodies, point)[0];
      if (hit) {
        setCapabilityIndex(hit.skillIndex);
        setActiveTool(null);
        pulseSignal();
      }
    };
    field.addEventListener('pointerdown', chooseAtPointer, { passive: true });

    const runner = Runner.create();
    Runner.run(runner, engine);

    let frame;
    const sync = () => {
      bodies.forEach((body, index) => {
        const element = moduleRefs.current[index];
        const cable = cableRefs.current[index];
        if (element) {
          element.style.width = `${moduleWidth}px`;
          element.style.transform =
            `translate(${body.position.x - moduleWidth / 2}px, ${body.position.y - moduleHeight / 2}px) rotate(${body.angle}rad)`;
        }
        if (cable) {
          cable.setAttribute('x1', anchorX);
          cable.setAttribute('y1', rows[index]);
          cable.setAttribute('x2', body.position.x - Math.cos(body.angle) * moduleWidth / 2);
          cable.setAttribute('y2', body.position.y - Math.sin(body.angle) * moduleWidth / 2);
        }
      });
      frame = requestAnimationFrame(sync);
    };
    sync();
    setReady(true);

    apiRef.current = {
      nudge(index) {
        const body = bodies[index];
        if (!body) return;
        Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * 0.035,
          y: -0.035 - Math.random() * 0.025
        });
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);
      },
      reset() {
        bodies.forEach((body, index) => {
          Body.setPosition(body, starts[index]);
          Body.setVelocity(body, { x: 0, y: 0 });
          Body.setAngle(body, 0);
          Body.setAngularVelocity(body, 0);
        });
      }
    };

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (Math.abs(field.clientWidth - width) > 32) setLayoutKey(key => key + 1);
      }, 160);
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      field.removeEventListener('pointerdown', chooseAtPointer);
      cancelAnimationFrame(frame);
      Events.off(mouseConstraint);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
      mouseConstraint.mouse?.sourceEvents && Mouse.clearSourceEvents(mouseConstraint.mouse);
      apiRef.current = null;
    };
  }, [channelIndex, layoutKey]);

  return (
    <section className="skillboard-section" id="skills">
      <div className="wrap wrap-wide">
        <div className="skillboard-heading reveal">
          <div>
            <div className="sec-tag">Capability console</div>
            <h2>Skill signal board</h2>
          </div>
        </div>

        <div className="skillboard reveal" style={{ '--channel': channel.color }}>
          <div className="skillboard-channels" role="tablist" aria-label="Skill channels">
            {CHANNELS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === channelIndex}
                className={index === channelIndex ? 'active' : ''}
                style={{ '--tab-color': item.color }}
                onClick={() => selectChannel(index)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item.code}</strong>
                <small>{item.label}</small>
              </button>
            ))}
            <div className="skillboard-console-controls">
              <button
                type="button"
                onClick={() => apiRef.current?.reset()}
                aria-label="Reset signal modules"
                title="Reset signal modules"
              >
                <RotateCcw size={17} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="skillboard-main">
            <div className={`skillboard-field${ready ? ' ready' : ''}`} ref={fieldRef}>
              <div className="skillboard-field-label">LIVE PATCH / {channel.label}</div>
              <svg className="skillboard-wiring" aria-hidden="true">
                <line x1="25%" y1="0" x2="25%" y2="100%" />
                <line x1="50%" y1="0" x2="50%" y2="100%" />
                <line x1="75%" y1="0" x2="75%" y2="100%" />
                <line x1="0" y1="25%" x2="100%" y2="25%" />
                <line x1="0" y1="50%" x2="100%" y2="50%" />
                <line x1="0" y1="75%" x2="100%" y2="75%" />
                {channel.capabilities.map((item, index) => (
                  <line
                    key={item.label}
                    ref={element => { cableRefs.current[index] = element; }}
                    className={index === capabilityIndex ? 'active' : ''}
                  />
                ))}
              </svg>
              <div className="skillboard-ports" aria-hidden="true">
                {channel.capabilities.map((item, index) => <i key={item.label} style={{ top: `${24 + index * 26}%` }} />)}
              </div>
              {channel.capabilities.map((item, index) => (
                <button
                  key={item.label}
                  ref={element => { moduleRefs.current[index] = element; }}
                  type="button"
                  draggable="false"
                  className={`skillboard-module${index === capabilityIndex ? ' active' : ''}`}
                  onPointerDown={() => selectCapability(index)}
                  onFocus={() => selectCapability(index)}
                  aria-label={`${item.label}. Select and drag module.`}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{item.label}</strong>
                  <i aria-hidden="true" />
                </button>
              ))}
            </div>

            <aside className="skillboard-inspector" aria-live="polite">
              <div className="skillboard-inspector-top">
                <span>{channel.code} / {String(capabilityIndex + 1).padStart(2, '0')}</span>
                <Activity size={17} aria-hidden="true" />
              </div>
              <div className="skillboard-wave" key={signalKey} aria-hidden="true">
                {Array.from({ length: 16 }, (_, index) => (
                  <i key={index} style={{ height: `${12 + ((index * 17 + channelIndex * 9 + capabilityIndex * 13) % 42)}px` }} />
                ))}
              </div>
              <div className="skillboard-signal-source">
                {activeTool ? `input / ${activeTool}` : `channel / ${channel.label}`}
              </div>
              <h3>{capability.label}</h3>
              <p>{capability.desc}</p>
              <div className="skillboard-proof">
                <span>Evidence</span>
                <Link to="/projects">{channel.proof}<ArrowUpRight size={15} aria-hidden="true" /></Link>
              </div>
            </aside>
          </div>

          <div className="skillboard-tools">
            <div className="skillboard-tools-label">
              <span>Tool inputs</span>
              <strong>{channel.tools.length}</strong>
            </div>
            <div className="skillboard-tool-grid">
              {channel.tools.map((tool, index) => (
                <button
                  key={tool}
                  type="button"
                  className={activeTool === tool ? 'active' : ''}
                  onClick={() => triggerTool(tool, index)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>{tool}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
