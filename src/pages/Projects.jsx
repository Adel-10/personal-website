import { useRef } from 'react';
import useReveal from '../useReveal.js';
import useProjectsScrolly from '../useProjectsScrolly.js';
import PageHeader from '../components/PageHeader.jsx';
import ChapterIntro from '../components/ChapterIntro.jsx';
import DecryptedText from '../components/text/DecryptedText.jsx';
import RagProject from '../sections/projects/RagProject.jsx';
import FinetuneProject from '../sections/projects/FinetuneProject.jsx';
import GptProject from '../sections/projects/GptProject.jsx';
import AgentProject from '../sections/projects/AgentProject.jsx';
import CiK8sProject from '../sections/projects/CiK8sProject.jsx';

const RAIL = [
  ['project-rag', 'Bilingual RAG'],
  ['project-finetune', 'Dialect fine-tune'],
  ['project-gpt', 'shakespeare-gpt'],
  ['project-agent', 'minimal-agent'],
  ['project-cik8s', 'ci-k8s']
];

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Projects() {
  useReveal();
  const main = useRef(null);
  useProjectsScrolly(main);
  return (
    <main className="page" ref={main}>
      <PageHeader
        tag="Work"
        title={<DecryptedText text="Featured projects" speed={40} />}
        sub="Five projects, built end to end. Every number below is a real, measured artifact — training curves, eval tables, screenshots."
        background="grid-scan"
      />

      {/* fixed progress rail (hidden on narrow viewports) */}
      <aside className="rail" aria-label="Project navigation">
        <span className="rail-line"><span className="rail-bar" /></span>
        {RAIL.map(([id, label]) => (
          <button
            key={id}
            data-rail={id}
            onClick={() =>
              document.getElementById(id)?.scrollIntoView({
                behavior: REDUCED ? 'auto' : 'smooth',
                block: 'start'
              })
            }
          >
            <span className="dot" />{label}
          </button>
        ))}
      </aside>

      <ChapterIntro
        num="01" hue="#ff4d4d"
        title="Bilingual RAG"
        kicker="Ask in English. It answers from Arabic law — with citations, or not at all."
      />
      <RagProject />

      <ChapterIntro
        num="02" hue="#ff9f1c"
        title="Dialect fine-tune"
        kicker="Teaching a 118M-parameter embedder to read Bahraini texting-register Arabic."
      />
      <FinetuneProject />

      <ChapterIntro
        num="03" hue="#3b82f6"
        title="shakespeare-gpt"
        kicker="A transformer written from first principles — attention and all."
      />
      <GptProject />

      <ChapterIntro
        num="04" hue="#2ec27e"
        title="minimal-agent"
        kicker="What an agent actually is: a loop, some tools, and one message history."
      />
      <AgentProject />

      <ChapterIntro
        num="05" hue="#8b5cf6"
        title="ci-k8s"
        kicker="Because models that never ship don't matter."
      />
      <CiK8sProject />
    </main>
  );
}
