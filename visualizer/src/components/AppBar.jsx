import React from 'react';
import { useStore } from '../app/store.jsx';

function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm transition-colors border ${
        active ? 'bg-white/20 border-white/40 text-white' : 'bg-white/5 border-white/10 text-white/70'
      } hover:bg-white/15`}
    >
      {children}
    </button>
  );
}

export function AppBar() {
  const {
    mode,
    setMode,
    labelMode,
    setLabelMode,
    isPottsRunning,
    startPotts,
    stopPotts,
    resetPotts,
    setUi,
  } = useStore();

  const togglePotts = () => {
    if (isPottsRunning) stopPotts();
    else startPotts();
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-white/10 bg-[#11131a]/95 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-400/80 to-cyan-500/60 flex items-center justify-center text-xs font-bold uppercase">
          LV
        </div>
        <div>
          <div className="text-sm uppercase tracking-[0.3em] text-white/60">Visualizer</div>
          <div className="text-lg font-semibold text-white">Livnium Visualizer</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-white/50">Color</span>
          <div className="flex gap-2">
            <Chip active={mode === 'exposure'} onClick={() => setMode('exposure')}>
              Exposure
            </Chip>
            <Chip active={mode === 'coupler'} onClick={() => setMode('coupler')}>
              Coupler
            </Chip>
          </div>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-white/50">Labels</span>
          <div className="flex gap-2">
            {['xyz', 'face', 'base27'].map((option) => (
              <Chip key={option} active={labelMode === option} onClick={() => setLabelMode(option)}>
                {option.toUpperCase()}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={togglePotts}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
            isPottsRunning
              ? 'border-orange-400/60 text-orange-200 bg-orange-500/10'
              : 'border-emerald-400/40 text-emerald-200 bg-emerald-500/10'
          } hover:bg-white/10`}
        >
          {isPottsRunning ? 'Stop Potts' : 'Start Potts'}
        </button>
        <button
          onClick={resetPotts}
          className="px-3 py-1.5 rounded-lg text-sm font-medium border border-white/10 text-white/70 hover:text-white hover:bg-white/10"
        >
          Reset Potts
        </button>
        <button
          onClick={() => setUi({ showHelp: true })}
          className="w-9 h-9 rounded-full border border-white/20 text-white/80 hover:bg-white/10 flex items-center justify-center text-lg"
          title="Help"
        >
          ?
        </button>
        <button
          onClick={() => setUi({ showSettings: true })}
          className="w-9 h-9 rounded-full border border-white/20 text-white/80 hover:bg-white/10 flex items-center justify-center"
          title="Settings"
        >
          ⚙
        </button>
      </div>
    </header>
  );
}
