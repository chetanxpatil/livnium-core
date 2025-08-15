import { FACE_LETTERS } from './constants.js';

export function faceLetterFor(pos, axis, sign) {
  if (axis === 'z') {
    const key = `z${sign > 0 ? '+1' : '-1'}`;
    const grid = FACE_LETTERS[key];
    const row = pos.y === 1 ? 0 : pos.y === 0 ? 1 : 2;
    const col = pos.x === -1 ? 0 : pos.x === 0 ? 1 : 2;
    return grid[row][col];
  }
  if (axis === 'x') {
    const key = `x${sign > 0 ? '+1' : '-1'}`;
    const grid = FACE_LETTERS[key];
    const row = pos.y === 1 ? 0 : pos.y === 0 ? 1 : 2;
    const col = pos.z === 1 ? 0 : pos.z === 0 ? 1 : 2;
    return grid[row][col];
  }
  const key = `y${sign > 0 ? '+1' : '-1'}`;
  const grid = FACE_LETTERS[key];
  const row = pos.z === 1 ? 0 : pos.z === 0 ? 1 : 2;
  const col = pos.x === -1 ? 0 : pos.x === 0 ? 1 : 2;
  return grid[row][col];
}
