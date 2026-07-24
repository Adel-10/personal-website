import { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Nav from './sections/Nav.jsx';
import CoolModeZone from './components/CoolModeZone.jsx';
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
  return (
    <HashRouter>
        <ScrollToTop />
        <div className="ambient" aria-hidden="true" />
        <CoolModeZone />
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
        <footer>
          <div className="wrap">
            Adel Mithaiwala · Built with React, Vite and React Bits backgrounds — no trackers, no analytics.
            All figures and numbers are real artifacts from the linked repositories and their eval logs.
          </div>
        </footer>
    </HashRouter>
  );
}
