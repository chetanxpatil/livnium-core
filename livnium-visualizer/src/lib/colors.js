import { exposureCount } from './exposure.js';
import { couplerMagnitude } from './coupler.js';
import { K } from './constants.js';

export const hsl = (h, s, l) => `hsl(${h} ${s}% ${l}%)`;

export const colorByExposure = (pos) =>
  ["#9ca3af", "#4ade80", "#60a5fa", "#f472b6"][exposureCount(pos)] ?? "#fff";

export function colorByCoupler(pos, alpha, tau0) {
  const c = couplerMagnitude(pos, alpha, tau0);
  const t = Math.min(c / K, 1);
  const hue = 220 - 160 * t;
  const light = 40 + 20 * t;
  return hsl(hue, 80, light);
}
