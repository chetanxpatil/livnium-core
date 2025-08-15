import React from 'react';
import { useStore } from '../app/store.jsx';

export function LeftControls() {
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
    showAxes,
    setShowAxes,
  } = useStore();

  const btn =
    'px-2 py-1 rounded border border-white/20 bg-white/5 hover:bg-white/10 text-xs';
  const label = 'text-[10px] uppercase tracking-wide text-white/60';

  return (
    <div className="w-32 h-full border-r border-white/10 p-2 flex flex-col gap-4 text-white/80">
      <div>
        <div className={label}>Mode</div>
        <div className="flex flex-col gap-1 mt-1">
          <button
            className={`${btn} ${mode === 'exposure' ? 'ring-1 ring-orange-400' : ''}`}
            onClick={() => setMode('exposure')}
          >
            Exposure
          </button>
          <button
            className={`${btn} ${mode === 'coupler' ? 'ring-1 ring-orange-400' : ''}`}
            onClick={() => setMode('coupler')}
          >
            Coupler
          </button>
        </div>
        {mode === 'coupler' && (
          <div className="flex flex-col items-center gap-1 mt-2">
            <label className={label}>α {alpha.toFixed(1)}</label>
            <input
              type="range"
              min={0}
              max={3}
              step={0.1}
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              orient="vertical"
              className="w-full h-16"
            />
            <label className={label}>τ₀ {tau0.toFixed(1)}</label>
            <input
              type="range"
              min={0.1}
              max={2}
              step={0.1}
              value={tau0}
              onChange={(e) => setTau0(parseFloat(e.target.value))}
              orient="vertical"
              className="w-full h-16"
            />
          </div>
        )}
      </div>

      <div>
        <div className={label}>Drop</div>
        <div className="flex flex-col gap-1 mt-1">
          {['none', 'x', 'y', 'z'].map((k) => (
            <button
              key={k}
              className={`${btn} ${drop === k ? 'ring-1 ring-sky-400' : ''}`}
              onClick={() => setDrop(k)}
            >
              {k === 'none' ? 'None' : k.toUpperCase()}
            </button>
          ))}
        </div>
        {drop !== 'none' && (
          <div className="flex flex-col gap-1 mt-2">
            <div className={label}>Slice</div>
            {[-1, 0, 1].map((s) => (
              <button
                key={s}
                className={`${btn} ${slice === s ? 'ring-1 ring-sky-400' : ''}`}
                onClick={() => setSlice(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
          />
          <span className={label}>Labels</span>
        </label>
        {showLabels && (
          <div className="flex flex-col gap-1 mt-1">
            <button
              className={`${btn} ${labelMode === 'xyz' ? 'ring-1 ring-violet-400' : ''}`}
              onClick={() => setLabelMode('xyz')}
            >
              XYZ
            </button>
            <button
              className={`${btn} ${labelMode === 'face' ? 'ring-1 ring-violet-400' : ''}`}
              onClick={() => setLabelMode('face')}
            >
              Face
            </button>
          </div>
        )}
      </div>

      <div>
        <div className={label}>View</div>
        <div className="flex flex-col gap-1 mt-1">
          <button className={btn} onClick={reset}>
            Reset UI
          </button>
          <button
            className={`${btn} ${showAxes ? 'ring-1 ring-green-400' : ''}`}
            onClick={() => setShowAxes(!showAxes)}
          >
            Axes
          </button>
        </div>
      </div>
    </div>
  );
}
