import { useEffect, useState } from 'react';

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// React Bits "Text Type" (dependency-free port): typewriter that types,
// pauses, deletes, and cycles through an array of strings.
export default function TextType({
  texts,
  typingSpeed = 65,
  deletingSpeed = 32,
  pauseDuration = 2200,
  className = ''
}) {
  const [i, setI] = useState(0);
  const [len, setLen] = useState(REDUCED ? texts[0].length : 0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (REDUCED) return;
    const full = texts[i];
    let t;
    if (!deleting && len < full.length) {
      t = setTimeout(() => setLen(l => l + 1), typingSpeed);
    } else if (!deleting && len === full.length) {
      t = setTimeout(() => setDeleting(true), pauseDuration);
    } else if (deleting && len > 0) {
      t = setTimeout(() => setLen(l => l - 1), deletingSpeed);
    } else if (deleting) {
      setDeleting(false);
      setI(v => (v + 1) % texts.length);
    }
    return () => clearTimeout(t);
  }, [len, deleting, i, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={`text-type ${className}`} aria-label={texts[0]}>
      <span aria-hidden="true">
        {texts[i].slice(0, len)}
        <span className="tt-cursor">|</span>
      </span>
    </span>
  );
}
