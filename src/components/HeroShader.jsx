import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../theme.jsx';

// The hand-written ShaderGradient-style hero from v1 of the site, ported to React.
// Three drifting color blobs with domain warping + film grain; palette follows the theme.

const PALETTES = {
  dark: [
    0.040, 0.047, 0.071, // base  #0a0c12
    0.075, 0.310, 0.265, // deep teal
    0.165, 0.180, 0.485, // indigo
    0.235, 0.130, 0.400  // violet
  ],
  light: [
    0.957, 0.961, 0.976, // base  #f4f5f9
    0.700, 0.900, 0.845, // mint
    0.780, 0.800, 0.975, // periwinkle
    0.880, 0.820, 0.960  // lilac
  ]
};

const VSRC = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
const FSRC = `
precision highp float;
uniform vec2 u_res;
uniform float u_t;
uniform vec3 u_c0, u_c1, u_c2, u_c3;
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  uv += 0.16 * vec2(sin(uv.y * 2.6 + u_t * 0.35), cos(uv.x * 2.2 - u_t * 0.28));
  uv += 0.06 * vec2(sin(uv.y * 7.0 - u_t * 0.6), cos(uv.x * 6.0 + u_t * 0.5));
  vec2 p1 = 0.75 * vec2(sin(u_t * 0.21), cos(u_t * 0.17)) + vec2(-0.35, 0.18);
  vec2 p2 = 0.65 * vec2(cos(u_t * 0.16 + 2.1), sin(u_t * 0.23 + 1.3)) + vec2(0.55, -0.05);
  vec2 p3 = 0.70 * vec2(sin(u_t * 0.13 + 4.2), cos(u_t * 0.19 + 3.1)) + vec2(0.05, -0.30);
  float w1 = exp(-2.6 * dot(uv - p1, uv - p1));
  float w2 = exp(-2.9 * dot(uv - p2, uv - p2));
  float w3 = exp(-2.4 * dot(uv - p3, uv - p3));
  vec3 col = u_c0;
  col = mix(col, u_c1, min(w1, 1.0));
  col = mix(col, u_c2, min(w2, 1.0));
  col = mix(col, u_c3, min(w3, 1.0));
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.012;
  gl_FragColor = vec4(col, 1.0);
}`;

export default function HeroShader() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null); // { gl, program }
  const { theme } = useTheme();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    if (reduced || !canvas) { setFailed(true); return; }

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) { setFailed(true); return; }

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VSRC);
    const fs = compile(gl.FRAGMENT_SHADER, FSRC);
    if (!vs || !fs) { setFailed(true); return; }
    const program = gl.createProgram();
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { setFailed(true); return; }
    gl.useProgram(program);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ctxRef.current = { gl, program };

    // initial palette (theme effect below also runs on mount, but after this)
    let raf = null;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== (w * dpr | 0) || canvas.height !== (h * dpr | 0)) {
        canvas.width = w * dpr | 0; canvas.height = h * dpr | 0;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    const t0 = performance.now();
    const frame = () => {
      raf = null;
      if (!visible || document.hidden) return;
      resize();
      gl.uniform2f(gl.getUniformLocation(program, 'u_res'), canvas.width, canvas.height);
      gl.uniform1f(gl.getUniformLocation(program, 'u_t'), (performance.now() - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    const io = new IntersectionObserver(e => { visible = e[0].isIntersecting; kick(); }, { threshold: 0 });
    io.observe(canvas);
    document.addEventListener('visibilitychange', kick);
    window.addEventListener('resize', resize);
    kick();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', kick);
      window.removeEventListener('resize', resize);
      ctxRef.current = null;
    };
  }, []);

  // palette follows theme
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { gl, program } = ctx;
    const c = PALETTES[theme] || PALETTES.dark;
    gl.uniform3f(gl.getUniformLocation(program, 'u_c0'), c[0], c[1], c[2]);
    gl.uniform3f(gl.getUniformLocation(program, 'u_c1'), c[3], c[4], c[5]);
    gl.uniform3f(gl.getUniformLocation(program, 'u_c2'), c[6], c[7], c[8]);
    gl.uniform3f(gl.getUniformLocation(program, 'u_c3'), c[9], c[10], c[11]);
  }, [theme, failed]);

  if (failed) return <div className="hero-fallback" aria-hidden="true" />;
  return <canvas ref={canvasRef} className="hero-shader" aria-hidden="true" />;
}
