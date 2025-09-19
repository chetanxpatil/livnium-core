import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSharedGeometries } from '../lib/threeShared.js';
import { isHiddenByDrop } from '../lib/slicing.js';
import { Axes } from './Axes.jsx';
import { Controls } from './Controls.jsx';
import { Cubelet } from './Cubelet.jsx';
import { useStore } from '../app/store.jsx';
import { stepPotts27 } from '../lib/potts27.js';
import { DoubleSide } from 'three';

export function Scene() {
  const {
    cubes,
    mode,
    alpha,
    tau0,
    drop,
    slice,
    showLabels,
    labelMode,
    showAxes,
    pottsModel,
    setPottsModel,
    temperature,
    isPottsRunning,
    selectedAxis,
    selectedSlice,
    selection,
  } = useStore();

  const activeSelection = selection ?? { axis: selectedAxis, slice: selectedSlice };

  const selectionMesh = useMemo(() => {
    if (!activeSelection?.axis) return null;
    const spacing = 1.1;
    const size = spacing * 3;
    const { axis, slice: index } = activeSelection;
    const position = { x: 0, y: 0, z: 0 };
    position[axis] = index * spacing;
    const rotation = [0, 0, 0];
    if (axis === 'x') {
      rotation[1] = Math.PI / 2;
    } else if (axis === 'y') {
      rotation[0] = Math.PI / 2;
    }
    return { position, rotation, size };
  }, [activeSelection]);

  const shared = useSharedGeometries();

  const renderCubelet = (c) => {
    const hidden = drop !== 'none' ? isHiddenByDrop(c.pos, drop, slice) : false;
    return (
      <Cubelet
        key={c.id}
        pos={c.pos}
        labelMode={labelMode}
        showNames={showLabels}
        hidden={hidden}
        shared={shared}
        mode={mode}
        alpha={alpha}
        tau0={tau0}
      />
    );
  };

  useFrame(() => {
    if (isPottsRunning) {
      stepPotts27(pottsModel, temperature);
      setPottsModel({ ...pottsModel });
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 10]} intensity={0.9} />
      {showAxes && <Axes size={4} />}
      {cubes.map(renderCubelet)}
      {selectionMesh && (
        <mesh position={[selectionMesh.position.x, selectionMesh.position.y, selectionMesh.position.z]} rotation={selectionMesh.rotation}>
          <planeGeometry args={[selectionMesh.size, selectionMesh.size]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.18} side={DoubleSide} />
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[selectionMesh.size, selectionMesh.size]} />
            <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.6} side={DoubleSide} />
          </mesh>
        </mesh>
      )}
      <Controls enablePan enableZoom enableRotate />
    </>
  );
}
