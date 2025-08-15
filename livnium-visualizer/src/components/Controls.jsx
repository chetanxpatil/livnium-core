import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function Controls({ enablePan = true, enableZoom = true, enableRotate = true }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef(null);

  useEffect(() => {
    let controls = null;
    let raf = 0;
    if (!camera || !gl || !gl.domElement) return;

    raf = requestAnimationFrame(() => {
      try {
        controls = new ThreeOrbitControls(camera, gl.domElement);
        controls.enablePan = enablePan;
        controls.enableZoom = enableZoom;
        controls.enableRotate = enableRotate;
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controlsRef.current = controls;
      } catch (e) {
        console.error('OrbitControls init failed:', e);
      }
    });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (controls) controls.dispose();
      controlsRef.current = null;
    };
  }, [camera, gl, enablePan, enableZoom, enableRotate]);

  useFrame(() => controlsRef.current?.update());
  return null;
}
