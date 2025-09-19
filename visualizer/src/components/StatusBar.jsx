import React from 'react';
import { useStore } from '../app/store.jsx';

export function StatusBar({ gamepadStatus }) {
  const { mode, labelMode, drop, slice, temperature, isPottsRunning } = useStore();
  const connected = gamepadStatus?.connected;

  return (
    <footer className="h-12 flex items-center justify-between px-4 border-t border-white/10 bg-[#11131a]/90 text-white/70 text-sm">
      <div className="flex items-center gap-4">
        <span>
          Mode:
          <strong className="ml-1 text-white">{mode === 'exposure' ? 'Exposure' : 'Coupler'}</strong>
        </span>
        <span>
          Labels:
          <strong className="ml-1 text-white">{labelMode.toUpperCase()}</strong>
        </span>
        <span>
          Drop:
          <strong className="ml-1 text-white">{drop === 'none' ? 'None' : drop.toUpperCase()}</strong>
        </span>
        <span>
          Slice:
          <strong className="ml-1 text-white">{slice}</strong>
        </span>
      </div>
      <div className="text-white/80">
        Potts: {isPottsRunning ? 'Running' : 'Stopped'} · Temp {temperature.toFixed(2)}
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'}`} />
        <span>{connected ? 'Controller Connected' : 'No Controller'}</span>
      </div>
    </footer>
  );
}
