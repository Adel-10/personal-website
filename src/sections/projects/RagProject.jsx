import ProjectSection from '../../components/ProjectSection.jsx';

export default function RagProject() {
  return (
    <ProjectSection id="project-rag">
      <h3>Bilingual RAG over Bahrain's labour authority (LMRA)</h3>
      <div className="tagline">Cross-lingual retrieval + cite-or-abstain guardrails over official English/Arabic government content</div>
      <div className="links">
        <a href="https://github.com/Adel-10/lmra-bilingual-rag" target="_blank" rel="noopener noreferrer">github.com/Adel-10/lmra-bilingual-rag →</a>
      </div>

      <div className="bigstats">
        <div className="bigstat">
          <span className="num" data-count="33" data-suffix="/33">33/33</span>
          <span className="lbl">retrieval hit@6, main eval</span>
        </div>
        <div className="bigstat">
          <span className="num" data-count="0.781" data-decimals="3">0.781</span>
          <span className="lbl">mean cosine, parallel EN↔AR pairs</span>
        </div>
        <div className="bigstat">
          <span className="num" data-count="6" data-suffix="/6">6/6</span>
          <span className="lbl">abstained on out-of-corpus questions</span>
        </div>
      </div>

      <p>
        A retrieval-augmented assistant that answers questions about Bahraini work permits and labour
        services in English or Arabic, retrieving from a corpus that contains both — because some
        authoritative content (board resolutions, several laws) exists only in Arabic. Every answer cites
        the official page it came from; when the corpus doesn't cover a question, the system abstains with
        a fixed template instead of guessing.
      </p>

      <h4>Architecture</h4>
      <pre>{`crawl (manifest-driven, EN+AR) → extract (deterministic, structure-preserving)
  → chunk (section-aware, tables atomic) → embed (`}<span className="hl">BGE-M3</span>{`, shared EN/AR space)
  → retrieve (bilingual query expansion, exact cosine via one matmul)
  → gate (relevance threshold → hard abstention)
  → generate (grounding-only prompt, [n] citations)
  → post-check (citation mapping; NOT_IN_SOURCES marker → fixed template)`}</pre>

      <p>
        The technically interesting part is cross-lingual retrieval in one shared embedding space. Measured
        on this corpus: parallel EN/AR chunk pairs sit at mean cosine <strong>0.781</strong> vs{' '}
        <strong>0.548</strong> for random cross-language pairs — meaning dominates the geometry, language
        barely registers. The hardest case (casual English questions against Arabic-only legal prose)
        initially failed, and was fixed with query-time bilingual expansion: translate the query, embed both
        versions, score chunks by the max — so no LLM-generated text ever enters the index of a
        civic-information system.
      </p>

      <p>
        Abstention is enforced structurally, in three layers: a retrieval-score gate (below threshold, the
        LLM is never called), a grounding-only prompt with an explicit refusal marker, and a citation
        post-check. Refusals display a deterministic template, never model prose — testing showed the model
        names other authorities even when instructed not to.
      </p>

      <h4>Evaluation — 39 cases, LLM-judged faithfulness</h4>
      <div className="tablewrap">
        <table>
          <tbody>
            <tr><th>metric</th><th>overall</th><th>EN</th><th>AR</th><th>cross-lingual</th></tr>
            <tr><td>retrieval hit@6</td><td><strong>33/33</strong></td><td>18/18</td><td>15/15</td><td>9/9</td></tr>
            <tr><td>citation correct</td><td><strong>33/33</strong></td><td>18/18</td><td>15/15</td><td>9/9</td></tr>
            <tr><td>faithfulness SUPPORTED</td><td><strong>32/33</strong></td><td>17/18</td><td>15/15</td><td>9/9</td></tr>
            <tr><td>abstained on out-of-corpus</td><td><strong>6/6</strong></td><td>3/3</td><td>3/3</td><td>—</td></tr>
            <tr><td>false abstention</td><td><strong>0/33</strong></td><td>0/18</td><td>0/15</td><td>0/9</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Because that table is measured on cases the system was iterated against, a held-out set of 15 fresh
        questions was run exactly once, results reported as-is: retrieval 12/12, citations 10/10,
        faithfulness 10/10, cross-lingual 3/3 — and 2/12 false abstentions on two-part questions, an honest
        cost of the safety-first refusal policy, documented rather than tuned away. The eval harness caught
        two real bugs during development: a chunking bug that silently dropped section headings (making
        entire FAQ questions unretrievable) and a misattributed hotline number that no string metric would
        have flagged.
      </p>

      <div className="figrow">
        <figure>
          <img src="assets/English-prompt.png" alt="English question answered with citations from both English and Arabic sources" loading="lazy" />
          <figcaption>English question, bilingual sources — note the AR badge on citation [1]: the answer assembles from whichever language version ranks best.</figcaption>
        </figure>
        <figure>
          <img src="assets/Out-of-corpus-prompt.png" alt="Out-of-corpus question triggering the fixed abstention template" loading="lazy" />
          <figcaption>Out-of-corpus question → deterministic abstention template, no improvisation.</figcaption>
        </figure>
      </div>

      <h4>Stack</h4>
      <p>
        Python, BGE-M3 embeddings (sentence-transformers), Anthropic API (generation + LLM judge), FastAPI,
        single-file React chat UI, custom crawler/extractor — no vector DB by choice: 1,133 chunks × 1024
        dims is one visible matmul.
      </p>
    </ProjectSection>
  );
}
