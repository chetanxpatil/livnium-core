export type CouplerParams = { tau0: number; alpha: number };
export type Face = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';
export type FaceMove = { face: Face; quarterTurns: number };

export interface LivniumAPI {
  add27(a: string, b: string): string | null;
  add27Balanced(a: string, b: string): string | null;
  add27Cyclic(a: string, b: string): string | null;
  add27CarrySave3(a: string, b: string, c: string): { sum: string; carry: string };
  csFinish(sum: string, carry: string): string | null;
  toDecimal(w: string): string | null;
  fromDecimal(dec: string): string | null;

  facesForGlyph(ch: string): number | null;
  symbolEnergy9(ch: string): number | null;
  symbolEnergyK(ch: string): number | null;
  wordEnergy9(w: string): number | null;
  wordEnergyK(w: string): number | null;
  perFaceUnitEnergy(faces: number): number;
  equilibriumConstant(): number;

  permutationFor(m: FaceMove): number[];
  applyPerm(symbols: number[], perm: number[]): void;

  makeCouplerParams(tau0: number, alpha: number): CouplerParams;
  couplingAt(x: number, y: number, z: number, p: CouplerParams): number;
  rankTopCouplers(p: CouplerParams, topN: number): Array<{x:number;y:number;z:number;C:number;L:number;faces:number}>;
  complexSumMagnitude(terms: Array<{mag:number;phaseDeg:number}>): number;
}

declare global {
  interface Window { livnium: LivniumAPI }
}
