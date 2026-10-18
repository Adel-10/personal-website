import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_META = {
  title: 'Adel Mithaiwala — ML/AI Engineer',
  description: "Adel Mithaiwala is a first-class King's College London Computer Science with Management graduate building measured, end-to-end ML/AI systems."
};

const ROUTE_META = {
  '/': DEFAULT_META,
  '/projects': {
    title: 'Projects — Adel Mithaiwala',
    description: 'Measured work across bilingual RAG, Arabic dialect fine-tuning, a from-scratch GPT, a minimal agent loop, and Kubernetes delivery.'
  },
  '/skills': {
    title: 'Skills — Adel Mithaiwala',
    description: 'Field-tested capabilities across deep learning, retrieval, LLM systems, evaluation, software engineering, and delivery.'
  },
  '/education': {
    title: 'Education — Adel Mithaiwala',
    description: "A first-class BSc (Hons) Computer Science with Management from King's College London, with distinction."
  },
  '/experience': {
    title: 'Experience — Adel Mithaiwala',
    description: "AI engineering, software development, mentoring, and student leadership experience at KPMG, Batelco, and King's College London."
  },
  '/contact': {
    title: 'Contact — Adel Mithaiwala',
    description: 'Contact Adel Mithaiwala about a one-year ML/AI engineering role before his AI/ML master’s.'
  }
};

function setMeta(selector, value) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute('content', value);
}

function setOpenGraphUrl(value) {
  let element = document.head.querySelector('meta[property="og:url"]');
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', 'og:url');
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
}

function setCanonical(value) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', value);
}

export default function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = ROUTE_META[pathname] ?? DEFAULT_META;
    const routeHash = pathname === '/' ? '' : `#${pathname}`;
    const routeUrl = `${window.location.origin}${window.location.pathname}${routeHash}`;

    document.title = meta.title;
    setMeta('meta[name="description"]', meta.description);
    setMeta('meta[property="og:title"]', meta.title);
    setMeta('meta[property="og:description"]', meta.description);
    setOpenGraphUrl(routeUrl);
    setMeta('meta[name="twitter:title"]', meta.title);
    setMeta('meta[name="twitter:description"]', meta.description);

    setCanonical(routeUrl);
  }, [pathname]);

  return null;
}
