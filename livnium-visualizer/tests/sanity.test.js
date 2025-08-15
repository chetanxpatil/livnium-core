import { describe, it, expect } from 'vitest';
import { exposureCount } from '../src/lib/exposure.js';
import { couplerMagnitude } from '../src/lib/coupler.js';

const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

describe('sanity', () => {
  it('exposure class counts in 3x3x3 with core', () => {
    let c0 = 0, c1 = 0, c2 = 0, c3 = 0;
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) {
          const f = exposureCount({ x, y, z });
          if (f === 0) c0++;
          else if (f === 1) c1++;
          else if (f === 2) c2++;
          else if (f === 3) c3++;
        }
    expect(c0).toBe(1);
    expect(c1).toBe(6);
    expect(c2).toBe(12);
    expect(c3).toBe(8);
  });

  if (globalThis.livnium) {
    it('coupler magnitude is monotonic', () => {
      const mags = { 1: [], 2: [], 3: [] };
      for (let x = -1; x <= 1; x++)
        for (let y = -1; y <= 1; y++)
          for (let z = -1; z <= 1; z++) {
            const L = Math.abs(x) + Math.abs(y) + Math.abs(z);
            if (L === 0) continue;
            mags[L].push(couplerMagnitude({ x, y, z }, 1, 1));
          }
      const l1a = avg(mags[1]), l2a = avg(mags[2]), l3a = avg(mags[3]);
      expect(l1a).toBeGreaterThanOrEqual(l2a);
      expect(l2a).toBeGreaterThanOrEqual(l3a);
    });

    it('core magnitude is zero', () => {
      expect(couplerMagnitude({ x: 0, y: 0, z: 0 }, 1, 1)).toBe(0);
    });
  }
});
