import React, { createContext, useContext, useState } from 'react';
import { createPotts27 } from '../lib/potts27.js';
import { applyFaceMove, applyMoves as applyMovesLib } from '../lib/moves.js';

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

  const applyMove = (move) => setCubes(prev => applyFaceMove(prev, move));
  const applyMoves = (seq) => setCubes(prev => applyMovesLib(prev, seq));
  const invertMoves = (seq) =>
    seq.slice().reverse().map(m => ({ face: m.face, quarterTurns: -m.quarterTurns }));

  const value = {
    cubes,
    setCubes,
    mode,
    setMode,
    alpha,
    setAlpha,
    tau0,
    setTau0,
    drop,
    setDrop,
    slice,
    setSlice,
    showLabels,
    setShowLabels,
    labelMode,
    setLabelMode,
    selection,
    setSelection,
    showAxes,
    setShowAxes,
    pottsModel,
    setPottsModel,
    temperature,
    setTemperature,
    isPottsRunning,
    setIsPottsRunning,
    resetPotts,
    reset,
    applyMove,
    applyMoves,
    invertMoves,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
