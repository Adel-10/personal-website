import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  makeFrontCanvas, makeBackCanvas, makeStrapCanvas,
  makeFrontCanvasWith, makeBackCanvasWith, KCL_RED
} from './kclTextures.js';

// A React Bits-style "Lanyard": an ID card hanging from a textured strap, with
// verlet-rope physics — grab the card and throw it around. Implemented in plain
// three.js (no @react-three/* deps) to match the rest of this codebase.

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
  img.src = `${import.meta.env.BASE_URL}assets/lanyard/${name}.webp`;
  return () => { img.onload = null; };
}

export default function Lanyard() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // ---------- renderer / scene ----------
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 22);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    room.dispose();
    scene.environment = environment.texture;
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
    const stopWordmarkLoad = loadImage('wordmark', img => {
      frontTex.image = makeFrontCanvasWith(img);
      frontTex.needsUpdate = true;
      requestFrame();
    });
    const stopCrestLoad = loadImage('crest', img => {
      backTex.image = makeBackCanvasWith(img);
      backTex.needsUpdate = true;
      requestFrame();
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
    // The browser decides whether to pan at touch-down. Restrict touch-action:none
    // to the projected card, leaving the surrounding canvas free for native scrolling.
    const handle = document.createElement('div');
    handle.className = 'lanyard-grip';
    host.appendChild(handle);
    const corners = [[-hw, hh], [hw, hh], [hw, -hh], [-hw, -hh]];
    const corner = new THREE.Vector3();
    function positionHandle() {
      const points = corners.map(([x, y]) => {
        corner.set(x, y, 0).applyMatrix4(cardBody.matrixWorld).project(camera);
        return `${(corner.x + 1) * 50}% ${(1 - corner.y) * 50}%`;
      });
      handle.style.clipPath = `polygon(${points.join(',')})`;
    }
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hit = new THREE.Vector3();
    let holding = false;
    let dragId = null;
    const grabOffset = new THREE.Vector3();

    function setPointer(e) {
      const r = renderer.domElement.getBoundingClientRect();
      pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
    }
    function onDown(e) {
      if (holding || e.button !== 0) return;
      setPointer(e);
      if (e.target === handle || raycaster.intersectObject(cardGroup, true).length) {
        raycaster.ray.intersectPlane(dragPlane, hit);
        grabOffset.copy(pts[N - 1]).sub(hit);
        holding = true;
        dragId = e.pointerId;
        host.setPointerCapture(dragId);
        host.classList.add('is-dragging');
        wake();
      }
    }
    function onMove(e) {
      if (e.pointerId !== dragId) return;
      setPointer(e);
      if (raycaster.ray.intersectPlane(dragPlane, hit)) {
        // card follows the pointer exactly (kinematic while held, like the demo);
        // the rope stretches and snaps back naturally on release
        pts[N - 1].copy(hit).add(grabOffset);
        wake();
      }
    }
    function onUp(e) {
      if (e.pointerId !== dragId) return;
      holding = false;
      dragId = null;
      host.classList.remove('is-dragging');
      if (host.hasPointerCapture(e.pointerId)) {
        host.releasePointerCapture(e.pointerId);
      }
      wake();
    }
    host.addEventListener('pointerdown', onDown);
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerup', onUp);
    host.addEventListener('pointercancel', onUp);
    host.addEventListener('lostpointercapture', onUp);

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
    let raf = null;
    let nearViewport = false;
    let moving = true;
    let lastFrameTime = null;
    let settledFor = 0;
    let swayY = 0;
    const lastPos = pts[N - 1].clone();
    const previousFrame = pts.map(point => point.clone());

    function canRender() {
      return nearViewport && !document.hidden;
    }

    function requestFrame() {
      if (raf === null && canRender()) raf = requestAnimationFrame(frame);
    }

    function wake() {
      moving = true;
      settledFor = 0;
      requestFrame();
    }

    function cancelFrame() {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
      lastFrameTime = null;
      settledFor = 0;
    }

    function frame(time) {
      raf = null;
      if (!canRender()) return;
      if (moving) {
        const dt = lastFrameTime === null ? 1 / 60 : Math.min((time - lastFrameTime) / 1000, 1 / 30);
        lastFrameTime = time;
        advanceRope(dt);
      }
      renderer.render(scene, camera);
      positionHandle();
      if (moving) requestFrame();
    }

    function advanceRope(dt) {
      pts.forEach((point, i) => previousFrame[i].copy(point));

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

      // Require a quiet stretch so a brief pause at the top of a swing keeps moving.
      const maxDisplacement = 0.08 * dt;
      const settled = !holding && Math.abs(swayY) < 0.002 &&
        pts.every((point, i) => point.distanceToSquared(previousFrame[i]) < maxDisplacement ** 2);
      settledFor = settled ? settledFor + dt : 0;
      if (settledFor >= 0.3) {
        moving = false;
        lastFrameTime = null;
        pts.forEach((point, i) => prev[i].copy(point));
      }
    }

    // ---------- lifecycle ----------
    function onVisibilityChange() {
      if (canRender()) requestFrame();
      else cancelFrame();
    }
    const io = new IntersectionObserver(([entry]) => {
      nearViewport = entry.isIntersecting;
      onVisibilityChange();
    }, { rootMargin: '10% 0px' });
    io.observe(host);
    document.addEventListener('visibilitychange', onVisibilityChange);
    const ro = new ResizeObserver(() => {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestFrame();
    });
    ro.observe(host);

    return () => {
      cancelFrame();
      stopWordmarkLoad(); stopCrestLoad();
      io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      host.removeEventListener('pointerdown', onDown);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerup', onUp);
      host.removeEventListener('pointercancel', onUp);
      host.removeEventListener('lostpointercapture', onUp);
      host.classList.remove('is-dragging');
      handle.remove();
      [bodyGeo, faceGeo, frontTex, backTex, strapTex].forEach(r => r.dispose());
      if (strapMesh) strapMesh.geometry.dispose();
      ring.geometry.dispose();
      [bodyMat, frontMat, backMat, strapMat, ring.material].forEach(m => m.dispose());
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={hostRef} className="lanyard-canvas" aria-label="Interactive King's College London lanyard — drag the card" />;
}
