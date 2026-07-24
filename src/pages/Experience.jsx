import { useRef } from 'react';
import { Link } from 'react-router-dom';
import useReveal from '../useReveal.js';
import useExperienceScrolly from '../useExperienceScrolly.js';
import PageHeader from '../components/PageHeader.jsx';
import CurvedLoop from '../components/text/CurvedLoop.jsx';

// Two horizontal rides: professional experience, then leadership.
export default function Experience() {
  useReveal();
  const main = useRef(null);
  useExperienceScrolly(main);
  return (
    <main className="page" ref={main}>
      <PageHeader
        tag="Experience"
        title={
          <>
            <span className="sr-only">Experience</span>
            <CurvedLoop marqueeText="Experience ✦ KPMG ✦ Batelco ✦ King's ✦" curveAmount={110} />
          </>
        }
        sub="Two rides ahead — professional, then leadership. (Drag the ribbon. Then keep scrolling: this page drives sideways.)"
        background="hyperspeed"
      />

      {/* ===== ride 1: professional ===== */}
      <section className="xp" id="experience">
        <div className="wrap xp-heading">
          <div className="sec-tag reveal">Ride 1</div>
          <h2 className="reveal">Professional experience</h2>
        </div>
        <div className="xp-pin">
          <div className="xp-track">

            <article className="project xp-panel" style={{ '--xc': 'var(--c-red)' }}>
              <div className="xp-co">KPMG</div>
              <div className="xp-meta">AI Team Intern · Jun 2025 – Aug 2025</div>
              <p className="xp-li">Built full-stack features (React + Node) integrating Azure OpenAI for AI-assisted workflows.</p>
              <p className="xp-li">Built multi-agent RAG systems for multiple use cases, with robust routing logic.</p>
              <p className="xp-li">Shipped a csv/xlsx → SQL converter with LLM-generated descriptions and insights, stored in Cosmos DB.</p>
              <p className="xp-li">Cut latency under real production load: token-aware prompts, streaming, caching, careful model selection.</p>
              <p className="xp-li">Authored design docs, led stakeholder demos, scoped requirements with the BA team.</p>
              <div className="xp-chips">
                <span>React</span><span>Node.js</span><span>Azure OpenAI</span><span>Cosmos DB</span>
              </div>
            </article>

            <article className="project xp-panel" style={{ '--xc': 'var(--c-blue)' }}>
              <div className="xp-co">Batelco</div>
              <div className="xp-meta">Summer Intern · Jun 2023 – Aug 2023 · Bahrain's leading telco</div>
              <div className="xp-big">−15%<span className="xp-big-lbl">support-ticket backlog</span></div>
              <p className="xp-li">Hands-on application development with the software engineering team, on real deliverables.</p>
              <p className="xp-li">Worked Agile and DevOps practices into feature production and cross-team collaboration.</p>
              <p className="xp-li">Handled support tickets on Batelco's internal DB systems for a base of 1M+ subscribers.</p>
              <div className="xp-chips">
                <span>Agile</span><span>DevOps</span><span>SQL</span>
              </div>
            </article>

          </div>
          <div className="xp-hint" aria-hidden="true">keep scrolling →</div>
        </div>
      </section>

      {/* ===== ride 2: leadership ===== */}
      <section className="xp" id="leadership">
        <div className="wrap xp-heading">
          <div className="sec-tag reveal">Ride 2</div>
          <h2 className="reveal">Leadership experience</h2>
        </div>
        <div className="xp-pin">
          <div className="xp-track">

            <article className="project xp-panel" style={{ '--xc': 'var(--c-purple)' }}>
              <div className="xp-co">Engagement lead</div>
              <div className="xp-meta">Executive Student Engagement Associate · King's Business School (Joint Honours) · Sep 2024 – May 2025</div>
              <div className="xp-big">75<span className="xp-big-lbl">first-years mentored by the team I led</span></div>
              <p className="xp-li">Led a team of 2nd- and 3rd-year associates easing new students into university life across the Joint Honours programmes (CS, Maths, and Languages with Management) — mentoring 6–7 first-years personally alongside managing the team.</p>
              <p className="xp-li">Ran regular one-to-ones to keep mentees on track, advising on academics, study habits, and life at King's.</p>
              <p className="xp-li">Organized workshops for the modules first-years struggle with most — study strategy plus plain-language walkthroughs of the hard concepts.</p>
              <p className="xp-li">Pitched initiatives to faculty with demos and presentations, secured the funding, then delivered them — including community events that made Joint Honours feel like a home.</p>
              <div className="xp-chips">
                <span>Team leadership</span><span>Mentoring</span><span>Stakeholder pitches</span>
              </div>
            </article>

            <article className="project xp-panel" style={{ '--xc': 'var(--c-green)' }}>
              <div className="xp-co">Student rep</div>
              <div className="xp-meta">Student Representative, Informatics · King's College London · Sep 2023 – May 2025 · elected two years running</div>
              <div className="xp-big">200+<span className="xp-big-lbl">students represented, across two years</span></div>
              <p className="xp-li">Collected and aggregated cohort sentiment on the course at regular intervals — turning 200+ individual opinions into a signal faculty could act on.</p>
              <p className="xp-li">Served as the bridge between students and faculty, voicing concerns in faculty meetings and pushing for responsible, inclusive changes to projects, modules, and timelines students found unfair.</p>
              <p className="xp-li">Handled individual concerns with care and follow-through, signposting King's resources where they existed and escalating where they didn't.</p>
              <p className="xp-li">Helped foster a tight-knit, inclusive community within the Informatics department.</p>
              <div className="xp-chips">
                <span>Advocacy</span><span>Faculty liaison</span><span>Elected ×2</span>
              </div>
            </article>

            <article className="project xp-panel" style={{ '--xc': 'var(--c-orange)' }}>
              <div className="xp-co">PhD mentee</div>
              <div className="xp-meta">Informatics PhD Mentorship Scheme · King's College London · Jan 2024 – Mar 2024</div>
              <p className="xp-li">Paired with a PhD researcher in Human-Computer Interaction — shadowed their work and learned how doctoral research actually runs day to day.</p>
              <p className="xp-li">Brought my own research on HCI to each session, digging a level deeper every time, sharpened by my mentor's supervision and discussion.</p>
              <p className="xp-li">Closed the programme by presenting what I'd learned to the full cohort of PhD mentors and mentees.</p>
              <div className="xp-chips">
                <span>HCI</span><span>Research</span><span>Presenting</span>
              </div>
            </article>

            <article className="project xp-panel xp-next" style={{ '--xc': 'var(--c-red)' }}>
              <div className="xp-co">Your team?</div>
              <div className="xp-meta">One-year ML/AI engineering role · before the master's</div>
              <p className="xp-li">
                The projects page shows what I build and how I measure it; this page shows how I work
                with people. The next panel could be yours.
              </p>
              <Link className="xp-cta" to="/contact">get in touch →</Link>
            </article>

          </div>
        </div>
      </section>
    </main>
  );
}
