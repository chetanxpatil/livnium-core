// Potts model utilities for q=27

export const symbols = ['0', ...'abcdefghijklmnopqrstuvwxyz'.split('')];

export function stateSymbol(state) {
  return symbols[state] ?? '?';
}

export function symbolColor(state) {
  return `hsl(${(360 / 27) * state},70%,50%)`;
}

export function createPotts27(size = 3) {
  const states = Array.from({ length: size }, () =>
    Array.from({ length: size }, () =>
      Array.from({ length: size }, () => Math.floor(Math.random() * 27)),
    ),
  );
  return { size, states };
}

export function neighbors(x, y, z, size) {
  const n = [];
  if (x > 0) n.push([x - 1, y, z]);
  if (x < size - 1) n.push([x + 1, y, z]);
  if (y > 0) n.push([x, y - 1, z]);
  if (y < size - 1) n.push([x, y + 1, z]);
  if (z > 0) n.push([x, y, z - 1]);
  if (z < size - 1) n.push([x, y, z + 1]);
  return n;
}

export function energyDelta(model, x, y, z, newState, J = 1) {
  const { size, states } = model;
  const current = states[x][y][z];
  let sameOld = 0;
  let sameNew = 0;
  for (const [nx, ny, nz] of neighbors(x, y, z, size)) {
    const neigh = states[nx][ny][nz];
    if (neigh === current) sameOld++;
    if (neigh === newState) sameNew++;
  }
  return J * (sameOld - sameNew);
}

export function stepPotts27(model, T, J = 1) {
  const { size, states } = model;
  const x = Math.floor(Math.random() * size);
  const y = Math.floor(Math.random() * size);
  const z = Math.floor(Math.random() * size);
  const current = states[x][y][z];
  let newState = current;
  while (newState === current) newState = Math.floor(Math.random() * 27);
  const dE = energyDelta(model, x, y, z, newState, J);
  if (dE <= 0 || Math.random() < Math.exp(-dE / T)) {
    states[x][y][z] = newState;
    return true;
  }
  return false;
}

