import React, { useState } from 'react';
import { useStore } from '../app/store.jsx';
import { symbols, symbolColor } from '../lib/potts27.js';

const tabs = ['Projections', 'Couplers', 'Energy', 'Mapping', 'L1', 'Potts'];

export function Insights() {
  const [tab, setTab] = useState('Projections');
  const { pottsModel } = useStore();

  const averageEnergy = (model, J = 1) => {
    const { size, states } = model;
    let e = 0;
    for (let x = 0; x < size; x++)
      for (let y = 0; y < size; y++)
        for (let z = 0; z < size; z++) {
          const s = states[x][y][z];
          if (x + 1 < size && states[x + 1][y][z] === s) e -= J;
          if (y + 1 < size && states[x][y + 1][z] === s) e -= J;
          if (z + 1 < size && states[x][y][z + 1] === s) e -= J;
        }
    return e / (size * size * size);
  };

  const renderPotts = () => {
    const { size, states } = pottsModel;
    const freq = Array(27).fill(0);
    for (let x = 0; x < size; x++)
      for (let y = 0; y < size; y++)
        for (let z = 0; z < size; z++) freq[states[x][y][z]]++;

    const energy = averageEnergy(pottsModel).toFixed(3);

    return (
      <div>
        <div className="mb-2">Avg Energy: {energy}</div>
        <div className="grid grid-cols-3 gap-1">
          {freq.map((c, s) => (
            <div key={s} className="flex items-center gap-1">
              <span style={{ color: symbolColor(s) }}>{symbols[s]}</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="w-64 h-full border-l border-white/10 flex flex-col text-xs">
      <div className="flex">
        {tabs.map((t) => (
          <button
            key={t}
            className={`flex-1 px-2 py-1 border-b border-white/10 ${tab === t ? 'bg-white/10' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="p-2 flex-1 overflow-auto">
        {tab === 'Potts' ? (
          renderPotts()
        ) : (
          <div className="opacity-70">{tab} panel coming soon</div>
        )}
      </div>
    </div>
  );
}
