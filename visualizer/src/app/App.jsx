import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from '../components/Scene.jsx';
import { StoreProvider } from './store.jsx';
import { TopBar } from '../components/TopBar.jsx';
import { LeftControls } from '../components/LeftControls.jsx';
import { Insights } from '../components/Insights.jsx';
import { BottomStrip } from '../components/BottomStrip.jsx';

export function App() {
  const cubes = useMemo(() => {
    const list = [];
    let id = 0;
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) list.push({ id: id++, pos: { x, y, z } });
    return list;
  }, []);

  return (
    <StoreProvider>
      <div className="w-full h-full grid grid-rows-[auto_1fr_auto] grid-cols-[auto_1fr_auto] bg-neutral-950 text-white">
        <div className="row-start-1 col-span-3">
          <TopBar />
        </div>
        <div className="row-start-2 col-start-1">
          <LeftControls />
        </div>
        <div className="row-start-2 col-start-2 relative">
          <Canvas camera={{ position: [5, 5, 6], fov: 45 }}>
            <Scene cubes={cubes} />
          </Canvas>
        </div>
        <div className="row-start-2 col-start-3">
          <Insights />
        </div>
        <div className="row-start-3 col-span-3">
          <BottomStrip />
        </div>
      </div>
    </StoreProvider>
  );
}
