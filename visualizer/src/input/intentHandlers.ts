import type { Intent } from './gamepad';
import { Face } from '../lib/moves.js';

type StoreLike = {
  mode: string;
  toggleMode: () => void;
  cycleLabelMode: () => void;
  setDrop: (axis: 'none' | 'x' | 'y' | 'z') => void;
  drop: 'none' | 'x' | 'y' | 'z';
  adjustSlice: (delta: number) => void;
  cycleSelectedAxis: (delta: number) => void;
  adjustSelectedSlice: (delta: number) => void;
  rotateSelection: (direction: 'cw' | 'ccw' | 'half') => void;
  confirmSelection: () => void;

  adjustAlpha: (delta: number) => void;
  adjustTau0: (delta: number) => void;
  startPotts: () => void;
  stopPotts: () => void;
  resetPotts: () => void;
  isPottsRunning: boolean;
  toggleShowAxes: () => void;
  toggleShowLabels: () => void;
  applyMoveSequence: (sequence: Array<{ face: string; quarterTurns: number }>) => void;
  setUi: (ui: Partial<{ leftDockOpen: boolean; showHelp: boolean; showPalette: boolean; showSettings: boolean; theme: string; fontScale: number }>) => void;
  ui: {
    showPalette: boolean;
    showHelp: boolean;
  };
};

export function parseAlg(text: string) {
  if (!text) return [];
  const tokens = text
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
  const moves: Array<{ face: string; quarterTurns: number }> = [];

  for (const token of tokens) {
    const match = token.match(/^([UDLRFB])([2']?)$/i);
    if (!match) continue;
    const face = match[1].toUpperCase() as keyof typeof Face;
    const suffix = match[2];
    let quarterTurns = 1;
    if (suffix === "'") quarterTurns = -1;
    if (suffix === '2') quarterTurns = 2;
    moves.push({ face: Face[face], quarterTurns });
  }

  return moves;
}

export function handleIntent(intent: Intent, store: StoreLike) {
  switch (intent.type) {
    case 'mode/toggle':
      store.toggleMode();
      return;
    case 'labels/cycle':
      store.cycleLabelMode();
      return;
    case 'drop/cycle':
      store.setDrop(
        store.drop === 'none'
          ? 'x'
          : store.drop === 'x'
          ? 'y'
          : store.drop === 'y'
          ? 'z'
          : 'none'
      );
      return;
    case 'drop/set':
      store.setDrop(intent.axis);
      return;
    case 'slice/inc':
      store.adjustSlice(intent.delta);
      return;
    case 'selection/axis':
      store.cycleSelectedAxis(intent.delta);
      return;
    case 'selection/slice':
      store.adjustSelectedSlice(intent.delta);
      return;
    case 'selection/rotate':
      store.rotateSelection(intent.direction);
      return;
    case 'selection/confirm':
      store.confirmSelection();
      return;

    case 'param/alpha':
      store.adjustAlpha(intent.delta);
      return;
    case 'param/tau0':
      store.adjustTau0(intent.delta);
      return;
    case 'potts/start':
      if (store.isPottsRunning) {
        store.stopPotts();
      } else {
        store.startPotts();
      }
      return;
    case 'potts/stop':
      store.stopPotts();
      return;
    case 'potts/reset':
      store.resetPotts();
      return;
    case 'view/toggleAxes':
      store.toggleShowAxes();
      return;
    case 'view/toggleLabels':
      store.toggleShowLabels();
      return;
    case 'move':
      store.applyMoveSequence(parseAlg(intent.seq));
      return;
    case 'ui/togglePalette':
      store.setUi({ showPalette: intent.value ?? !store.ui.showPalette });
      return;
    case 'ui/toggleHelp':
      store.setUi({ showHelp: intent.value ?? !store.ui.showHelp });
      return;
    default:
      return;
  }
}
