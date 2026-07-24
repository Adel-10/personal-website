// Dependency-free confetti burst in candle colors. Returns a cancel function.
const CANDLES = ['#ff4d4d', '#ff9f1c', '#ffd23f', '#2ec27e', '#3b82f6', '#8b5cf6'];

export default function burstConfetti(host) {
  const c = document.createElement('canvas');
  const r = host.getBoundingClientRect();
  c.width = r.width;
  c.height = 340;
  Object.assign(c.style, {
    position: 'absolute', left: '0', top: '-60px',
    width: '100%', height: '340px',
    pointerEvents: 'none', zIndex: 5
  });
  host.appendChild(c);
  const x = c.getContext('2d');
  const parts = Array.from({ length: 90 }, () => ({
    x: c.width / 2 + (Math.random() - 0.5) * 120, y: 190,
    vx: (Math.random() - 0.5) * 9, vy: -4 - Math.random() * 7,
    s: 4 + Math.random() * 5,
    rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
    col: CANDLES[(Math.random() * CANDLES.length) | 0]
  }));
  let frames = 0, raf;
  const tick = () => {
    x.clearRect(0, 0, c.width, c.height);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.rot += p.vr;
      x.save(); x.translate(p.x, p.y); x.rotate(p.rot);
      x.fillStyle = p.col; x.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      x.restore();
    });
    if (++frames < 140) raf = requestAnimationFrame(tick);
    else c.remove();
  };
  tick();
  return () => { cancelAnimationFrame(raf); c.remove(); };
}
