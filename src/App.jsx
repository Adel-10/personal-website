import { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Nav from './sections/Nav.jsx';
import CoolModeZone from './components/CoolModeZone.jsx';
import RouteMetadata from './components/RouteMetadata.jsx';
import Home from './pages/Home.jsx';
import Projects from './pages/Projects.jsx';
import Skills from './pages/Skills.jsx';
import Education from './pages/Education.jsx';
import Experience from './pages/Experience.jsx';
import Contact from './pages/Contact.jsx';

// HashRouter so the built site keeps working from any static path (matches base: './').
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  function skipToMain(event) {
    event.preventDefault();
    const main = document.getElementById('main-content');
    if (!main) return;
    main.focus({ preventScroll: true });
    main.scrollIntoView({ block: 'start' });
  }

  return (
    <HashRouter>
        <ScrollToTop />
        <RouteMetadata />
        <div className="ambient" aria-hidden="true" />
        <CoolModeZone />
        <a className="skip-link" href="#main-content" onClick={skipToMain}>Skip to main content</a>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/education" element={<Education />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
    </HashRouter>
  );
}
