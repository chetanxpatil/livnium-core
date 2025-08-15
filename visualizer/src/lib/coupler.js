export function couplerMagnitude(pos, alpha = 1, tau0 = 1) {
  const win = globalThis?.livnium;
  if (!win) return 0;
  const params = win.makeCouplerParams(tau0, alpha);
  return win.couplingAt(pos.x, pos.y, pos.z, params);
}

export const hasLivnium = !!globalThis?.livnium;
