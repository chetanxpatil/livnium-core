import { useMemo } from 'react';
import * as THREE from 'three';

export function Axes({ size = 4 }) {
  const axes = useMemo(() => new THREE.AxesHelper(size), [size]);
  return <primitive object={axes} />;
}
