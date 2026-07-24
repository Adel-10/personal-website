import SectionBackground from './SectionBackground.jsx';

// A full-width section with an optional animated React Bits background behind a glass project card.
// Omit `background` for a plain themed section.
export default function ProjectSection({ id, background, children }) {
  return (
    <section className="project-section" id={id}>
      {background && <SectionBackground kind={background} />}
      <div className="wrap">
        {/* no .reveal here — the Projects page's ScrollTrigger scenes own card entrances */}
        <article className="project">{children}</article>
      </div>
    </section>
  );
}
