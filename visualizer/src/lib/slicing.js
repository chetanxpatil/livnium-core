export function isHiddenByDrop(pos, drop, slice) {
  if (drop === 'x') return pos.x !== slice;
  if (drop === 'y') return pos.y !== slice;
  if (drop === 'z') return pos.z !== slice;
  return false;
}
