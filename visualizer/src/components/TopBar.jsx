import React from 'react';
import { useStore } from '../app/store.js';

export function TopBar() {
  const {
    mode,
    setMode,
    alpha,
    setAlpha,
    tau0,
    setTau0,
    drop,
    setDrop,
    slice,
    setSlice,
    showLabels,
    setShowLabels,
    labelMode,
    setLabelMode,
    reset,
  } = useStore();

  const btn =
    'px-3 py-1 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition text-sm';
  const label = 'text-xs uppercase tracking-wide text-white/70';

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 border-b border-white/10">
      <div className="flex items-center gap-2">
        <span className={label}>Color</span>
        <button
          className={`${btn} ${mode === 'exposure' ? 'ring-2 ring-orange-400' : ''}`}
          onClick={() => setMode('exposure')}
        >
          Exposure
        </button>
        <button
          className={`${btn} ${mode === 'coupler' ? 'ring-2 ring-orange-400' : ''}`}
          onClick={() => setMode('coupler')}
        >
          Coupler
        </button>
      </div>

      {mode === 'coupler' && (
        <div className="flex items-center gap-2 ml-4">
          <span className={label}>alpha</span>
          <input
            type="range"
            min={0}
            max={3}
            step={0.1}
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
          />
          <span className="tabular-nums">{alpha.toFixed(1)}</span>
          <span className={label}>tau0</span>
          <input
            type="range"
            min={0.1}
            max={2}
            step={0.1}
            value={tau0}
            onChange={(e) => setTau0(parseFloat(e.target.value))}
          />
          <span className="tabular-nums">{tau0.toFixed(1)}</span>
        </div>
      )}

      <div className="flex items-center gap-2 ml-4">
        <span className={label}>Drop Axis</span>
        {['none', 'x', 'y', 'z'].map((k) => (
          <button
            key={k}
            className={`${btn} ${drop === k ? 'ring-2 ring-sky-400' : ''}`}
            onClick={() => setDrop(k)}
          >
            {k === 'none' ? 'None' : k.toUpperCase()}
          </button>
        ))}
        {drop !== 'none' && (
          <div className="flex items-center gap-2 ml-2">
            <span className={label}>Slice</span>
            {[-1, 0, 1].map((s) => (
              <button
                key={s}
                className={`${btn} ${slice === s ? 'ring-2 ring-sky-400' : ''}`}
                onClick={() => setSlice(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 ml-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
          />
          <span className={label}>Show Labels</span>
        </label>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <span className={label}>Label Mode</span>
        <button
          className={`${btn} ${labelMode === 'xyz' ? 'ring-2 ring-violet-400' : ''}`}
          onClick={() => setLabelMode('xyz')}
        >
          XYZ
        </button>
        <button
          className={`${btn} ${labelMode === 'face' ? 'ring-2 ring-violet-400' : ''}`}
          onClick={() => setLabelMode('face')}
        >
          Face letters
        </button>
      </div>

      <button className={`${btn} ml-2`} onClick={reset}>
        Reset
      </button>
    </div>
  );
}
