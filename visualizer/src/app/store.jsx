import React, { createContext, useContext, useEffect, useState } from 'react';
import { createPotts27 } from '../lib/potts27.js';
import { applyMoves } from '../lib/moves.js';
import { IntentNames } from '../input/intents.ts';

const STORAGE_KEY = 'livnium-visualizer-settings';

const DEFAULT_CONTROLLER_MAPPING = {
  [IntentNames.modeToggle]: { type: 'button', button: 'south' },
  [IntentNames.pottsReset]: { type: 'button', button: 'east' },
  [IntentNames.toggleLabels]: { type: 'button', button: 'west' },
  [IntentNames.toggleAxes]: { type: 'button', button: 'north' },
  [IntentNames.sliceDecrease]: { type: 'button', button: 'dpad-left', repeat: true },
  [IntentNames.sliceIncrease]: { type: 'button', button: 'dpad-right', repeat: true },
  [IntentNames.dropX]: { type: 'button', button: 'dpad-down' },
  [IntentNames.dropY]: { type: 'button', button: 'dpad-up' },
  [IntentNames.tauDecrease]: { type: 'button', button: 'l1', analog: false },
  [IntentNames.tauIncrease]: { type: 'button', button: 'r1', analog: false },
  [IntentNames.alphaDecrease]: { type: 'button', button: 'l2', analog: true },
  [IntentNames.alphaIncrease]: { type: 'button', button: 'r2', analog: true },
  [IntentNames.dropCycle]: { type: 'button', button: 'ls' },
  [IntentNames.labelsCycle]: { type: 'button', button: 'rs' },
  [IntentNames.openPalette]: { type: 'button', button: 'share' },
  [IntentNames.pottsStart]: { type: 'button', button: 'options' },
};

const createDefaultControllerState = () => ({
  mapping: { ...DEFAULT_CONTROLLER_MAPPING },
  invertY: false,
  deadzone: 0.2,
});

const DEFAULT_UI_STATE = {
  leftDockOpen: true,
  showHelp: false,
  showPalette: false,
  showSettings: false,
  theme: 'dark',
  fontScale: 1,
};

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const makeCubes = () => {
    const list = [];
    let id = 0;
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) list.push({ id: id++, pos: { x, y, z } });
    return list;
  };

  const [cubes, setCubes] = useState(makeCubes());
  const [mode, setMode] = useState('exposure');
  const [alpha, setAlpha] = useState(1);
  const [tau0, setTau0] = useState(1);
  const [drop, setDrop] = useState('none');
  const [slice, setSlice] = useState(0);
  const [showLabels, setShowLabels] = useState(false);
  const [labelMode, setLabelMode] = useState('xyz');
  const [selection, setSelection] = useState(null);
  const [showAxes, setShowAxes] = useState(true);
  const [pottsModel, setPottsModel] = useState(createPotts27(3));
  const [temperature, setTemperature] = useState(1);
  const [isPottsRunning, setIsPottsRunning] = useState(false);
  const [controller, setController] = useState(() => {
    if (typeof window === 'undefined') return createDefaultControllerState();
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return createDefaultControllerState();
      const parsed = JSON.parse(stored);
      return {
        ...createDefaultControllerState(),
        ...parsed.controller,
        mapping: {
          ...createDefaultControllerState().mapping,
          ...(parsed.controller?.mapping ?? {}),
        },
      };
    } catch (err) {
      console.warn('Failed to load controller settings', err);
      return createDefaultControllerState();
    }
  });
  const [ui, setUi] = useState(() => {
    if (typeof window === 'undefined') return { ...DEFAULT_UI_STATE };
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return { ...DEFAULT_UI_STATE };
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_UI_STATE, ...parsed.ui };
    } catch (err) {
      console.warn('Failed to load UI settings', err);
      return { ...DEFAULT_UI_STATE };
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload = JSON.stringify({
      controller: {
        ...controller,
        mapping: controller.mapping,
      },
      ui: {
        leftDockOpen: ui.leftDockOpen,
        showHelp: ui.showHelp,
        showPalette: ui.showPalette,
        showSettings: ui.showSettings,
        theme: ui.theme,
        fontScale: ui.fontScale,
      },
    });
    window.localStorage.setItem(STORAGE_KEY, payload);
  }, [controller, ui]);

  const toggleMode = () => setMode((prev) => (prev === 'exposure' ? 'coupler' : 'exposure'));
  const cycleLabelMode = () =>
    setLabelMode((prev) => {
      switch (prev) {
        case 'xyz':
          return 'face';
        case 'face':
          return 'base27';
        default:
          return 'xyz';
      }
    });
  const cycleDrop = () =>
    setDrop((prev) => {
      switch (prev) {
        case 'none':
          return 'x';
        case 'x':
          return 'y';
        case 'y':
          return 'z';
        default:
          return 'none';
      }
    });
  const clampSlice = (value) => Math.max(-1, Math.min(1, value));
  const adjustSlice = (delta) => setSlice((prev) => clampSlice(prev + delta));
  const adjustAlpha = (delta) => setAlpha((prev) => Math.max(0, Math.min(3, prev + delta)));
  const adjustTau0 = (delta) => setTau0((prev) => Math.max(0.1, Math.min(2, prev + delta)));

  const startPotts = () => setIsPottsRunning(true);
  const stopPotts = () => setIsPottsRunning(false);
  const togglePotts = () => setIsPottsRunning((prev) => !prev);

  const applyMoveSequence = (sequence) => {
    setCubes((prev) => applyMoves(prev, sequence));
  };

  const setControllerMapping = (intent, binding) => {
    setController((prev) => ({
      ...prev,
      mapping: {
        ...prev.mapping,
        [intent]: binding,
      },
    }));
  };

  const resetControllerMapping = () => {
    setController(createDefaultControllerState());
  };

  const setUiState = (partial) => {
    setUi((prev) => ({ ...prev, ...partial }));
  };

  const reset = () => {
    setCubes(makeCubes());
    setMode('exposure');
    setAlpha(1);
    setTau0(1);
    setDrop('none');
    setSlice(0);
    setShowLabels(false);
    setLabelMode('xyz');
    setSelection(null);
    setShowAxes(true);
  };

  const resetPotts = () => {
    setPottsModel(createPotts27(3));
  };

  const value = {
    cubes,
    setCubes,
    mode,
    setMode,
    alpha,
    setAlpha,
    tau0,
    setTau0,
    adjustAlpha,
    adjustTau0,
    drop,
    setDrop,
    slice,
    setSlice,
    adjustSlice,
    cycleDrop,
    showLabels,
    setShowLabels,
    toggleShowLabels: () => setShowLabels((prev) => !prev),
    labelMode,
    setLabelMode,
    cycleLabelMode,
    selection,
    setSelection,
    showAxes,
    setShowAxes,
    toggleShowAxes: () => setShowAxes((prev) => !prev),
    pottsModel,
    setPottsModel,
    temperature,
    setTemperature,
    isPottsRunning,
    setIsPottsRunning,
    startPotts,
    stopPotts,
    togglePotts,
    resetPotts,
    reset,
    controller,
    setController,
    setControllerMapping,
    resetControllerMapping,
    ui,
    setUi: setUiState,
    toggleMode,
    cycleLabelMode,
    cycleDrop,
    adjustSlice,
    applyMoveSequence,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
