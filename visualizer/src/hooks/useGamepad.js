import { useEffect, useRef } from 'react';

const AXIS_EPSILON = 0.01;

export function useGamepad() {
  const previousStateRef = useRef(new Map());

  useEffect(() => {
    let animationFrameId;

    const pollGamepads = () => {
      const gamepads = typeof navigator !== 'undefined' && navigator.getGamepads ? navigator.getGamepads() : [];

      for (const gamepad of gamepads) {
        if (!gamepad) continue;

        const previousState = previousStateRef.current.get(gamepad.index) ?? {
          buttons: gamepad.buttons.map(() => ({ pressed: false, value: 0 })),
          axes: gamepad.axes.map(() => 0),
        };

        gamepad.buttons.forEach((button, index) => {
          const wasPressed = previousState.buttons[index]?.pressed ?? false;
          if (!wasPressed && button.pressed) {
            console.log(`Gamepad ${gamepad.index} button ${index} pressed`);
          }
        });

        gamepad.axes.forEach((axisValue, index) => {
          const previousValue = previousState.axes[index] ?? 0;
          if (Math.abs(previousValue - axisValue) > AXIS_EPSILON) {
            console.log(`Gamepad ${gamepad.index} axis ${index} changed to ${axisValue.toFixed(3)}`);
          }
        });

        previousStateRef.current.set(gamepad.index, {
          buttons: gamepad.buttons.map((button) => ({ pressed: button.pressed, value: button.value })),
          axes: [...gamepad.axes],
        });
      }

      animationFrameId = window.requestAnimationFrame(pollGamepads);
    };

    animationFrameId = window.requestAnimationFrame(pollGamepads);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      previousStateRef.current.clear();
    };
  }, []);
}
