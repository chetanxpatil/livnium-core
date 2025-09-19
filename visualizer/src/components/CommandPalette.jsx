import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../app/store.jsx';
import { listCommandEntries, IntentCatalog } from '../input/intents.ts';
import { handleIntent, parseAlg } from '../input/intentHandlers.ts';

const MOVE_COMMANDS = ['U', "U'", 'U2', 'D', "D'", 'D2', 'L', "L'", 'L2', 'R', "R'", 'R2', 'F', "F'", 'F2', 'B', "B'", 'B2'];

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

export function CommandPalette({ isOpen, onClose, mapping }) {
  const store = useStore();
  const [query, setQuery] = useState('');
  const commands = useMemo(() => {
    const base = listCommandEntries();
    const moves = MOVE_COMMANDS.map((move) => ({
      id: `move:${move}`,
      label: `Move ${move}`,
      category: 'Moves',
    }));
    return [...base, ...moves];
  }, []);

  useEffect(() => {
    const handler = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (isOpen) onClose();
        else store.setUi({ showPalette: true });
      }
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, store]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = commands.filter((cmd) => {
    const value = `${cmd.label} ${cmd.category}`.toLowerCase();
    return value.includes(query.toLowerCase());
  });

  const execute = (commandId) => {
    if (commandId.startsWith('move:')) {
      const seq = commandId.replace('move:', '');
      store.applyMoveSequence(parseAlg(seq));
      store.setUi({ showPalette: false });
      return;
    }
    const intent = IntentCatalog[commandId];
    if (intent) {
      handleIntent(intent.create(), store);
    }
    store.setUi({ showPalette: false });
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24" role="dialog" aria-modal>
      <div className="w-[520px] bg-[#11131a] border border-white/10 rounded-xl shadow-xl overflow-hidden">
        <div className="border-b border-white/10">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="w-full px-4 py-3 bg-transparent text-white outline-none"
          />
        </div>
        <div className="max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-sm text-white/50">No commands found.</div>
          ) : (
            filtered.map((cmd) => {
              const binding = mapping?.[cmd.id];
              return (
                <button
                  key={cmd.id}
                  onClick={() => execute(cmd.id)}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 transition flex items-center justify-between text-white/80"
                >
                  <div>
                    <div className="text-sm text-white">{cmd.label}</div>
                    <div className="text-xs text-white/50">{cmd.category}</div>
                  </div>
                  {binding && binding.type === 'button' && (
                    <span className="text-xs text-white/60 border border-white/10 rounded px-2 py-1">
                      {BUTTON_LABELS[binding.button] ?? binding.button}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
