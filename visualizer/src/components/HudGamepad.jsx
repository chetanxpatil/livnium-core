import React from 'react';
import { IntentCatalog } from '../input/intents.ts';

const BUTTON_LABELS = {
  south: 'A / Cross',
  east: 'B / Circle',
  west: 'X / Square',
  north: 'Y / Triangle',
  l1: 'L1',
  r1: 'R1',
  l2: 'L2',
  r2: 'R2',
  share: 'View / Share',
  options: 'Menu / Options',
  ls: 'LS Click',
  rs: 'RS Click',
  'dpad-up': 'D-Pad ↑',
  'dpad-down': 'D-Pad ↓',
  'dpad-left': 'D-Pad ←',
  'dpad-right': 'D-Pad →',
};

const AXIS_LABELS = {
  '0:positive': 'LS →',
  '0:negative': 'LS ←',
  '1:positive': 'LS ↓',
  '1:negative': 'LS ↑',
  '2:positive': 'RS →',
  '2:negative': 'RS ←',
  '3:positive': 'RS ↓',
  '3:negative': 'RS ↑',
};

function describeBinding(binding) {
  if (!binding) return '';
  if (binding.type === 'button') return BUTTON_LABELS[binding.button] ?? binding.button;
  const key = `${binding.axis}:${binding.direction}`;
  return AXIS_LABELS[key] ?? `Axis ${binding.axis} ${binding.direction === 'positive' ? '+' : '-'}`;
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function HudGamepad({ status, history, mapping }) {
  const connected = status?.connected;
  const id = status?.id ?? 'No controller';
  const axes = status?.axes ?? [];

  const legend = Object.entries(mapping ?? {})
    .map(([intentName, binding]) => {
      const intent = IntentCatalog[intentName];
      if (!intent) return null;
      return { intent, binding };
    })
    .filter(Boolean);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 w-80 bg-black/60 border border-white/10 rounded-xl p-4 text-white/80 space-y-3 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-white/50">Gamepad</div>
          <div className="text-sm font-medium text-white/90">{connected ? id : 'Disconnected'}</div>
        </div>
        <div className={`text-xs px-2 py-0.5 rounded-full ${connected ? 'bg-emerald-500/20 text-emerald-200' : 'bg-red-500/20 text-red-200'}`}>
          {connected ? 'Connected' : 'Waiting'}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-white/50 mb-1">Last Intents</div>
        <div className="space-y-1 text-xs">
          {history && history.length > 0 ? (
            [...history]
              .slice()
              .reverse()
              .map((entry) => {
                const intent = IntentCatalog[entry.name];
                return (
                  <div key={entry.at} className="flex items-center justify-between bg-white/5 px-2 py-1 rounded">
                    <span>{intent ? intent.label : entry.name}</span>
                    <span className="text-white/50">{formatTime(entry.at)}</span>
                  </div>
                );
              })
          ) : (
            <div className="text-white/40">Interact with the controller to see activity.</div>
          )}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-white/50 mb-1">Axes</div>
        <div className="text-xs grid grid-cols-2 gap-1">
          {axes.slice(0, 4).map((value, index) => (
            <div key={index} className="bg-white/5 px-2 py-1 rounded flex justify-between">
              <span>Axis {index}</span>
              <span className="text-white/60">{value.toFixed(2)}</span>
            </div>
          ))}
          {axes.length === 0 && <div className="text-white/40 col-span-2">No axes detected</div>}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-white/50 mb-1">Legend</div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {legend.length > 0 ? (
            legend.slice(0, 8).map(({ intent, binding }) => (
              <div key={intent.id} className="bg-white/5 px-2 py-1 rounded">
                <div className="text-white/60">{describeBinding(binding)}</div>
                <div className="text-white/90 font-medium">{intent.label}</div>
              </div>
            ))
          ) : (
            <div className="text-white/40 col-span-2">Configure mappings in Settings.</div>
          )}
        </div>
      </div>
    </div>
  );
}
