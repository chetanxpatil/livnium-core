import React, { useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from '../components/Scene.jsx';
import { StoreProvider, useStore } from './store.jsx';
import { AppBar } from '../components/AppBar.jsx';
import { LeftDock } from '../components/LeftDock.jsx';
import { StatusBar } from '../components/StatusBar.jsx';
import { HudGamepad } from '../components/HudGamepad.jsx';
import { CommandPalette } from '../components/CommandPalette.jsx';
import { HelpOverlay } from '../components/HelpOverlay.jsx';
import { SettingsModal } from '../components/SettingsModal.jsx';
import { GamepadController } from '../components/GamepadController.jsx';

function AppContent() {
  const { ui, setUi, controller } = useStore();
  const [gamepadStatus, setGamepadStatus] = useState(null);
  const [intentHistory, setIntentHistory] = useState([]);
  const [currentMapping, setCurrentMapping] = useState(controller.mapping);

  const handleGamepadStatus = useCallback((status, history, mapping) => {
    setGamepadStatus(status);
    setIntentHistory(history);
    setCurrentMapping(mapping);
  }, []);

  return (
    <div className="relative w-full h-full bg-[#0b0b0f] text-white">
      <GamepadController onStatus={handleGamepadStatus} />
      <div className="absolute inset-0 grid grid-rows-[auto_1fr_auto] grid-cols-[auto_1fr]">
        <div className="col-span-2">
          <AppBar />
        </div>
        <div className="row-start-2 col-start-1">
          <LeftDock />
        </div>
        <div className="row-start-2 col-start-2 relative">
          <Canvas camera={{ position: [5, 5, 6], fov: 45 }}>
            <Scene />
          </Canvas>
        </div>
        <div className="col-span-2">
          <StatusBar gamepadStatus={gamepadStatus} />
        </div>
      </div>

      <HudGamepad status={gamepadStatus} history={intentHistory} mapping={currentMapping} />

      <CommandPalette
        isOpen={ui.showPalette}
        onClose={() => setUi({ showPalette: false })}
        mapping={currentMapping}
      />
      <HelpOverlay
        isOpen={ui.showHelp}
        onClose={() => setUi({ showHelp: false })}
        mapping={currentMapping}
      />
      <SettingsModal isOpen={ui.showSettings} onClose={() => setUi({ showSettings: false })} />
    </div>
  );
}

export function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
