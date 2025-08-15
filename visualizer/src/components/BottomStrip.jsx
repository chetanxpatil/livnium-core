import React from 'react';
import { useStore } from '../app/store.js';

export function BottomStrip() {
  const { mode, alpha, tau0, drop, slice } = useStore();
  const status =
    mode === 'coupler'
      ? `Coupler α=${alpha.toFixed(1)} τ₀=${tau0.toFixed(1)}`
      : 'Exposure';
  return (
    <div className="h-8 flex items-center justify-between px-3 border-t border-white/10 text-xs bg-neutral-900">
      <div className="flex items-center gap-2">
        <span>Legend</span>
      </div>
      <div className="flex items-center gap-4">
        <span>{status}</span>
        {drop !== 'none' && <span>Drop {drop.toUpperCase()} Slice {slice}</span>}
      </div>
    </div>
  );
}
