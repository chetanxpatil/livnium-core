import React from 'react';
import { useStore } from '../app/store.jsx';
import { parseAlg } from '../input/intentHandlers.ts';

const dropOptions = [
  { label: 'None', value: 'none' },
  { label: 'X', value: 'x' },
  { label: 'Y', value: 'y' },
  { label: 'Z', value: 'z' },
];

const moves = ['U', "U'", 'U2', 'D', "D'", 'D2', 'L', "L'", 'L2', 'R', "R'", 'R2', 'F', "F'", 'F2', 'B', "B'", 'B2'];

export function LeftDock() {
  const {
    drop,
    setDrop,
    slice,
    setSlice,
    alpha,
    setAlpha,
    tau0,
    setTau0,
    temperature,
    setTemperature,
    showLabels,
    setShowLabels,
    showAxes,
    setShowAxes,
    applyMoveSequence,
    ui,
    setUi,
  } = useStore();

  const collapsed = !ui.leftDockOpen;

  return (
    <aside
      className={`h-full transition-all duration-200 ${
        collapsed ? 'w-12' : 'w-72'
      } border-r border-white/10 bg-[#0f1118]/95 backdrop-blur-sm flex flex-col`}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 text-xs uppercase tracking-wide text-white/50">
        Controls
        <button
          className="text-white/70 hover:text-white"
          onClick={() => setUi({ leftDockOpen: collapsed })}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6 text-white/80">
          <section>
            <h2 className="text-xs uppercase tracking-wide text-white/50 mb-2">Drop Axis</h2>
            <div className="grid grid-cols-2 gap-2">
              {dropOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDrop(opt.value)}
                  className={`px-3 py-2 rounded-lg border text-sm transition ${
                    drop === opt.value
                      ? 'border-sky-400/70 text-sky-200 bg-sky-500/10'
                      : 'border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-wide text-white/50 mb-2">Slice</h2>
            <div className="flex items-center gap-2">
              {[-1, 0, 1].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlice(value)}
                  className={`px-3 py-2 rounded-lg border text-sm transition ${
                    slice === value
                      ? 'border-emerald-400/70 text-emerald-200 bg-emerald-500/10'
                      : 'border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <header className="flex items-center justify-between text-xs uppercase tracking-wide text-white/50">
                <span>Alpha</span>
                <span className="text-white/70">{alpha.toFixed(2)}</span>
              </header>
              <input
                type="range"
                min={0}
                max={3}
                step={0.05}
                value={alpha}
                onChange={(e) => setAlpha(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <header className="flex items-center justify-between text-xs uppercase tracking-wide text-white/50">
                <span>Tau₀</span>
                <span className="text-white/70">{tau0.toFixed(2)}</span>
              </header>
              <input
                type="range"
                min={0.1}
                max={2}
                step={0.05}
                value={tau0}
                onChange={(e) => setTau0(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <header className="flex items-center justify-between text-xs uppercase tracking-wide text-white/50">
                <span>Temperature</span>
                <span className="text-white/70">{temperature.toFixed(2)}</span>
              </header>
              <input
                type="range"
                min={0.1}
                max={3}
                step={0.05}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-wide text-white/50 mb-2">View</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} />
                Show Labels
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={showAxes} onChange={(e) => setShowAxes(e.target.checked)} /> Show Axes
              </label>
            </div>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-wide text-white/50 mb-2">Moves</h2>
            <div className="grid grid-cols-3 gap-2">
              {moves.map((move) => (
                <button
                  key={move}
                  onClick={() => applyMoveSequence(parseAlg(move))}
                  className="px-2 py-2 rounded-lg border border-white/10 text-sm text-white/70 hover:text-white hover:bg-white/10"
                >
                  {move}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </aside>
  );
}
