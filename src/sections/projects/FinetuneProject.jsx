import ProjectSection from '../../components/ProjectSection.jsx';

export default function FinetuneProject() {
  return (
    <ProjectSection id="project-finetune">
      <h3>Dialect fine-tune — teaching an embedder Gulf Arabic</h3>
      <div className="tagline">Two-phase contrastive fine-tuning to close the dialect→MSA retrieval gap of the RAG system above</div>
      <div className="links">
        <span className="nolink">write-up available on request — repo not yet published</span>
      </div>

      <div className="bigstats">
        <div className="bigstat">
          <span className="num" data-count="63" data-suffix="/68">63/68</span>
          <span className="lbl">dialect hit@6 — up from 57</span>
        </div>
        <div className="bigstat">
          <span className="num" data-count="0.766" data-decimals="3">0.766</span>
          <span className="lbl">dialect MRR — from 0.687</span>
        </div>
        <div className="bigstat">
          <span className="num" data-count="0.62" data-decimals="2">0.62</span>
          <span className="lbl">texting-register MRR — from 0.33</span>
        </div>
      </div>

      <p>
        The RAG system above handles English and formal Arabic well, but people in Bahrain often type the
        way they speak: casual, abbreviated, and in Bahraini dialect. The system deals with this by sending
        every question to a language model for translation first. This project investigates whether
        fine-tuning the embedding model itself can close the gap between dialect questions and formal-Arabic
        answers, so the translation step isn't needed. The answer found is <strong>partly</strong>.
      </p>

      <p>
        I trained the model in two phases. The first was a warm-up on 9,000 pairs of the same sentence in
        Doha dialect and formal Arabic, from the MADAR corpus. Bahrain/Manama isn't in MADAR, and Doha is
        the closest dialect it has. This phase teaches the general habit of matching dialect to formal
        Arabic. The second phase used 941 Bahraini-style civic questions, each paired with the passage that
        answers it. Both phases used contrastive learning with a cached multiple-negatives ranking loss. A
        special sampler kept two phrasings of the same question out of the same batch, so neither was treated
        as a wrong answer for the other. Every checkpoint was evaluated to catch forgetting. Ideally I would
        have used the larger BGE-M3 model (568M parameters), but hardware limitations meant the smaller
        <code>multilingual-e5-small</code> model (118M) was trained instead and compared against its own
        untuned version.
      </p>

      <h4>Results — dialect retrieval, 68 queries (same-model comparison)</h4>
      <div className="tablewrap">
        <table>
          <tbody>
            <tr><th>model</th><th>dialect hit@6</th><th>dialect MRR</th><th>held-out testset MRR</th></tr>
            <tr><td>base e5-small</td><td>57/68</td><td>0.687</td><td>0.848</td></tr>
            <tr><td>civic pairs only</td><td>60/68</td><td>0.699</td><td>0.828</td></tr>
            <tr><td><strong>+ Doha↔MSA warm-up (epoch 2)</strong></td><td><strong>63/68</strong></td><td><strong>0.766</strong></td><td>0.851</td></tr>
          </tbody>
        </table>
      </div>

      <p>
        Two results stand out. First, the 941 civic pairs did almost nothing on their own: dialect MRR moved
        from 0.687 to 0.699, which is well within noise. Second, putting the Doha warm-up first is what made
        the fine-tune work. MRR rose to 0.766, and misses on the 68 held-out dialect questions fell from 11
        to 5. Most of that gain came where the base model was weakest—the abbreviated texting-style
        questions—where MRR nearly doubled from 0.33 to 0.62. The cost was a small drop on the original
        English and formal-Arabic test questions (MRR 0.848 to 0.821), mostly in English ranking. Epoch 3
        scored lower on the dialect exam than epoch 2, so the evaluation picked epoch 2. With only 48
        underlying questions in the exam, the gain only just clears a 95% confidence interval.
      </p>

      <p>
        This is a proof of concept on a smaller model and not yet a replacement for the translation step.
        Dialect retrieval improved, but English-to-Arabic retrieval didn't, because the training data had no
        English questions. The tuned small model (e5-small) also still trails the untuned production model
        (BGE-M3) on dialect (MRR 0.766 vs 0.805). Next steps would include fine-tuning the BGE-M3 model
        itself on a bigger GPU.
      </p>

      <h4>Stack</h4>
      <p>
        PyTorch and sentence-transformers (CachedMultipleNegativesRankingLoss). The data came from three
        places: the MADAR corpus for the Doha warm-up, the LMRA corpus from the project above for the civic
        pairs, and the Bahrain Corpus to check that the generated questions read like real Bahraini Arabic.
        Some memory engineering was required due to constrained hardware:
      </p>
      <ul>
        <li>gradient caching, to keep an effective batch of 16 while processing one pair at a time</li>
        <li>clearing the GPU cache after every step</li>
        <li>shorter sequences for the warm-up phase</li>
      </ul>
    </ProjectSection>
  );
}
