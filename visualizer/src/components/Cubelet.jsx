import React, { useMemo } from 'react';
import { NameSprite } from './NameSprite.jsx';
import { useStore } from '../app/store.jsx';
import { colorByExposure, colorByCoupler } from '../lib/colors.js';
import { faceLetterFor } from '../lib/faces.js';
import { stateSymbol, symbolColor } from '../lib/potts27.js';

export function Cubelet({
  pos,
  labelMode,
  showNames,
  hidden,
  shared,
  mode,
  alpha,
  tau0,
}) {
  const spacing = 1.1;
  const size = 0.9;
  const { pottsModel } = useStore();
  const state = pottsModel.states[pos.x + 1][pos.y + 1][pos.z + 1];
  const symbol = stateSymbol(state);
  const color = useMemo(() => {
    if (mode === 'exposure') return colorByExposure(pos);
    if (mode === 'coupler') return colorByCoupler(pos, alpha, tau0);
    return symbolColor(state);
  }, [mode, pos.x, pos.y, pos.z, alpha, tau0, state]);

  const textForSide = (axis, sign) => {
    if (labelMode === 'face') return faceLetterFor(pos, axis, sign);
    if (labelMode === 'xyz') return `${pos.x},${pos.y},${pos.z}`;
    return symbol;
  };

  const labelDeps =
    labelMode === 'face' || labelMode === 'xyz'
      ? labelMode
      : `${labelMode ?? 'potts'}-${symbol}`;

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
          depsKey={labelDeps}
        />
      ) : null}
    </group>
  );
}
