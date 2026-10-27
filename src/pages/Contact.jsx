import useReveal from '../useReveal.js';
import ContactSection from '../sections/Contact.jsx';

export default function Contact() {
  useReveal();
  return (
    <main id="main-content" className="page" tabIndex="-1">
      <h1 className="sr-only">Contact</h1>
      <ContactSection />
    </main>
  );
}
