import type { Intent } from './gamepad';

export const IntentNames = Object.freeze({
  modeToggle: 'mode/toggle',
  labelsCycle: 'labels/cycle',
  dropNone: 'drop/set:none',
  dropX: 'drop/set:x',
  dropY: 'drop/set:y',
  dropZ: 'drop/set:z',
  dropCycle: 'drop/cycle',
  sliceDecrease: 'slice/dec',
  sliceIncrease: 'slice/inc',
  alphaDecrease: 'param/alpha/dec',
  alphaIncrease: 'param/alpha/inc',
  tauDecrease: 'param/tau/dec',
  tauIncrease: 'param/tau/inc',
  toggleAxes: 'view/toggleAxes',
  toggleLabels: 'view/toggleLabels',
  pottsStart: 'potts/start',
  pottsStop: 'potts/stop',
  pottsReset: 'potts/reset',
  openPalette: 'ui/togglePalette',
  toggleHelp: 'ui/toggleHelp',
} as const);

export type IntentName = (typeof IntentNames)[keyof typeof IntentNames];

export type IntentFactoryOptions = {
  analogValue?: number;
};

export type IntentDefinition = {
  id: string;
  label: string;
  category: string;
  description?: string;
  create: (options?: IntentFactoryOptions) => Intent;
};

export const IntentCatalog: Record<IntentName, IntentDefinition> = {
  [IntentNames.modeToggle]: {
    id: 'mode/toggle',
    label: 'Toggle Color Mode',
    category: 'Mode',
    description: 'Switch between Exposure and Coupler modes',
    create: () => ({ type: 'mode/toggle' }),
  },
  [IntentNames.labelsCycle]: {
    id: 'labels/cycle',
    label: 'Cycle Label Mode',
    category: 'Mode',
    create: () => ({ type: 'labels/cycle' }),
  },
  [IntentNames.dropNone]: {
    id: 'drop/set:none',
    label: 'Drop Axis: None',
    category: 'Drop',
    create: () => ({ type: 'drop/set', axis: 'none' }),
  },
  [IntentNames.dropX]: {
    id: 'drop/set:x',
    label: 'Drop Axis: X',
    category: 'Drop',
    create: () => ({ type: 'drop/set', axis: 'x' }),
  },
  [IntentNames.dropY]: {
    id: 'drop/set:y',
    label: 'Drop Axis: Y',
    category: 'Drop',
    create: () => ({ type: 'drop/set', axis: 'y' }),
  },
  [IntentNames.dropZ]: {
    id: 'drop/set:z',
    label: 'Drop Axis: Z',
    category: 'Drop',
    create: () => ({ type: 'drop/set', axis: 'z' }),
  },
  [IntentNames.dropCycle]: {
    id: 'drop/cycle',
    label: 'Cycle Drop Axis',
    category: 'Drop',
    create: () => ({ type: 'drop/cycle' }),
  },
  [IntentNames.sliceDecrease]: {
    id: 'slice/dec',
    label: 'Slice -1',
    category: 'Slice',
    create: () => ({ type: 'slice/inc', delta: -1 }),
  },
  [IntentNames.sliceIncrease]: {
    id: 'slice/inc',
    label: 'Slice +1',
    category: 'Slice',
    create: () => ({ type: 'slice/inc', delta: 1 }),
  },
  [IntentNames.alphaDecrease]: {
    id: 'param/alpha/dec',
    label: 'Alpha -',
    category: 'Parameters',
    create: ({ analogValue = 1 } = {}) => ({
      type: 'param/alpha',
      delta: -0.1 * analogValue,
    }),
  },
  [IntentNames.alphaIncrease]: {
    id: 'param/alpha/inc',
    label: 'Alpha +',
    category: 'Parameters',
    create: ({ analogValue = 1 } = {}) => ({
      type: 'param/alpha',
      delta: 0.1 * analogValue,
    }),
  },
  [IntentNames.tauDecrease]: {
    id: 'param/tau/dec',
    label: 'Tau₀ -',
    category: 'Parameters',
    create: ({ analogValue = 1 } = {}) => ({
      type: 'param/tau0',
      delta: -0.1 * analogValue,
    }),
  },
  [IntentNames.tauIncrease]: {
    id: 'param/tau/inc',
    label: 'Tau₀ +',
    category: 'Parameters',
    create: ({ analogValue = 1 } = {}) => ({
      type: 'param/tau0',
      delta: 0.1 * analogValue,
    }),
  },
  [IntentNames.toggleAxes]: {
    id: 'view/toggleAxes',
    label: 'Toggle Axes',
    category: 'View',
    create: () => ({ type: 'view/toggleAxes' }),
  },
  [IntentNames.toggleLabels]: {
    id: 'view/toggleLabels',
    label: 'Toggle Labels',
    category: 'View',
    create: () => ({ type: 'view/toggleLabels' }),
  },
  [IntentNames.pottsStart]: {
    id: 'potts/start',
    label: 'Start/Stop Potts',
    category: 'Potts',
    create: () => ({ type: 'potts/start' }),
  },
  [IntentNames.pottsStop]: {
    id: 'potts/stop',
    label: 'Stop Potts',
    category: 'Potts',
    create: () => ({ type: 'potts/stop' }),
  },
  [IntentNames.pottsReset]: {
    id: 'potts/reset',
    label: 'Reset Potts',
    category: 'Potts',
    create: () => ({ type: 'potts/reset' }),
  },
  [IntentNames.openPalette]: {
    id: 'ui/togglePalette',
    label: 'Open Command Palette',
    category: 'UI',
    create: () => ({ type: 'ui/togglePalette', value: true }),
  },
  [IntentNames.toggleHelp]: {
    id: 'ui/toggleHelp',
    label: 'Open Help',
    category: 'UI',
    create: () => ({ type: 'ui/toggleHelp', value: true }),
  },
};

export const IntentGroups = ['Mode', 'Drop', 'Slice', 'Parameters', 'View', 'Potts', 'Moves', 'UI'];

export function createIntentFromName(name: string, options?: IntentFactoryOptions): Intent | null {
  const def = IntentCatalog[name];
  if (!def) return null;
  return def.create(options);
}

export type CommandEntry = {
  id: string;
  label: string;
  category: string;
  description?: string;
};

export function listCommandEntries(): CommandEntry[] {
  return Object.values(IntentCatalog).map(({ id, label, category, description }) => ({
    id,
    label,
    category,
    description,
  }));
}
