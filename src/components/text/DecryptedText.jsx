import { useEffect, useRef, useState } from 'react';

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}—=+*^?#';

// React Bits "Decrypted Text" (dependency-free port): characters scramble,
// then reveal left-to-right when the element scrolls into view.
export default function DecryptedText({ text, speed = 45, className = '' }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(text);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (REDUCED) return;
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setStarted(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started || REDUCED) return;
    let revealed = 0;
    const id = setInterval(() => {
      revealed += 1;
      if (revealed >= text.length) {
        setDisplay(text);
        clearInterval(id);
        return;
      }
      setDisplay(
        text.split('').map((ch, idx) =>
          idx < revealed || ch === ' ' ? ch : CHARS[(Math.random() * CHARS.length) | 0]
        ).join('')
      );
    }, speed);
    return () => clearInterval(id);
  }, [started, text, speed]);

  return <span ref={ref} className={`decrypted-text ${className}`} aria-label={text}>{display}</span>;
}
