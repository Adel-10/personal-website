import { lazy, Suspense, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Nav from './sections/Nav.jsx';
import CoolModeZone from './components/CoolModeZone.jsx';
import RouteMetadata from './components/RouteMetadata.jsx';
import Home from './pages/Home.jsx';

// Keep Home in the initial bundle; fetch every other page only when it is visited.
const Projects = lazy(() => import('./pages/Projects.jsx'));
const Skills = lazy(() => import('./pages/Skills.jsx'));
const Education = lazy(() => import('./pages/Education.jsx'));
const Experience = lazy(() => import('./pages/Experience.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));

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
        <Suspense
          fallback={
            <main id="main-content" className="page" tabIndex="-1" aria-busy="true">
              <div className="wrap" role="status">Loading page…</div>
            </main>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/education" element={<Education />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
    </HashRouter>
  );
}
