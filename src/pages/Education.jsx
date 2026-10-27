import { lazy, Suspense, useRef } from 'react';
import useReveal from '../useReveal.js';
import useEducationScrolly from '../useEducationScrolly.js';
import PageHeader from '../components/PageHeader.jsx';
import FallingText from '../components/text/FallingText.jsx';

const Lanyard = lazy(() => import('../components/lanyard/Lanyard.jsx'));

// Chronological climb: school → foundation → BSc → what's next, with the KCL
// lanyard pinned alongside. Confetti at "first-class with distinction".
export default function Education() {
  useReveal();
  const main = useRef(null);
  useEducationScrolly(main);
  return (
    <main id="main-content" className="page" ref={main} tabIndex="-1">
      <PageHeader
        tag="Education"
        title={
          <FallingText
            text="Education — first-class degree, foundation year, top of class"
            highlightWords={['Education', 'first-class']}
          />
        }
        titleLabel="Education — first-class degree, foundation year, top of class"
        sub="Formal training behind the projects."
        background="dot-grid"
      />
      <section id="education" className="edu">
        <div className="wrap edu-grid">
          <div className="edu-story">
            <div className="edu-line" aria-hidden="true"><span className="edu-line-fill" /></div>

            <article className="milestone" style={{ '--ms': 'var(--c-orange)' }}>
              <div className="ms-year">2022</div>
              <div className="entry ms-body">
                <h3>Ibn Khuldoon National School — Bahrain</h3>
                <div className="meta">Graduated Sep 2022 · top of the graduating class</div>
                <p>
                  Awards for academic excellence, personal and citizenship qualities, and physical
                  performance. The launchpad.
                </p>
              </div>
            </article>

            <article className="milestone" style={{ '--ms': 'var(--c-green)' }}>
              <div className="ms-year">’22–’23</div>
              <div className="entry ms-body">
                <h3>Computer Science Foundation Year — King's College London</h3>
                <div className="meta">Sep 2022 – Jul 2023 · London</div>
                <p>
                  3 A* equivalents across Computer Science, Information Technology, and Mathematics —
                  a clean sweep into the degree.
                </p>
              </div>
            </article>

            <article className="milestone ms-confetti" style={{ '--ms': 'var(--c-red)' }}>
              <div className="ms-year">’23–’26</div>
              <div className="entry ms-body">
                <h3>BSc (Hons) Computer Science with Management — King's College London</h3>
                <div className="meta">Sep 2023 – Jul 2026 · First-class honours, with distinction 🎉</div>
                <p>
                  Key modules: Machine Learning, Software Engineering, Databases, Operating Systems,
                  International Business, Money and Banking, Business Strategy.
                </p>
                <p>
                  Dissertation: a React Native news app with fully on-device summarisation — MiniLM
                  embeddings and a modular ranking pipeline (relevance, position bias, MMR, adjacency)
                  through ONNX Runtime, with a custom tokenizer, offline caching, and full Jest coverage.
                </p>
                <p>
                  Student Representative for the course; mentored 75 first-year students as an
                  Executive Engagement Associate.
                </p>
              </div>
            </article>

          </div>

          <aside className="edu-side" aria-label="KCL student card">
            <div className="lanyard-wrap edu-lanyard">
              <Suspense fallback={null}>
                <Lanyard />
              </Suspense>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
