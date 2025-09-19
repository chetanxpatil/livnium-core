import React, { useState, useEffect } from 'react';
import { useStore } from '../app/store.jsx';
import { IntentCatalog, IntentNames } from '../input/intents.ts';

const BUTTON_OPTIONS = [
  { value: 'south', label: 'A / Cross' },
  { value: 'east', label: 'B / Circle' },
  { value: 'west', label: 'X / Square' },
  { value: 'north', label: 'Y / Triangle' },
  { value: 'l1', label: 'L1' },
  { value: 'r1', label: 'R1' },
  { value: 'l2', label: 'L2' },
  { value: 'r2', label: 'R2' },
  { value: 'ls', label: 'LS Click' },
  { value: 'rs', label: 'RS Click' },
  { value: 'share', label: 'View / Share' },
  { value: 'options', label: 'Menu / Options' },
  { value: 'dpad-up', label: 'D-Pad ↑' },
  { value: 'dpad-down', label: 'D-Pad ↓' },
  { value: 'dpad-left', label: 'D-Pad ←' },
  { value: 'dpad-right', label: 'D-Pad →' },
];

const TABS = [
  { id: 'controller', label: 'Controller' },
  { id: 'display', label: 'Display' },
];

export function SettingsModal({ isOpen, onClose }) {
  const store = useStore();
  const { controller, setControllerMapping, setController, ui, setUi } = store;
  const [activeTab, setActiveTab] = useState('controller');

  useEffect(() => {
    if (!isOpen) return;
    const handler = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('controller');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const mapping = controller?.mapping ?? {};

  const handleBindingChange = (intentName, value) => {
    if (!value) {
      setController((prev) => {
        const nextMapping = { ...prev.mapping };
        delete nextMapping[intentName];
        return { ...prev, mapping: nextMapping };
      });
      return;
    }
    const current = mapping[intentName] ?? { type: 'button', button: value };
    setControllerMapping(intentName, { ...current, button: value });
  };

  const renderControllerTab = () => {
    const entries = Object.entries(IntentCatalog).filter(([id]) => id !== IntentNames.openPalette && id !== IntentNames.toggleHelp);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entries.map(([id, intent]) => {
            const binding = mapping[id];
            return (
              <div key={id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-sm text-white/80">{intent.label}</div>
                <div className="text-xs text-white/40 mb-2">{intent.category}</div>
                <select
                  value={binding?.button ?? ''}
                  onChange={(e) => handleBindingChange(id, e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded px-2 py-1 text-white"
                >
                  <option value="">Unassigned</option>
                  {BUTTON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
            <div className="text-sm text-white/80">Deadzone</div>
            <input
              type="range"
              min={0}
              max={0.5}
              step={0.01}
              value={controller.deadzone}
              onChange={(e) => setController((prev) => ({ ...prev, deadzone: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <div className="text-xs text-white/50">{controller.deadzone.toFixed(2)}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-white/80">Invert Y Axis</div>
              <div className="text-xs text-white/50">Swap the sign of vertical look input</div>
            </div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={controller.invertY}
                onChange={(e) => setController((prev) => ({ ...prev, invertY: e.target.checked }))}
              />
              Invert
            </label>
          </div>
        </div>
      </div>
    );
  };

  const renderDisplayTab = () => (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-white/80">Theme</div>
          <div className="text-xs text-white/50">Dark theme is recommended for accuracy.</div>
        </div>
        <select
          value={ui.theme}
          onChange={(e) => setUi({ theme: e.target.value })}
          className="bg-black/40 border border-white/20 rounded px-3 py-1 text-white"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white/80">Font Scale</div>
            <div className="text-xs text-white/50">Adjust UI readability for streaming or presentations.</div>
          </div>
          <span className="text-white/60">{ui.fontScale.toFixed(2)}x</span>
        </div>
        <input
          type="range"
          min={0.8}
          max={1.4}
          step={0.05}
          value={ui.fontScale}
          onChange={(e) => setUi({ fontScale: parseFloat(e.target.value) })}
          className="w-full mt-3"
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="w-[720px] max-h-[80vh] bg-[#11131a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">Settings</h2>
            <p className="text-white/50 text-sm">Customize controller bindings and display preferences.</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white text-xl">×</button>
        </header>
        <div className="px-6 pt-4">
          <div className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm border ${
                  activeTab === tab.id
                    ? 'border-white/40 bg-white/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'controller' ? renderControllerTab() : renderDisplayTab()}
        </div>
      </div>
    </div>
  );
}
