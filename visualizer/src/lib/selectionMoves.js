import { rotateX, rotateY, rotateZ } from './moves.js';

export const AXES = ['x', 'y', 'z'];

export function clampSliceIndex(value) {
  return Math.max(-1, Math.min(1, value));
}

function normaliseTurns(turns) {
  const t = turns % 4;
  return t < 0 ? t + 4 : t;
}

const ROTORS = {
  x: rotateX,
  y: rotateY,
  z: rotateZ,
};

export function rotateLayer(cubes, axis, sliceIndex, quarterTurns) {
  if (!AXES.includes(axis)) return cubes;
  const turns = normaliseTurns(quarterTurns);
  if (turns === 0) return cubes;
  const rotor = ROTORS[axis];
  return cubes.map((cube) => {
    if (!cube?.pos || cube.pos[axis] !== sliceIndex) return cube;
    let pos = cube.pos;
    for (let i = 0; i < turns; i += 1) {
      pos = rotor(pos);
    }
    return { ...cube, pos };
  });
}

const MOVE_LOOKUP = {
  x: {
    '-1': { cw: 'L', ccw: "L'", half: 'L2' },
    '0': { cw: 'M', ccw: "M'", half: 'M2' },
    '1': { cw: 'R', ccw: "R'", half: 'R2' },
  },
  y: {
    '-1': { cw: 'D', ccw: "D'", half: 'D2' },
    '0': { cw: 'E', ccw: "E'", half: 'E2' },
    '1': { cw: 'U', ccw: "U'", half: 'U2' },
  },
  z: {
    '-1': { cw: 'B', ccw: "B'", half: 'B2' },
    '0': { cw: 'S', ccw: "S'", half: 'S2' },
    '1': { cw: 'F', ccw: "F'", half: 'F2' },
  },
};

export function describeSelectionMove(axis, sliceIndex, direction) {
  const key = String(sliceIndex);
  const entry = MOVE_LOOKUP[axis]?.[key];
  return entry?.[direction] ?? null;
}

export function directionToTurns(direction) {
  switch (direction) {
    case 'cw':
      return 1;
    case 'ccw':
      return -1;
    case 'half':
    case '180':
      return 2;
    default:
      return 0;
  }
}
