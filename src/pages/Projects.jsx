import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const RAIL = [
  ['project-rag', 'chapter-rag', 'Bilingual RAG'],
  ['project-finetune', 'chapter-finetune', 'Dialect fine-tune'],
  ['project-gpt', 'chapter-gpt', 'shakespeare-gpt'],
  ['project-agent', 'chapter-agent', 'minimal-agent'],
  ['project-cik8s', 'chapter-cik8s', 'CI/CD pipeline to Kubernetes']
];

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Projects() {
  useReveal();
  const main = useRef(null);
  useProjectsScrolly(main);

  function jumpToChapter(chapterId) {
    const chapter = document.getElementById(chapterId);
    if (!chapter) return;

    // Pinned chapters occupy extra scroll distance that native scrollIntoView
    // does not account for reliably while it is animating. Use the measured
    // ScrollTrigger start so every rail item lands in one click.
    ScrollTrigger.refresh();
    const pin = ScrollTrigger.getAll().find(trigger => trigger.trigger === chapter && trigger.pin);
    const destination = pin?.start ?? (window.scrollY + chapter.getBoundingClientRect().top);
    gsap.to(window, {
      duration: REDUCED ? 0 : 0.85,
      scrollTo: { y: destination + 1, autoKill: false },
      ease: REDUCED ? 'none' : 'power2.inOut',
      overwrite: 'auto'
    });
  }

  return (
    <main id="main-content" className="page" ref={main} tabIndex="-1">
      <PageHeader
        title={<DecryptedText text="Featured projects" speed={40} />}
        titleLabel="Featured projects"
        sub="Five projects, built end to end."
        background="grid-scan"
      />

      {/* fixed progress rail (hidden on narrow viewports) */}
      <aside className="rail" aria-label="Project navigation">
        <span className="rail-line"><span className="rail-bar" /></span>
        {RAIL.map(([id, chapterId, label]) => (
          <button
            key={id}
            data-rail={id}
            aria-label={`Jump to ${label}`}
            onClick={() => jumpToChapter(chapterId)}
          >
            <span className="dot" />{label}
          </button>
        ))}
      </aside>

      <ChapterIntro
        id="chapter-rag"
        num="01" hue="#ff4d4d"
        title="Bilingual RAG"
        kicker="Ask in English. It answers from Arabic law with citations."
      />
      <RagProject />

      <ChapterIntro
        id="chapter-finetune"
        num="02" hue="#ff9f1c"
        title="Dialect fine-tune"
        kicker="Teaching a 118M-parameter embedder to read Bahraini Arabic in texting."
      />
      <FinetuneProject />

      <ChapterIntro
        id="chapter-gpt"
        num="03" hue="#3b82f6"
        title="shakespeare-gpt"
        kicker="A transformer written from first principles."
      />
      <GptProject />

      <ChapterIntro
        id="chapter-agent"
        num="04" hue="#2ec27e"
        title="minimal-agent"
        kicker="A loop, some tools, and one message history."
      />
      <AgentProject />

      <ChapterIntro
        id="chapter-cik8s"
        num="05" hue="#8b5cf6"
        title="CI/CD pipeline to Kubernetes"
        kicker="Models that never ship don't matter."
      />
      <CiK8sProject />
    </main>
  );
}
