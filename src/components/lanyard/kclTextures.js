// KCL-branded card + strap artwork, drawn on canvas.
// Real KCL images (any aspect ratio — they get composited, not stretched) go in
// public/assets/lanyard/:
//   wordmark.png — the red "King's College London" wordmark → card front
//   crest.png    — the coat of arms → card back
//   strap.png    — optional, ~1024x128, tiles along the strap
// Lanyard.jsx loads those if present and falls back to the fully drawn versions.

export const KCL_RED = '#e2231b';
const KCL_RED_DARK = '#b3160f';
const OFF_WHITE = '#f6f3ee';
const INK = '#1d1a17';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// simple heraldic-style crown
function drawCrown(ctx, cx, cy, w, color) {
  const h = w * 0.62;
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, cy + h / 2);
  ctx.lineTo(cx - w / 2, cy - h * 0.1);
  ctx.lineTo(cx - w * 0.25, cy + h * 0.12);
  ctx.lineTo(cx, cy - h / 2);
  ctx.lineTo(cx + w * 0.25, cy + h * 0.12);
  ctx.lineTo(cx + w / 2, cy - h * 0.1);
  ctx.lineTo(cx + w / 2, cy + h / 2);
  ctx.closePath();
  ctx.fill();
  // band
  ctx.fillRect(cx - w / 2, cy + h / 2, w, h * 0.18);
  // pearls
  [-w / 2, 0, w / 2].forEach(dx => {
    ctx.beginPath();
    ctx.arc(cx + dx, cy - (dx === 0 ? h / 2 : h * 0.1), w * 0.06, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

export function makeFrontCanvas() {
  const c = document.createElement('canvas');
  c.width = 640; c.height = 1000;
  const x = c.getContext('2d');

  x.fillStyle = OFF_WHITE;
  x.fillRect(0, 0, 640, 1000);

  // red header band
  x.fillStyle = KCL_RED;
  x.fillRect(0, 0, 640, 270);
  drawCrown(x, 320, 78, 74, '#ffffff');
  x.fillStyle = '#ffffff';
  x.textAlign = 'center';
  x.font = '600 58px Georgia, "Times New Roman", serif';
  x.fillText("King's College", 320, 182);
  x.fillText('London', 320, 244);

  // avatar
  x.beginPath(); x.arc(320, 430, 118, 0, Math.PI * 2);
  x.fillStyle = '#ffffff'; x.fill();
  x.lineWidth = 8; x.strokeStyle = KCL_RED; x.stroke();
  x.fillStyle = KCL_RED;
  x.font = '700 96px -apple-system, "Segoe UI", Arial, sans-serif';
  x.fillText('AM', 320, 465);

  // name + degree
  x.fillStyle = INK;
  x.font = '700 46px -apple-system, "Segoe UI", Arial, sans-serif';
  x.fillText('ADEL MITHAIWALA', 320, 640);
  x.fillStyle = '#5a544d';
  x.font = '400 32px -apple-system, "Segoe UI", Arial, sans-serif';
  x.fillText('BSc Computer Science', 320, 696);
  x.fillText('with Management', 320, 738);
  x.font = '400 27px ui-monospace, Menlo, monospace';
  x.fillText('2022 – 2026', 320, 800);

  // STUDENT chip
  x.fillStyle = KCL_RED;
  roundRect(x, 226, 838, 188, 56, 28); x.fill();
  x.fillStyle = '#ffffff';
  x.font = '700 27px -apple-system, "Segoe UI", Arial, sans-serif';
  x.fillText('STUDENT', 320, 875);

  // footer strip
  x.fillStyle = KCL_RED;
  x.fillRect(0, 972, 640, 28);
  return c;
}

export function makeBackCanvas() {
  const c = document.createElement('canvas');
  c.width = 640; c.height = 1000;
  const x = c.getContext('2d');

  x.fillStyle = KCL_RED;
  x.fillRect(0, 0, 640, 1000);
  x.fillStyle = KCL_RED_DARK;
  x.fillRect(0, 0, 640, 14);
  x.fillRect(0, 986, 640, 14);

  drawCrown(x, 320, 150, 96, '#ffffff');
  x.fillStyle = '#ffffff';
  x.textAlign = 'center';
  x.font = 'italic 600 44px Georgia, "Times New Roman", serif';
  x.fillText('Sancte et Sapienter', 320, 300);

  x.strokeStyle = 'rgba(255,255,255,.55)';
  x.lineWidth = 2;
  x.beginPath(); x.moveTo(150, 344); x.lineTo(490, 344); x.stroke();

  x.font = '600 34px -apple-system, "Segoe UI", Arial, sans-serif';
  x.fillText('First-class honours', 320, 416);
  x.fillText('with distinction', 320, 464);
  x.font = '400 27px -apple-system, "Segoe UI", Arial, sans-serif';
  x.fillStyle = 'rgba(255,255,255,.85)';
  x.fillText('Strand Campus · London', 320, 530);

  // barcode
  x.fillStyle = '#ffffff';
  roundRect(x, 120, 660, 400, 130, 10); x.fill();
  x.fillStyle = '#111';
  let bx = 145;
  // deterministic pseudo-random bar widths
  let seed = 7;
  while (bx < 480) {
    seed = (seed * 16807) % 2147483647;
    const w = 3 + (seed % 9);
    x.fillRect(bx, 678, w, 94);
    bx += w + 4 + (seed % 5);
  }
  x.fillStyle = 'rgba(255,255,255,.9)';
  x.font = '400 26px ui-monospace, Menlo, monospace';
  x.fillText('K22-1311 · kcl.ac.uk', 320, 856);
  return c;
}

// draw `img` inside box (cx-centered), aspect preserved
function fitImage(ctx, img, cx, cy, maxW, maxH) {
  const s = Math.min(maxW / img.width, maxH / img.height);
  const w = img.width * s, h = img.height * s;
  ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
}

// Front using the official wordmark image (red background, so it blends into a red card).
export function makeFrontCanvasWith(wordmark) {
  const c = document.createElement('canvas');
  c.width = 640; c.height = 1000;
  const x = c.getContext('2d');
  x.fillStyle = KCL_RED;
  x.fillRect(0, 0, 640, 1000);
  fitImage(x, wordmark, 320, 330, 520, 420);

  x.strokeStyle = 'rgba(255,255,255,.5)';
  x.lineWidth = 2;
  x.beginPath(); x.moveTo(120, 620); x.lineTo(520, 620); x.stroke();

  x.fillStyle = '#ffffff';
  x.textAlign = 'center';
  x.font = '700 44px -apple-system, "Segoe UI", Arial, sans-serif';
  x.fillText('ADEL MITHAIWALA', 320, 712);
  x.font = '400 30px -apple-system, "Segoe UI", Arial, sans-serif';
  x.fillStyle = 'rgba(255,255,255,.92)';
  x.fillText('BSc Computer Science', 320, 768);
  x.fillText('with Management', 320, 808);
  x.font = '400 26px ui-monospace, Menlo, monospace';
  x.fillText('2022 – 2026', 320, 872);

  roundRect(x, 244, 906, 152, 48, 24);
  x.fillStyle = '#ffffff'; x.fill();
  x.fillStyle = KCL_RED;
  x.font = '700 23px -apple-system, "Segoe UI", Arial, sans-serif';
  x.fillText('STUDENT', 320, 938);
  return c;
}

// Back using the coat of arms image (white background → off-white card).
export function makeBackCanvasWith(crest) {
  const c = document.createElement('canvas');
  c.width = 640; c.height = 1000;
  const x = c.getContext('2d');
  x.fillStyle = '#ffffff';
  x.fillRect(0, 0, 640, 1000);
  x.fillStyle = KCL_RED;
  x.fillRect(0, 0, 640, 22);

  fitImage(x, crest, 320, 400, 520, 620);

  x.fillStyle = '#1d1a17';
  x.textAlign = 'center';
  x.font = '600 33px -apple-system, "Segoe UI", Arial, sans-serif';
  x.fillText('First-class honours', 320, 810);
  x.fillText('with distinction', 320, 856);
  x.fillStyle = '#8a8378';
  x.font = '400 26px ui-monospace, Menlo, monospace';
  x.fillText('K22-1311 · kcl.ac.uk', 320, 924);

  x.fillStyle = KCL_RED;
  x.fillRect(0, 978, 640, 22);
  return c;
}

export function makeStrapCanvas() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 128;
  const x = c.getContext('2d');
  x.fillStyle = KCL_RED;
  x.fillRect(0, 0, 1024, 128);
  // edge stitching
  x.strokeStyle = 'rgba(255,255,255,.35)';
  x.lineWidth = 3;
  x.setLineDash([14, 10]);
  x.beginPath(); x.moveTo(0, 12); x.lineTo(1024, 12); x.stroke();
  x.beginPath(); x.moveTo(0, 116); x.lineTo(1024, 116); x.stroke();
  x.setLineDash([]);
  x.fillStyle = '#ffffff';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.font = '700 44px -apple-system, "Segoe UI", Arial, sans-serif';
  x.fillText("KING'S COLLEGE LONDON", 288, 68);
  x.font = '700 40px -apple-system, "Segoe UI", Arial, sans-serif';
  x.fillText('✦', 600, 66);
  x.font = 'italic 600 40px Georgia, serif';
  x.fillText('Sancte et Sapienter', 812, 68);
  return c;
}
