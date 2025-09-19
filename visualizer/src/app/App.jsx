import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from '../components/Scene.jsx';
import { StoreProvider } from './store.jsx';
import { TopBar } from '../components/TopBar.jsx';
import { LeftControls } from '../components/LeftControls.jsx';
import { Insights } from '../components/Insights.jsx';
import { BottomStrip } from '../components/BottomStrip.jsx';
import { useGamepad } from '../hooks/useGamepad.js';

export function App() {
  useGamepad();

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
            <Scene />
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
