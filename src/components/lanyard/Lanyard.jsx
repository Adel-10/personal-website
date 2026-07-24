import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  makeFrontCanvas, makeBackCanvas, makeStrapCanvas,
  makeFrontCanvasWith, makeBackCanvasWith, KCL_RED
} from './kclTextures.js';

// A React Bits-style "Lanyard": an ID card hanging from a textured strap, with
// verlet-rope physics — grab the card and throw it around. Implemented in plain
// three.js (no @react-three/* deps) to match the rest of this codebase.
//
// Reduced motion / no WebGL → renders a static card image instead.

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let webglOK = null;
function hasWebGL() {
  if (webglOK !== null) return webglOK;
  try {
    const c = document.createElement('canvas');
    webglOK = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    webglOK = false;
  }
  return webglOK;
}

function srgb(tex) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// Optional real-KCL images in public/assets/lanyard/ — composited onto the card
// canvases (aspect preserved), so any image size works. Missing file → silent fallback.
function loadImage(name, onLoad) {
  const img = new Image();
  img.onload = () => onLoad(img);
  img.onerror = () => {};
  img.src = `${import.meta.env.BASE_URL}assets/lanyard/${name}.png`;
}

export default function Lanyard() {
  const hostRef = useRef(null);
  const fallback = REDUCED_MOTION || !hasWebGL();
  const fallbackSrc = useMemo(
    () => (fallback ? makeFrontCanvas().toDataURL('image/png') : null),
    [fallback]
  );

  useEffect(() => {
    if (fallback) return;
    const host = hostRef.current;
    if (!host) return;

    // ---------- renderer / scene ----------
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.cursor = 'grab';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 22);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dir = new THREE.DirectionalLight(0xffffff, 1.4);
    dir.position.set(3, 6, 8);
    scene.add(dir);

    // ---------- rope (verlet) ----------
    const visH = 2 * Math.tan(THREE.MathUtils.degToRad(28 / 2)) * camera.position.z;
    const anchor = new THREE.Vector3(0, visH / 2 * 1.03, 0);
    const N = 7;
    const ropeLen = visH * 0.42;
    const seg = ropeLen / (N - 1);
    const pts = [], prev = [];
    for (let i = 0; i < N; i++) {
      const p = new THREE.Vector3(anchor.x + i * 0.03, anchor.y - i * seg, 0);
      pts.push(p); prev.push(p.clone().add(new THREE.Vector3(0.02 * i, 0, 0)));
    }
    const GRAVITY = -40; // matches the react-bits demo's gravity

    // ---------- card ----------
    const cardW = 1.75, cardH = 2.7, depth = 0.05, rad = 0.14;
    const shape = new THREE.Shape();
    const hw = cardW / 2, hh = cardH / 2;
    shape.moveTo(-hw + rad, -hh);
    shape.lineTo(hw - rad, -hh); shape.absarc(hw - rad, -hh + rad, rad, -Math.PI / 2, 0);
    shape.lineTo(hw, hh - rad); shape.absarc(hw - rad, hh - rad, rad, 0, Math.PI / 2);
    shape.lineTo(-hw + rad, hh); shape.absarc(-hw + rad, hh - rad, rad, Math.PI / 2, Math.PI);
    shape.lineTo(-hw, -hh + rad); shape.absarc(-hw + rad, -hh + rad, rad, Math.PI, Math.PI * 1.5);
    const bodyGeo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
    bodyGeo.translate(0, 0, -depth / 2);
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: KCL_RED, roughness: 0.55, clearcoat: 0.6, clearcoatRoughness: 0.3
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);

    const frontTex = srgb(new THREE.CanvasTexture(makeFrontCanvas()));
    const backTex = srgb(new THREE.CanvasTexture(makeBackCanvas()));
    const faceGeo = new THREE.PlaneGeometry(cardW - 0.06, cardH - 0.06);
    const frontMat = new THREE.MeshPhysicalMaterial({
      map: frontTex, roughness: 0.42, clearcoat: 0.8, clearcoatRoughness: 0.25
    });
    const backMat = new THREE.MeshPhysicalMaterial({
      map: backTex, roughness: 0.42, clearcoat: 0.8, clearcoatRoughness: 0.25
    });
    const front = new THREE.Mesh(faceGeo, frontMat);
    front.position.z = depth / 2 + 0.002;
    const back = new THREE.Mesh(faceGeo, backMat);
    back.rotation.y = Math.PI;
    back.position.z = -depth / 2 - 0.002;
    loadImage('wordmark', img => {
      frontMat.map = srgb(new THREE.CanvasTexture(makeFrontCanvasWith(img)));
      frontMat.needsUpdate = true;
    });
    loadImage('crest', img => {
      backMat.map = srgb(new THREE.CanvasTexture(makeBackCanvasWith(img)));
      backMat.needsUpdate = true;
    });

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.11, 0.028, 12, 32),
      new THREE.MeshPhysicalMaterial({ color: 0xd8d8de, metalness: 1, roughness: 0.28 })
    );

    const cardGroup = new THREE.Group();
    const cardBody = new THREE.Group();
    cardBody.add(body, front, back);
    cardBody.position.y = -(0.13 + cardH / 2);
    cardGroup.add(ring, cardBody);
    scene.add(cardGroup);

    // ---------- strap ----------
    const strapTex = srgb(new THREE.CanvasTexture(makeStrapCanvas()));
    strapTex.wrapS = THREE.RepeatWrapping;
    strapTex.repeat.set(Math.max(2, Math.round(ropeLen / 1.5)), 1);
    const strapMat = new THREE.MeshStandardMaterial({ map: strapTex, roughness: 0.7 });
    let strapMesh = null;
    loadImage('strap', img => {
      const t = srgb(new THREE.Texture(img));
      t.needsUpdate = true;
      t.wrapS = THREE.RepeatWrapping;
      t.repeat.copy(strapTex.repeat);
      strapMat.map = t; strapMat.needsUpdate = true;
    });
    function rebuildStrap() {
      const curve = new THREE.CatmullRomCurve3(pts);
      const geo = new THREE.TubeGeometry(curve, 24, 0.065, 8, false);
      if (strapMesh) {
        strapMesh.geometry.dispose();
        strapMesh.geometry = geo;
      } else {
        strapMesh = new THREE.Mesh(geo, strapMat);
        scene.add(strapMesh);
      }
    }
    rebuildStrap();

    // ---------- drag ----------
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hit = new THREE.Vector3();
    let holding = false;
    const grabOffset = new THREE.Vector3();

    function setPointer(e) {
      const r = renderer.domElement.getBoundingClientRect();
      pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
    }
    function onDown(e) {
      setPointer(e);
      if (raycaster.intersectObject(cardGroup, true).length) {
        raycaster.ray.intersectPlane(dragPlane, hit);
        grabOffset.copy(pts[N - 1]).sub(hit);
        holding = true;
        renderer.domElement.setPointerCapture(e.pointerId);
        renderer.domElement.style.cursor = 'grabbing';
      }
    }
    function onMove(e) {
      if (!holding) return;
      setPointer(e);
      if (raycaster.ray.intersectPlane(dragPlane, hit)) {
        // card follows the pointer exactly (kinematic while held, like the demo);
        // the rope stretches and snaps back naturally on release
        pts[N - 1].copy(hit).add(grabOffset);
      }
    }
    function onUp(e) {
      holding = false;
      renderer.domElement.style.cursor = 'grab';
      if (renderer.domElement.hasPointerCapture?.(e.pointerId)) {
        renderer.domElement.releasePointerCapture(e.pointerId);
      }
    }
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointermove', onMove);
    renderer.domElement.addEventListener('pointerup', onUp);
    renderer.domElement.addEventListener('pointercancel', onUp);

    // ---------- simulation ----------
    const tmp = new THREE.Vector3();
    function step(h) {
      for (let i = 1; i < N; i++) {
        if (holding && i === N - 1) continue;
        const p = pts[i], q = prev[i];
        tmp.copy(p).sub(q).multiplyScalar(0.99); // velocity + light damping
        q.copy(p);
        p.add(tmp);
        p.y += GRAVITY * h * h;
      }
      pts[0].copy(anchor);
      for (let k = 0; k < 30; k++) {
        for (let i = 0; i < N - 1; i++) {
          const a = pts[i], b = pts[i + 1];
          tmp.copy(b).sub(a);
          const dist = tmp.length() || 1e-6;
          const diff = (dist - seg) / dist;
          if (i === 0) {
            b.addScaledVector(tmp, -diff);
          } else if (holding && i === N - 2) {
            a.addScaledVector(tmp, diff);
          } else {
            a.addScaledVector(tmp, diff * 0.5);
            b.addScaledVector(tmp, -diff * 0.5);
          }
        }
        pts[0].copy(anchor);
      }
    }

    // ---------- loop ----------
    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;
    let swayY = 0;
    const lastPos = pts[N - 1].clone();

    function frame() {
      raf = requestAnimationFrame(frame);
      if (!running) return;
      const dt = Math.min(clock.getDelta(), 1 / 30);

      // two half-timestep substeps for stability (no artificial forces — the card
      // hangs perfectly still when settled, like the react-bits demo)
      step(dt / 2); step(dt / 2);
      rebuildStrap();

      const last = pts[N - 1];
      const d = tmp.copy(last).sub(pts[N - 2]).normalize();
      cardGroup.position.copy(last);
      const rotZ = Math.atan2(d.x, -d.y);
      // yaw follows horizontal velocity only (reads as physical swing; decays to zero at rest)
      const vx = last.x - lastPos.x;
      lastPos.copy(last);
      swayY += (THREE.MathUtils.clamp(-vx * 5, -1.1, 1.1) - swayY) * 0.1;
      cardGroup.rotation.set(0, swayY, rotZ);

      renderer.render(scene, camera);
    }
    frame();

    // ---------- lifecycle ----------
    const io = new IntersectionObserver(([e]) => { running = e.isIntersecting; }, { rootMargin: '10% 0px' });
    io.observe(host);
    const onVis = () => { running = !document.hidden; };
    document.addEventListener('visibilitychange', onVis);
    const ro = new ResizeObserver(() => {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointermove', onMove);
      renderer.domElement.removeEventListener('pointerup', onUp);
      renderer.domElement.removeEventListener('pointercancel', onUp);
      [bodyGeo, faceGeo, frontTex, backTex, strapTex].forEach(r => r.dispose());
      if (strapMesh) strapMesh.geometry.dispose();
      ring.geometry.dispose();
      [bodyMat, frontMat, backMat, strapMat, ring.material].forEach(m => m.dispose());
      pmrem.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, [fallback]);

  if (fallback) {
    return <img className="lanyard-fallback" src={fallbackSrc} alt="King's College London student card" />;
  }
  return <div ref={hostRef} className="lanyard-canvas" aria-label="Interactive King's College London lanyard — drag the card" />;
}
