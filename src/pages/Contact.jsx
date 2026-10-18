import useReveal from '../useReveal.js';
import PageHeader from '../components/PageHeader.jsx';
import ContactSection from '../sections/Contact.jsx';

export default function Contact() {
  useReveal();
  return (
    <main id="main-content" className="page" tabIndex="-1">
      <PageHeader
        tag="Get in touch"
        title="Contact"
        sub="I'm looking for a one-year ML/AI engineering role starting soon, before I begin an AI/ML master's. If any of the work above is relevant to your team, I'd like to hear from you."
        background="particles"
      />
      <ContactSection />
    </main>
  );
}
