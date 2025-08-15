import React, { createContext, useContext, useState } from 'react';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [mode, setMode] = useState('exposure');
  const [alpha, setAlpha] = useState(1);
  const [tau0, setTau0] = useState(1);
  const [drop, setDrop] = useState('none');
  const [slice, setSlice] = useState(0);
  const [showLabels, setShowLabels] = useState(false);
  const [labelMode, setLabelMode] = useState('xyz');
  const [selection, setSelection] = useState(null);
  const [showAxes, setShowAxes] = useState(true);

  const reset = () => {
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

  const value = {
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
    reset,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
