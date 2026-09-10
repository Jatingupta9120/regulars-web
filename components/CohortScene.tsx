'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Desktop-only WebGL layer that animates the six nodes from scattered to
 * connected as the hero scrolls. It sits *on top of* CohortPlate and fades the
 * plate out only once it has actually rendered a frame. If Three.js never
 * loads, WebGL is unavailable, the viewport is narrow, or the visitor prefers
 * reduced motion, nothing here runs and the static plate stays.
 *
 * Budget: three.js core only, loaded after first paint. No loaders, no
 * textures, no post-processing.
 */
export function CohortScene({ onReady }: { onReady: () => void }): JSX.Element | null {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const wideEnough = window.matchMedia('(min-width: 900px)').matches;
    const stillMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    setEnabled(wideEnough && fine && !stillMotion);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    // Deferred so the 3D bundle never blocks first contentful paint.
    const idle =
      window.requestIdleCallback?.bind(window) ??
      ((cb: () => void) => window.setTimeout(cb, 200));

    idle(() => {
      void import('three')
        .then((THREE) => {
          if (disposed) return;

          let renderer: InstanceType<typeof THREE.WebGLRenderer>;
          try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          } catch {
            return; // No WebGL. Plate stays.
          }

          const width = mount.clientWidth;
          const height = mount.clientHeight;
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          renderer.setSize(width, height, false);
          mount.appendChild(renderer.domElement);
          renderer.domElement.setAttribute('aria-hidden', 'true');

          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
          camera.position.set(0, 0, 9);

          const accent = new THREE.Color(
            getComputedStyle(document.documentElement).getPropertyValue('--mark').trim() ||
              '#123a5e',
          );

          const COUNT = 6;
          const resolved: InstanceType<typeof THREE.Vector3>[] = [];
          const scattered: InstanceType<typeof THREE.Vector3>[] = [];
          for (let i = 0; i < COUNT; i += 1) {
            const angle = (i / COUNT) * Math.PI * 2 - Math.PI / 2;
            resolved.push(new THREE.Vector3(Math.cos(angle) * 2.4, Math.sin(angle) * 2.4, 0));
            scattered.push(
              new THREE.Vector3(
                Math.cos(angle) * 5.6 + (i % 2 ? 0.9 : -0.9),
                Math.sin(angle) * 5.2,
                (i - COUNT / 2) * 0.7,
              ),
            );
          }

          const group = new THREE.Group();
          scene.add(group);

          const nodeGeom = new THREE.SphereGeometry(0.17, 20, 20);
          const nodeMat = new THREE.MeshBasicMaterial({ color: accent });
          const nodes = resolved.map(() => {
            const mesh = new THREE.Mesh(nodeGeom, nodeMat);
            group.add(mesh);
            return mesh;
          });

          const pairs: Array<[number, number]> = [];
          for (let i = 0; i < COUNT; i += 1) {
            for (let j = i + 1; j < COUNT; j += 1) pairs.push([i, j]);
          }
          const edgeGeom = new THREE.BufferGeometry();
          const edgePositions = new Float32Array(pairs.length * 6);
          edgeGeom.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3));
          const edgeMat = new THREE.LineBasicMaterial({
            color: accent,
            transparent: true,
            opacity: 0,
          });
          group.add(new THREE.LineSegments(edgeGeom, edgeMat));

          // 0 = strangers, 1 = one group. Driven by hero scroll progress.
          let progress = 0;
          let target = 0;
          let running = true;
          let announced = false;

          const readScroll = () => {
            const rect = mount.getBoundingClientRect();
            const travel = window.innerHeight + rect.height;
            const seen = window.innerHeight - rect.top;
            target = Math.min(1, Math.max(0, seen / travel)) * 1.6;
            target = Math.min(1, target);
          };
          readScroll();
          window.addEventListener('scroll', readScroll, { passive: true });

          const ease = (t: number) => t * t * (3 - 2 * t);
          const tmp = new THREE.Vector3();

          const frame = () => {
            if (!running || disposed) return;
            progress += (target - progress) * 0.08;
            const p = ease(progress);

            for (let i = 0; i < COUNT; i += 1) {
              const from = scattered[i];
              const to = resolved[i];
              const node = nodes[i];
              if (!from || !to || !node) continue;
              node.position.copy(tmp.copy(from).lerp(to, p));
            }

            let o = 0;
            for (const [a, b] of pairs) {
              const na = nodes[a];
              const nb = nodes[b];
              if (!na || !nb) continue;
              edgePositions[o] = na.position.x;
              edgePositions[o + 1] = na.position.y;
              edgePositions[o + 2] = na.position.z;
              edgePositions[o + 3] = nb.position.x;
              edgePositions[o + 4] = nb.position.y;
              edgePositions[o + 5] = nb.position.z;
              o += 6;
            }
            edgeGeom.attributes.position!.needsUpdate = true;
            edgeMat.opacity = Math.max(0, p - 0.25) * 0.8;

            group.rotation.y = Math.sin(Date.now() / 4200) * 0.18 * p;
            renderer.render(scene, camera);

            if (!announced) {
              announced = true;
              onReady();
            }
            window.requestAnimationFrame(frame);
          };
          window.requestAnimationFrame(frame);

          // Stop burning frames when off-screen or the tab is hidden.
          const observer = new IntersectionObserver(
            ([entry]) => {
              const visible = entry?.isIntersecting ?? false;
              if (visible && !running) {
                running = true;
                window.requestAnimationFrame(frame);
              } else if (!visible) {
                running = false;
              }
            },
            { threshold: 0 },
          );
          observer.observe(mount);

          const onVisibility = () => {
            if (document.hidden) {
              running = false;
            } else if (!running) {
              running = true;
              window.requestAnimationFrame(frame);
            }
          };
          document.addEventListener('visibilitychange', onVisibility);

          const onResize = () => {
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h, false);
          };
          window.addEventListener('resize', onResize);

          cleanup = () => {
            running = false;
            observer.disconnect();
            window.removeEventListener('scroll', readScroll);
            window.removeEventListener('resize', onResize);
            document.removeEventListener('visibilitychange', onVisibility);
            nodeGeom.dispose();
            nodeMat.dispose();
            edgeGeom.dispose();
            edgeMat.dispose();
            renderer.dispose();
            renderer.domElement.remove();
          };
        })
        .catch(() => {
          // three failed to load. The plate is already on screen; do nothing.
        });
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [enabled, onReady]);

  if (!enabled) return null;

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    />
  );
}
