import { useEffect, useRef, useState } from 'react';
import { createIntentFromName } from './intents.ts';

export type Intent =
  | { type: 'mode/toggle' }
  | { type: 'labels/cycle' }
  | { type: 'drop/set'; axis: 'none' | 'x' | 'y' | 'z' }
  | { type: 'drop/cycle' }
  | { type: 'slice/inc'; delta: -1 | 1 }
  | { type: 'selection/axis'; delta: -1 | 1 }
  | { type: 'selection/slice'; delta: -1 | 1 }
  | { type: 'selection/rotate'; direction: 'cw' | 'ccw' | 'half' }
  | { type: 'selection/confirm' }
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

export type AxisBinding = {
  type: 'axis';
  axis: number;
  direction: 'positive' | 'negative';
  threshold?: number;
  repeat?: boolean;
  scale?: number;
};

export type ControlBinding = ButtonBinding | AxisBinding;

export type ControllerMapping = Record<string, ControlBinding>;

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
          if (!binding) continue;
          let pressed = false;
          let analogValue = 1;

          if (binding.type === 'button') {
            const indices = getButtonsFor(layout, binding.button);
            if (!indices.length) continue;
            pressed = indices.some((idx) => pad.buttons[idx]?.pressed ?? false);
            analogValue = binding.analog
              ? Math.max(...indices.map((idx) => pad.buttons[idx]?.value ?? 0))
              : 1;
          } else if (binding.type === 'axis') {
            const value = pad.axes[binding.axis] ?? 0;
            const threshold = binding.threshold ?? 0.25;
            const isPositive = binding.direction === 'positive';
            analogValue = Math.abs(value);
            pressed = isPositive ? value >= threshold : value <= -threshold;
            if (binding.scale) analogValue *= binding.scale;
          }

          const prevPressed = prevPressedRef.current[intentName] ?? false;
          const repeatState = repeatRef.current[intentName] ?? { active: false, nextFire: 0 };
          const allowRepeat = Boolean((binding as ButtonBinding | AxisBinding).repeat);

          if (pressed && !prevPressed) {
            fireIntent(intentName, analogValue);
            repeatRef.current[intentName] = {
              active: allowRepeat,
              nextFire: now + (allowRepeat ? 250 : Number.POSITIVE_INFINITY),
            };
          } else if (!pressed && prevPressed) {
            repeatRef.current[intentName] = { active: allowRepeat, nextFire: 0 };
          } else if (pressed && allowRepeat && repeatState.active && now >= repeatState.nextFire) {
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
