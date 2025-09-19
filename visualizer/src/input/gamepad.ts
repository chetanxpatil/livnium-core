import { useEffect, useRef, useState } from 'react';
import { createIntentFromName } from './intents.ts';

export type Intent =
  | { type: 'mode/toggle' }
  | { type: 'labels/cycle' }
  | { type: 'drop/set'; axis: 'none' | 'x' | 'y' | 'z' }
  | { type: 'drop/cycle' }
  | { type: 'slice/inc'; delta: -1 | 1 }
  | { type: 'param/alpha'; delta: number }
  | { type: 'param/tau0'; delta: number }
  | { type: 'potts/start' }
  | { type: 'potts/stop' }
  | { type: 'potts/reset' }
  | { type: 'view/toggleAxes' }
  | { type: 'view/toggleLabels' }
  | { type: 'move'; seq: string }
  | { type: 'ui/togglePalette'; value?: boolean }
  | { type: 'ui/toggleHelp'; value?: boolean };

export type ButtonName =
  | 'south'
  | 'east'
  | 'west'
  | 'north'
  | 'l1'
  | 'r1'
  | 'l2'
  | 'r2'
  | 'share'
  | 'options'
  | 'ls'
  | 'rs'
  | 'dpad-up'
  | 'dpad-down'
  | 'dpad-left'
  | 'dpad-right';

export type ButtonBinding = {
  type: 'button';
  button: ButtonName;
  repeat?: boolean;
  analog?: boolean;
};

export type ControllerMapping = Record<string, ButtonBinding>;

export type GamepadStatus = {
  connected: boolean;
  id?: string;
  buttons: boolean[];
  axes: number[];
};

type RepeatState = {
  active: boolean;
  nextFire: number;
};

const LAYOUTS: Record<string, Record<ButtonName, number[]>> = {
  standard: {
    south: [0],
    east: [1],
    west: [2],
    north: [3],
    l1: [4],
    r1: [5],
    l2: [6],
    r2: [7],
    share: [8, 16],
    options: [9],
    ls: [10],
    rs: [11],
    'dpad-up': [12],
    'dpad-down': [13],
    'dpad-left': [14],
    'dpad-right': [15],
  },
  dualsense: {
    south: [0],
    east: [1],
    west: [2],
    north: [3],
    l1: [4],
    r1: [5],
    l2: [6],
    r2: [7],
    share: [8],
    options: [9],
    ls: [10],
    rs: [11],
    'dpad-up': [12],
    'dpad-down': [13],
    'dpad-left': [14],
    'dpad-right': [15],
  },
};

function detectLayout(id: string) {
  const lowered = id.toLowerCase();
  if (lowered.includes('dual')) return 'dualsense';
  return 'standard';
}

function getButtonsFor(layout: string, button: ButtonName): number[] {
  const source = LAYOUTS[layout] ?? LAYOUTS.standard;
  return source[button] ?? [];
}

export function useGamepadIntents(
  onIntent: (intent: Intent, intentName: string) => void,
  mapping: ControllerMapping
): GamepadStatus {
  const [status, setStatus] = useState<GamepadStatus>({ connected: false, buttons: [], axes: [] });
  const onIntentRef = useRef(onIntent);
  const mappingRef = useRef(mapping);
  const repeatRef = useRef<Record<string, RepeatState>>({});
  const prevPressedRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    onIntentRef.current = onIntent;
  }, [onIntent]);

  useEffect(() => {
    mappingRef.current = mapping;
  }, [mapping]);

  useEffect(() => {
    let raf: number;

    const fireIntent = (intentName: string, analogValue: number) => {
      const intent = createIntentFromName(intentName, { analogValue });
      if (intent) onIntentRef.current(intent, intentName);
    };

    const step = () => {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      const pad = pads.find((p): p is Gamepad => Boolean(p));

      if (!pad) {
        setStatus((prev) => (prev.connected ? { connected: false, buttons: [], axes: [] } : prev));
        prevPressedRef.current = {};
        repeatRef.current = {};
      } else {
        const layout = detectLayout(pad.id);
        const buttonsPressed = pad.buttons.map((b) => b.pressed);
        const axesValues = Array.from(pad.axes);
        setStatus({ connected: true, id: pad.id, buttons: buttonsPressed, axes: axesValues });

        const now = performance.now();
        for (const [intentName, binding] of Object.entries(mappingRef.current)) {
          if (!binding || binding.type !== 'button') continue;
          const indices = getButtonsFor(layout, binding.button);
          if (!indices.length) continue;
          const pressed = indices.some((idx) => pad.buttons[idx]?.pressed ?? false);
          const analogValue = binding.analog
            ? Math.max(...indices.map((idx) => pad.buttons[idx]?.value ?? 0))
            : 1;
          const prevPressed = prevPressedRef.current[intentName] ?? false;
          const repeatState = repeatRef.current[intentName] ?? { active: false, nextFire: 0 };

          if (pressed && !prevPressed) {
            fireIntent(intentName, analogValue);
            repeatRef.current[intentName] = {
              active: Boolean(binding.repeat),
              nextFire: now + (binding.repeat ? 250 : Number.POSITIVE_INFINITY),
            };
          } else if (!pressed && prevPressed) {
            repeatRef.current[intentName] = { active: Boolean(binding.repeat), nextFire: 0 };
          } else if (pressed && binding.repeat && repeatState.active && now >= repeatState.nextFire) {
            fireIntent(intentName, analogValue);
            repeatState.nextFire = now + 100;
            repeatRef.current[intentName] = repeatState;
          }

          prevPressedRef.current[intentName] = pressed;
        }
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return status;
}
