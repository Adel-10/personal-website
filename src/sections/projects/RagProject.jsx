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
        services in English or Arabic, retrieving from a corpus that contains both because some content
        (board resolutions and several laws) exists only in Arabic. Every answer cites the official page it
        came from, and when the corpus doesn't cover a question, the system abstains with a fixed template
        instead of guessing.
      </p>

      <h4>Architecture</h4>
      <pre>{`crawl (manifest-driven, EN+AR) → extract (deterministic, structure-preserving)
  → chunk (section-aware, tables atomic) → embed (`}<span className="hl">BGE-M3</span>{`, shared EN/AR space)
  → retrieve (bilingual query expansion, exact cosine via one matmul)
  → gate (relevance threshold → hard abstention)
  → generate (grounding-only prompt, [n] citations)
  → post-check (citation mapping; NOT_IN_SOURCES marker → fixed template)`}</pre>

      <p>
        The core idea is that English and Arabic share one embedding space, so a question in either language
        can find a passage in either. This proved to be the case on this corpus: chunks that are translations
        of each other average a cosine similarity of <strong>0.78</strong>, while random English–Arabic pairs
        average <strong>0.55</strong>. This means that the meaning of a passage matters far more than which
        language it is written in. The one case that failed at first was a casual English question about a law
        that exists only in formal Arabic. The fix was to translate the question at query time, embed both
        versions, and score each chunk by whichever version matches it better. Translating questions resulted
        in those hard questions finding the right law at rank 1 or 2. The index remains entirely official
        text; no LLM-generated text ever enters the index of a civic-information system.
      </p>

      <p>
        Refusal is built into the code rather than left to the prompt, at three points. If nothing scores above
        a relevance threshold, the language model is never called. If the language model is called, the prompt
        allows answers only from the retrieved sources and requires a specific marker when they don't cover
        the question. An answer that cites nothing isn't shown as fact. Whenever the system refuses, it shows
        a fixed message pointing to LMRA instead of the model's own wording. In testing, the model kept
        suggesting other government offices even when told not to. In practice, the marker did most of the
        work: five of the six out-of-scope test questions scored above the threshold and were caught by the
        model's own refusal.
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
        The table above comes from questions the system was tuned against, and 24 of them are LMRA's own FAQ
        questions, word for word. So 15 new questions were written and run exactly once, with the results kept
        as they came out: 12/12 for retrieval, 10/10 for citations, 10/10 for faithfulness, and 3/3 for
        cross-lingual questions. Two answerable questions were still refused, both two-part questions where
        the right page ranked first. In one, the model judged that the page only answered half the question,
        and the all-or-nothing refusal rule turned that into a refusal. In the other, the top score (0.602)
        fell just under the 0.62 threshold. That's the price of erring on the side of caution, and fixing it
        would take two different changes. The evaluation also caught two bugs during development. One was a
        chunking bug that silently dropped section headings, which made whole FAQ questions impossible to
        find. The other was an answer that gave a misattributed hotline to the wrong office, which no
        string-matching check would have spotted.
      </p>

      <div className="figrow">
        <figure>
          <img src="assets/English-prompt.png" alt="English question answered with citations from both English and Arabic sources" loading="lazy" />
          <figcaption>An English question answered from both versions of the same LMRA page: source [1] is the Arabic page (note the AR badge) and [3] the English one, because the answer draws on whichever version is ranked best.</figcaption>
        </figure>
        <figure>
          <img src="assets/Out-of-corpus-prompt.png" alt="Out-of-corpus question triggering the fixed abstention template" loading="lazy" />
          <figcaption>Out-of-corpus question → deterministic abstention template, no improvisation.</figcaption>
        </figure>
      </div>

      <h4>Stack</h4>
      <p>
        Python, BGE-M3 embeddings via sentence-transformers, and the Anthropic API: Claude Haiku translates
        questions, and Claude Sonnet answers them and grades faithfulness. The rest is FastAPI, a single-file
        React chat page, and a custom crawler and HTML extractor. There's no vector database, on purpose. At
        this scale—1,133 chunks by 1,024 dimensions—retrieval is one matrix multiplication that takes about a
        millisecond.
      </p>
    </ProjectSection>
  );
}
