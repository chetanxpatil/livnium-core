import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useSharedGeometries } from '../lib/threeShared.js';
import { isHiddenByDrop } from '../lib/slicing.js';
import { Axes } from './Axes.jsx';
import { Controls } from './Controls.jsx';
import { Cubelet } from './Cubelet.jsx';
import { useStore } from '../app/store.jsx';
import { stepPotts27 } from '../lib/potts27.js';

export function Scene({ cubes }) {
  const {
    drop,
    slice,
    showLabels,
    labelMode,
    showAxes,
    pottsModel,
    setPottsModel,
    temperature,
    isPottsRunning,
  } = useStore();

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
      <Controls enablePan enableZoom enableRotate />
    </>
  );
}
