import React, { useMemo } from 'react';
import { NameSprite } from './NameSprite.jsx';
import { colorByExposure, colorByCoupler } from '../lib/colors.js';
import { faceLetterFor } from '../lib/faces.js';

export function Cubelet({
  pos,
  labelMode,
  showNames,
  mode,
  alpha,
  tau0,
  hidden,
  shared,
}) {
  const spacing = 1.1;
  const size = 0.9;

  const color = useMemo(
    () =>
      mode === 'exposure'
        ? colorByExposure(pos)
        : colorByCoupler(pos, alpha, tau0),
    [pos, mode, alpha, tau0],
  );

  const xyzLabel = `${pos.x},${pos.y},${pos.z}`;
  const textForSide = useMemo(() => {
    if (labelMode === 'face') {
      return (axis, sign) => faceLetterFor(pos, axis, sign);
    }
    return () => xyzLabel;
  }, [labelMode, pos.x, pos.y, pos.z, xyzLabel]);

  return (
    <group
      visible={!hidden}
      position={[pos.x * spacing, pos.y * spacing, pos.z * spacing]}
    >
      <mesh geometry={shared.boxGeo}>
        <meshStandardMaterial color={color} />
      </mesh>
      <lineSegments geometry={shared.edgeGeo} material={shared.edgeMat} />
      {showNames ? (
        <NameSprite
          pos={pos}
          cubeSize={size}
          textForSide={textForSide}
          depsKey={labelMode}
        />
      ) : null}
    </group>
  );
}
