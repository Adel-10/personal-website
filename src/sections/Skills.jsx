export default function Skills() {
  return (
    <section id="skills" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="skillgrid">
          <div className="skill reveal">
            <h3>Deep learning fundamentals</h3>
            <p>Transformer internals written by hand in PyTorch: attention, embeddings, LR schedules, regularization, early stopping — and the diagnostics to reason about overfitting vs generalization.</p>
          </div>
          <div className="skill reveal">
            <h3>Retrieval &amp; embeddings</h3>
            <p>Multilingual dense retrieval (BGE-M3), cosine-similarity search, section-aware chunking, query expansion, contrastive fine-tuning of embedders, and measuring embedding-space geometry rather than assuming it.</p>
          </div>
          <div className="skill reveal">
            <h3>LLM systems &amp; guardrails</h3>
            <p>Grounded generation with citations, structural (not instructional) abstention guarantees, agent/tool-use loops, prompt design, Anthropic API.</p>
          </div>
          <div className="skill reveal">
            <h3>Evaluation</h3>
            <p>Eval harnesses as first-class deliverables: deterministic metrics + LLM-as-judge faithfulness, held-out test sets, per-checkpoint forgetting guards, abstention measured in both directions. Evals that caught real bugs.</p>
          </div>
          <div className="skill reveal">
            <h3>Engineering</h3>
            <p>Python, PyTorch, FastAPI, React, JavaScript; polite crawlers, deterministic HTML extraction, data pipelines; Git/GitHub throughout.</p>
          </div>
          <div className="skill reveal">
            <h3>Delivery &amp; ops</h3>
            <p>Docker, Kubernetes (Deployments, Services, probes), Jenkins CI/CD; plus the business grounding of a CS-with-Management degree and a KPMG AI-team internship.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
