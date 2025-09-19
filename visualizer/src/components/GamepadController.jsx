import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGamepadIntents } from '../input/gamepad.ts';
import { handleIntent } from '../input/intentHandlers.ts';
import { useStore } from '../app/store.jsx';

const MAX_HISTORY = 5;

export function GamepadController({ onStatus }) {
  const store = useStore();
  const [history, setHistory] = useState([]);

  const mapping = useMemo(() => store.controller?.mapping ?? {}, [store.controller]);

  const status = useGamepadIntents(
    useCallback(
      (intent, intentName) => {
        handleIntent(intent, store);
        setHistory((prev) => {
          const entry = {
            name: intentName,
            intent,
            at: Date.now(),
          };
          const next = [...prev, entry];
          if (next.length > MAX_HISTORY) next.shift();
          return next;
        });
      },
      [store]
    ),
    mapping
  );

  useEffect(() => {
    if (onStatus) {
      onStatus(status, history, mapping);
    }
  }, [onStatus, status, history, mapping]);

  return null;
}
