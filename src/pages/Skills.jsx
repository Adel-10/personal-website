import { Link } from 'react-router-dom';
import useReveal from '../useReveal.js';
import PageHeader from '../components/PageHeader.jsx';
import TextType from '../components/text/TextType.jsx';
import SkillTree from '../components/SkillTree.jsx';
import ToolSphere from '../components/ToolSphere.jsx';

// Skills = a video-game skill tree. Click nodes, read proof, explore them all.
export default function Skills() {
  useReveal();
  return (
    <main className="page">
      <PageHeader
        tag="Capabilities"
        title={<TextType texts={[
          'The skill tree',
          'Click a node. Any node.',
          'Explore all 24 — something nice happens'
        ]} />}
        sub="Six branches, all demonstrated in shipped projects — every node links to its proof."
        background="liquid-ether"
      />
      <SkillTree />
      <ToolSphere />
      <section className="stree-cta">
        <div className="wrap">
          <p className="reveal">
            Prefer receipts over trees? <Link to="/projects">The projects page has the eval tables. →</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
