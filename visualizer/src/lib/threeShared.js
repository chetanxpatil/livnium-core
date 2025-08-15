import { useMemo } from 'react';
import * as THREE from 'three';

export function useSharedGeometries(size = 0.9) {
  return useMemo(() => {
    const boxGeo = new THREE.BoxGeometry(size, size, size);
    const edgeGeo = new THREE.EdgesGeometry(boxGeo, 15);
    const edgeMat = new THREE.LineBasicMaterial({ color: '#000' });
    return { boxGeo, edgeGeo, edgeMat };
  }, [size]);
}
