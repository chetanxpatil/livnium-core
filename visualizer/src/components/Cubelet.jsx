import React, { useMemo } from 'react';
import { NameSprite } from './NameSprite.jsx';
import { useStore } from '../app/store.jsx';
import { stateSymbol, symbolColor } from '../lib/potts27.js';

export function Cubelet({ pos, showNames, hidden, shared }) {
  const spacing = 1.1;
  const size = 0.9;
  const { pottsModel } = useStore();
  const state = pottsModel.states[pos.x + 1][pos.y + 1][pos.z + 1];
  const color = useMemo(() => symbolColor(state), [state]);
  const symbol = stateSymbol(state);
  const textForSide = () => symbol;

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
          depsKey={symbol}
        />
      ) : null}
    </group>
  );
}
