import React, { useEffect } from 'react';
import { useStore } from '../app/store.jsx';
import { IntentCatalog } from '../input/intents.ts';

const KEYBOARD_EQUIVALENTS = [
  { action: 'Toggle Mode', key: '1' },
  { action: 'Slice Left/Right', key: 'L / R' },
  { action: 'Drop Axis', key: 'X / Y / Z / 0' },
  { action: 'Alpha ±', key: '[ / ]' },
  { action: 'Tau₀ ±', key: "; / '" },
  { action: 'Start/Stop Potts', key: 'Space' },
  { action: 'Reset Potts', key: 'B' },
  { action: 'Help', key: '?' },
];

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

export function HelpOverlay({ isOpen, onClose, mapping }) {
  const { resetControllerMapping } = useStore();

  useEffect(() => {
    if (!isOpen) return;
    const handler = (event) => {
      if (event.key === 'Escape' || event.key.toLowerCase() === 'b') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const entries = Object.entries(mapping ?? {}).map(([intentName, binding]) => {
    const intent = IntentCatalog[intentName];
    if (!intent) return null;
    let bindingLabel = '—';
    if (binding?.type === 'button') bindingLabel = BUTTON_LABELS[binding.button] ?? binding.button;
    if (binding?.type === 'axis') {
      const key = `${binding.axis}:${binding.direction}`;
      bindingLabel = AXIS_LABELS[key] ?? `Axis ${binding.axis} ${binding.direction === 'positive' ? '+' : '-'}`;
    }
    return {
      label: intent.label,
      binding: bindingLabel,

    };
  }).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md text-white overflow-auto">
      <div className="max-w-5xl mx-auto py-16 px-8 space-y-10">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Control Reference</h1>
            <p className="text-white/70 max-w-xl mt-2">
              Livnium Visualizer is fully navigable with DualSense and Xbox controllers. Use this guide to learn the default
              bindings and keyboard equivalents. You can remap buttons in Settings.
            </p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-xl">×</button>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold mb-4">Controller Bindings</h2>
            <div className="space-y-2 text-sm">
              {entries.length === 0 && <div className="text-white/50">No bindings configured.</div>}
              {entries.map((entry) => (
                <div key={entry.label} className="flex items-center justify-between bg-black/30 px-3 py-2 rounded">
                  <span>{entry.label}</span>
                  <span className="text-white/60">{entry.binding}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold mb-4">Keyboard Equivalents</h2>
            <div className="space-y-2 text-sm">
              {KEYBOARD_EQUIVALENTS.map((item) => (
                <div key={item.action} className="flex items-center justify-between bg-black/30 px-3 py-2 rounded">
                  <span>{item.action}</span>
                  <span className="text-white/60">{item.key}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-6">
          <div>
            <h3 className="text-lg font-semibold">Reset bindings</h3>
            <p className="text-white/60 max-w-lg">Return controller mappings to their defaults. This keeps other settings intact.</p>
          </div>
          <button
            onClick={() => {
              resetControllerMapping();
              onClose();
            }}
            className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20"
          >
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}
