import React from 'react';
import { useSharedGeometries } from '../lib/threeShared.js';
import { isHiddenByDrop } from '../lib/slicing.js';
import { Axes } from './Axes.jsx';
import { Controls } from './Controls.jsx';
import { Cubelet } from './Cubelet.jsx';
import { useStore } from '../app/store.js';

export function Scene({ cubes }) {
  const {
    mode,
    alpha,
    tau0,
    drop,
    slice,
    showLabels,
    labelMode,
    showAxes,
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
        mode={mode}
        alpha={alpha}
        tau0={tau0}
        hidden={hidden}
        shared={shared}
      />
    );
  };

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
