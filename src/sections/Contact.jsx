import WarpBackground from '../components/WarpBackground.jsx';

export default function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="wrap">
        <WarpBackground className="contact-warp reveal">
          <div className="contact-inner">
            <p className="contact-line">Email is fastest.</p>
            <div className="contact-links" style={{ marginTop: 0 }}>
              <a href="mailto:adelaziz1311@gmail.com">email → adelaziz1311@gmail.com</a>
              <a href="https://github.com/Adel-10" target="_blank" rel="noopener noreferrer">github → Adel-10</a>
              <a href="https://www.linkedin.com/in/adel-mithaiwala-a1b938278/" target="_blank" rel="noopener noreferrer">linkedin → Adel Mithaiwala</a>
            </div>
          </div>
        </WarpBackground>
      </div>
    </section>
  );
}
