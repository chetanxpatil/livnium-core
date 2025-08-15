import React, { useState } from 'react';

const tabs = ['Projections', 'Couplers', 'Energy', 'Mapping', 'L1'];

export function Insights() {
  const [tab, setTab] = useState('Projections');
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
        <div className="opacity-70">{tab} panel coming soon</div>
      </div>
    </div>
  );
}
