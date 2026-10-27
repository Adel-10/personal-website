import useReveal from '../useReveal.js';
import PageHeader from '../components/PageHeader.jsx';
import TextType from '../components/text/TextType.jsx';
import SkillSignalBoard from '../components/SkillSignalBoard.jsx';

export default function Skills() {
  useReveal();
  return (
    <main id="main-content" className="page" tabIndex="-1">
      <PageHeader
        tag="Capabilities"
        title={<TextType texts={[
          'The skill signal board',
          'Pull on the system',
          'See what connects'
        ]} />}
        titleLabel="The skill signal board"
        sub="Six channels connecting field-tested capabilities, concrete tools, and the work behind every claim."
        background="liquid-ether"
      />
      <SkillSignalBoard />
    </main>
  );
}
