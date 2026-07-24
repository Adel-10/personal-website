import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import burstConfetti from '../confetti.js';

// A video-game skill tree. Six candle-colored branches grow from the root;
// click any node to inspect it (detail panel + proof link). Inspecting all
// nodes fills the meter and earns confetti. Mobile gets a native <details>
// accordion instead of the SVG.

const BRANCHES = [
  {
    id: 'dl', label: 'Deep learning', color: '#ff4d4d',
    desc: 'Transformer internals written by hand in PyTorch — attention, embeddings, LR schedules, regularization — and the diagnostics to reason about overfitting vs generalization.',
    proof: 'shakespeare-gpt',
    leaves: [
      { id: 'dl1', label: 'Transformers by hand', desc: 'Multi-head causal self-attention, pre-norm residual blocks, weight tying — no transformer libraries, every component from first principles.' },
      { id: 'dl2', label: 'PyTorch', desc: 'Raw PyTorch training loops: AdamW, cosine LR with warmup, gradient clipping, dropout, early stopping on validation loss.' },
      { id: 'dl3', label: 'Training diagnostics', desc: 'Reading train/val curves like an engineer: diagnosed memorization on a small corpus, scaled data ~11×, held the gap to ~0.30.' }
    ]
  },
  {
    id: 'ret', label: 'Retrieval & embeddings', color: '#ff9f1c',
    desc: 'Multilingual dense retrieval and the geometry beneath it — measured, not assumed: parallel EN/AR pairs at cosine 0.781 vs 0.548 random.',
    proof: 'Bilingual RAG · dialect fine-tune',
    leaves: [
      { id: 'ret1', label: 'Dense retrieval (BGE-M3)', desc: 'Shared EN/AR embedding space, exact cosine search as one visible matmul — no vector DB needed at 1,133 chunks.' },
      { id: 'ret2', label: 'Section-aware chunking', desc: 'Structure-preserving extraction, tables kept atomic; a chunking bug that dropped headings was caught by evals.' },
      { id: 'ret3', label: 'Contrastive fine-tuning', desc: 'Two-phase CachedMNRL with NO_DUPLICATES sampling; dialect hit@6 59→63/68, texting-register MRR 0.33→0.62.' }
    ]
  },
  {
    id: 'llm', label: 'LLM systems & guardrails', color: '#3b82f6',
    desc: 'Grounded generation that cites or shuts up — abstention enforced structurally (score gate, refusal marker, citation post-check), never by asking nicely.',
    proof: 'Bilingual RAG · minimal-agent',
    leaves: [
      { id: 'llm1', label: 'Grounded generation', desc: 'Grounding-only prompts with [n] citations mapped back to official sources; faithfulness LLM-judged at 32/33 SUPPORTED.' },
      { id: 'llm2', label: 'Structural abstention', desc: 'Below-threshold queries never reach the LLM; refusals render a fixed template — 6/6 abstained out-of-corpus, 0 false abstentions.' },
      { id: 'llm3', label: 'Agent loops', desc: 'Plan → execute → reflect in ~230 lines, no framework; tools return errors as data so the loop self-heals.' }
    ]
  },
  {
    id: 'ev', label: 'Evaluation', color: '#2ec27e',
    desc: 'Eval harnesses as first-class deliverables — they caught a silent chunking bug and a misattributed hotline number no string metric would flag.',
    proof: 'every project ships one',
    leaves: [
      { id: 'ev1', label: 'Deterministic + judged', desc: 'Retrieval/citation metrics plus LLM-as-judge faithfulness, reported per-language and per-register.' },
      { id: 'ev2', label: 'Held-out honesty', desc: 'Fresh question sets run exactly once and reported as-is — including the 2/12 false abstentions that cost the safety policy.' },
      { id: 'ev3', label: 'Forgetting guards', desc: 'Every fine-tune checkpoint gated on held-out MRR; epoch 3 traded accuracy for nothing and was rejected.' }
    ]
  },
  {
    id: 'eng', label: 'Engineering', color: '#8b5cf6',
    desc: 'The stack around the models: Python services, React frontends, deterministic data pipelines, Git throughout.',
    proof: 'Bilingual RAG · dissertation app',
    leaves: [
      { id: 'eng1', label: 'Python · FastAPI · React', desc: 'FastAPI backends, single-file React chat UIs, React Native with on-device ONNX inference.' },
      { id: 'eng2', label: 'Crawlers & pipelines', desc: 'Manifest-driven polite crawling, deterministic HTML extraction, reproducible data pipelines.' },
      { id: 'eng3', label: 'SQL & databases', desc: 'MySQL/SQLite, Cosmos DB at KPMG, an LLM-assisted csv/xlsx→SQL converter in production.' }
    ]
  },
  {
    id: 'ops', label: 'Delivery & ops', color: '#ffd23f',
    desc: 'Models that never ship don’t matter — the delivery half, demonstrated end to end, plus the business grounding of CS-with-Management and a KPMG AI internship.',
    proof: 'ci-k8s',
    leaves: [
      { id: 'ops1', label: 'Docker', desc: 'Images tagged by git SHA, pushed to a registry from CI.' },
      { id: 'ops2', label: 'Kubernetes', desc: 'Deployments with readiness/liveness probes, 2 replicas behind a Service.' },
      { id: 'ops3', label: 'Jenkins CI/CD', desc: 'Build → tag → push → roll out, the way ops teams actually ship.' }
    ]
  }
];

const TOTAL = BRANCHES.reduce((n, b) => n + 1 + b.leaves.length, 0); // 24

export default function SkillTree() {
  const [selected, setSelected] = useState(null); // { branch, node }
  const [explored, setExplored] = useState(() => new Set());
  const treeRef = useRef(null);
  const partyRef = useRef(false);

  // geometry (SVG viewBox space) — generous vertical spacing so adjacent
  // branches' leaves can never collide (hub gap 150 vs. leaf spread ±62)
  const layout = useMemo(() => {
    const root = { x: 95, y: 485 };
    return BRANCHES.map((b, i) => {
      const hub = { x: 430, y: 110 + i * 150 };
      const leaves = b.leaves.map((leaf, j) => ({
        ...leaf,
        x: 762,
        y: hub.y + (j - (b.leaves.length - 1) / 2) * 62
      }));
      return { ...b, hub, leaves, root };
    });
  }, []);

  function inspect(branch, node) {
    setSelected({ branch, node });
    setExplored(prev => {
      if (prev.has(node.id)) return prev;
      const next = new Set(prev);
      next.add(node.id);
      if (next.size === TOTAL && !partyRef.current && treeRef.current) {
        partyRef.current = true;
        const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduced) burstConfetti(treeRef.current);
      }
      return next;
    });
  }

  const sel = selected?.node;
  const selColor = selected?.branch.color;
  const done = explored.size === TOTAL;

  return (
    <section className="stree-section" id="skills">
      {/* wide container — the tree needs the room */}
      <div className="wrap wrap-wide">
        <div className="stree-meter reveal" aria-live="polite">
          <span className="stree-count">
            {done ? '🎉 tree fully explored' : `${explored.size} / ${TOTAL} nodes explored`}
          </span>
          <span className="stree-bar"><span style={{ width: `${(explored.size / TOTAL) * 100}%` }} /></span>
        </div>

        <div className="stree-grid">
          {/* ===== the tree (desktop) ===== */}
          <div className="stree-tree reveal" ref={treeRef}>
            <svg viewBox="0 0 1000 970" className="stree-svg" role="group" aria-label="Interactive skill tree">
              {/* paths */}
              {layout.map(b => {
                const active = selected && selected.branch.id === b.id;
                return (
                  <g key={`p-${b.id}`}>
                    <path
                      className={`stree-path${active ? ' on' : ''}`}
                      style={active ? { stroke: b.color } : undefined}
                      d={`M ${b.root.x + 34} ${b.root.y} C 270 ${b.root.y}, 270 ${b.hub.y}, ${b.hub.x - 30} ${b.hub.y}`}
                    />
                    {b.leaves.map(leaf => (
                      <path
                        key={`p-${leaf.id}`}
                        className={`stree-path${active && (sel.id === leaf.id || sel.id === b.id) ? ' on' : ''}`}
                        style={active ? { stroke: b.color } : undefined}
                        d={`M ${b.hub.x + 30} ${b.hub.y} C 610 ${b.hub.y}, 610 ${leaf.y}, ${leaf.x - 18} ${leaf.y}`}
                      />
                    ))}
                  </g>
                );
              })}

              {/* root */}
              <g className="stree-root">
                <circle cx="95" cy="485" r="34" />
                <text x="95" y="490" textAnchor="middle">ML/AI</text>
              </g>

              {/* hubs + leaves */}
              {layout.map(b => (
                <g key={b.id}>
                  <g
                    className={`stree-node hub${explored.has(b.id) ? ' seen' : ''}${sel?.id === b.id ? ' sel' : ''}`}
                    style={{ '--nc': b.color }}
                    onClick={() => inspect(b, b)}
                    tabIndex={0}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && inspect(b, b)}
                    role="button"
                    aria-label={`${b.label} — inspect`}
                  >
                    <circle cx={b.hub.x} cy={b.hub.y} r={sel?.id === b.id ? 26 : 22} />
                    <text x={b.hub.x} y={b.hub.y - 32} textAnchor="middle" className="hub-label">{b.label}</text>
                  </g>
                  {b.leaves.map(leaf => (
                    <g
                      key={leaf.id}
                      className={`stree-node leaf${explored.has(leaf.id) ? ' seen' : ''}${sel?.id === leaf.id ? ' sel' : ''}`}
                      style={{ '--nc': b.color }}
                      onClick={() => inspect(b, leaf)}
                      tabIndex={0}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && inspect(b, leaf)}
                      role="button"
                      aria-label={`${leaf.label} — inspect`}
                    >
                      <circle cx={leaf.x} cy={leaf.y} r={sel?.id === leaf.id ? 14 : 11} />
                      <text x={leaf.x + 22} y={leaf.y + 4} className="leaf-label">{leaf.label}</text>
                    </g>
                  ))}
                </g>
              ))}
            </svg>
          </div>

          {/* ===== detail panel ===== */}
          <aside className="stree-panel reveal">
            {sel ? (
              <>
                <div className="stree-panel-tag" style={{ color: selColor }}>
                  {selected.branch.id === sel.id ? 'branch' : selected.branch.label}
                </div>
                <h3 style={{ color: selColor }}>{sel.label}</h3>
                <p>{sel.desc}</p>
                <div className="stree-proof">
                  <span>proven in:</span>
                  <Link to="/projects" style={{ color: selColor, borderColor: selColor }}>
                    {selected.branch.proof} →
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h3>Pick a node.</h3>
                <p>
                  Six branches, eighteen leaves — every one demonstrated in a shipped project, not
                  claimed on a list. Click around; explore all {TOTAL} and something nice happens.
                </p>
              </>
            )}
          </aside>
        </div>

        {/* ===== mobile accordion ===== */}
        <div className="stree-accordion">
          {BRANCHES.map(b => (
            <details key={b.id} style={{ '--bc': b.color }}>
              <summary>{b.label}</summary>
              <p>{b.desc}</p>
              <ul>
                {b.leaves.map(leaf => (
                  <li key={leaf.id}><strong>{leaf.label}</strong> — {leaf.desc}</li>
                ))}
              </ul>
              <Link className="stree-proof-m" to="/projects">proven in: {b.proof} →</Link>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
