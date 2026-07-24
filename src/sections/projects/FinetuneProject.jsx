import ProjectSection from '../../components/ProjectSection.jsx';

export default function FinetuneProject() {
  return (
    <ProjectSection id="project-finetune">
      <h3>Dialect fine-tune — teaching an embedder Gulf Arabic</h3>
      <div className="tagline">Two-phase contrastive fine-tuning to close the dialect→MSA retrieval gap of the RAG system above — trained and evaluated on an 8&nbsp;GB M1</div>
      <div className="links">
        <span className="nolink">write-up available on request — repo not yet published</span>
      </div>

      <div className="bigstats">
        <div className="bigstat">
          <span className="num" data-count="63" data-suffix="/68">63/68</span>
          <span className="lbl">dialect hit@6 — up from 59</span>
        </div>
        <div className="bigstat">
          <span className="num" data-count="0.766" data-decimals="3">0.766</span>
          <span className="lbl">dialect MRR — from 0.707</span>
        </div>
        <div className="bigstat">
          <span className="num" data-count="0.62" data-decimals="2">0.62</span>
          <span className="lbl">texting-register MRR — from 0.33</span>
        </div>
      </div>

      <p>
        The RAG system above retrieves formal Arabic (MSA) well — but real users write Bahraini dialect:
        casual, abbreviated, texting-style. This project asked a falsifiable question: can fine-tuning the
        embedding model close the dialect→MSA retrieval gap, so the query-time translation crutch isn't
        needed? The honest answer, measured: <strong>partially</strong> — and the way it partially worked is
        the interesting part.
      </p>

      <p>
        The design is two-phase: a warm-up on 9,000 Doha↔MSA parallel pairs (MADAR corpus) to teach the
        general dialect↔MSA reflex, then 941 civic dialect→chunk pairs for the domain. Training used a
        contrastive objective (CachedMNRL with a <code>NO_DUPLICATES</code> sampler so same-chunk phrasings
        don't become false negatives), with every checkpoint evaluated as a forgetting guard. The production
        embedder (BGE-M3, 568M params) doesn't fine-tune in 8&nbsp;GB, so the sanctioned fallback{' '}
        <code>multilingual-e5-small</code> (118M) was trained instead.
      </p>

      <h4>Results — dialect retrieval, 68 queries (same-model comparison)</h4>
      <div className="tablewrap">
        <table>
          <tbody>
            <tr><th>model</th><th>dialect hit@6</th><th>dialect MRR</th><th>held-out testset MRR</th></tr>
            <tr><td>base e5-small</td><td>59/68</td><td>0.707</td><td>0.859</td></tr>
            <tr><td>civic pairs only</td><td>60/68</td><td>0.699</td><td>0.843</td></tr>
            <tr><td><strong>+ Doha↔MSA warm-up (epoch 2)</strong></td><td><strong>63/68</strong></td><td><strong>0.766</strong></td><td>0.851</td></tr>
          </tbody>
        </table>
      </div>

      <p>
        Two findings matter. First, the negative result: 941 civic pairs alone did essentially nothing —
        dialect MRR even dipped. Second, the warm-up unlocked the fine-tune (+0.059 MRR, misses cut from 9
        to 5), and the gain is concentrated exactly where the base model was worst: the noisy texting
        register, whose MRR nearly doubled (0.33&nbsp;→&nbsp;0.62) — with almost no forgetting (held-out MRR
        fell just 0.008). Epoch 3 traded held-out accuracy for nothing and was rejected by the
        per-checkpoint guard.
      </p>

      <p>
        Verdict, stated in the write-up rather than tuned away: a proof-of-concept on e5-small, not a
        validated replacement for the translation pipeline — the dialect axis moved, the cross-lingual axis
        did not.
      </p>

      <h4>Stack</h4>
      <p>
        PyTorch, sentence-transformers (CachedMultipleNegativesRankingLoss), MADAR + Bahrain civic corpus,
        Apple-Silicon MPS — including the memory engineering to make a 118M-param contrastive fine-tune fit
        under an 8&nbsp;GB ceiling.
      </p>
    </ProjectSection>
  );
}
