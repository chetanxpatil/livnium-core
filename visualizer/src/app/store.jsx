import React, { createContext, useContext, useEffect, useState } from 'react';
import { createPotts27 } from '../lib/potts27.js';
import { applyMoves } from '../lib/moves.js';
import { IntentNames } from '../input/intents.ts';
import { AXES, clampSliceIndex, directionToTurns, rotateLayer } from '../lib/selectionMoves.js';

const STORAGE_KEY = 'livnium-visualizer-settings';

const DEFAULT_CONTROLLER_MAPPING = {
  [IntentNames.modeToggle]: { type: 'button', button: 'south' },
  [IntentNames.pottsReset]: { type: 'button', button: 'east' },
  [IntentNames.toggleLabels]: { type: 'button', button: 'west' },
  [IntentNames.selectionSliceDecrease]: { type: 'button', button: 'dpad-left', repeat: true },
  [IntentNames.selectionSliceIncrease]: { type: 'button', button: 'dpad-right', repeat: true },
  [IntentNames.selectionAxisPrev]: { type: 'button', button: 'dpad-up', repeat: true },
  [IntentNames.selectionAxisNext]: { type: 'button', button: 'dpad-down', repeat: true },
  [IntentNames.selectionRotateCcw]: { type: 'button', button: 'l1' },
  [IntentNames.selectionRotateCw]: { type: 'button', button: 'r1' },
  [IntentNames.tauDecrease]: { type: 'axis', axis: 3, direction: 'positive', repeat: true, threshold: 0.3 },
  [IntentNames.tauIncrease]: { type: 'axis', axis: 3, direction: 'negative', repeat: true, threshold: 0.3 },
  [IntentNames.alphaDecrease]: { type: 'button', button: 'l2', analog: true },
  [IntentNames.alphaIncrease]: { type: 'button', button: 'r2', analog: true },
  [IntentNames.selectionConfirm]: { type: 'button', button: 'ls' },
  [IntentNames.labelsCycle]: { type: 'button', button: 'rs' },
  [IntentNames.toggleAxes]: { type: 'button', button: 'north' },
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
  const [selectedAxis, setSelectedAxis] = useState('x');
  const [selectedSlice, setSelectedSlice] = useState(0);
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
  const cycleSelectedAxis = (delta) =>
    setSelectedAxis((prev) => {
      const index = AXES.indexOf(prev);
      const nextIndex = (index + delta + AXES.length) % AXES.length;
      return AXES[nextIndex];
    });
  const adjustSelectedSlice = (delta) =>
    setSelectedSlice((prev) => clampSliceIndex(prev + delta));
  const rotateSelection = (direction) => {
    const turns = directionToTurns(direction);
    if (turns === 0) return;
    const axis = selection?.axis ?? selectedAxis;
    const sliceIndex = selection?.slice ?? selectedSlice;
    setCubes((prev) => rotateLayer(prev, axis, sliceIndex, turns));
  };

  const confirmSelection = () => {
    setSelection((prev) => {
      if (prev && prev.axis === selectedAxis && prev.slice === selectedSlice) {
        return null;
      }
      return { axis: selectedAxis, slice: selectedSlice };
    });
  };

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
    setSelectedAxis('x');
    setSelectedSlice(0);
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
    selectedAxis,
    setSelectedAxis,
    cycleSelectedAxis,
    selectedSlice,
    setSelectedSlice,
    adjustSelectedSlice,
    rotateSelection,
    showLabels,
    setShowLabels,
    toggleShowLabels: () => setShowLabels((prev) => !prev),
    labelMode,
    setLabelMode,
    cycleLabelMode,
    selection,
    setSelection,
    confirmSelection,
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
