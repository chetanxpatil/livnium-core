# AGENTS.md — Livnium Core (Codex brief)

**Purpose.**  
Livnium Core turns the 3×3×3 lattice (coords in {-1,0,1}³) into a small, consistent “spatial OS”:
- Base-27 alphabet: `0, a..z` → digits `0..26`.
- Geometry: exposure/faces = 0 (core), 1 (face centers), 2 (edges), 3 (corners).
- Energy & couplers: lightweight physics‑y rules with a single constant **K = 10.125**.
- Dynamics: Potts‑Hopfield recall, face moves (Rubik-like), and a hierarchical micro‑cube tree.

---

## 0) Golden rules

- **Alphabet is base-27**: `'0'→0`, `'a'→1`, …, `'z'→26`.  
  **Never** treat `'a0'` as a single token — it’s the base‑27 number `[1,0]` (i.e., decimal 27).
- **Exposure ≡ faces**: 0 (core), 1 (centers), 2 (edges), 3 (corners). Counts are **1, 6, 12, 8**.
- **Right‑hand rule rotations** around X/Y/Z; face moves use the same convention.
- **Public API lives in** `lib/livnium_core.dart` exports. Prefer that in examples.

---

## 1) Geometry & invariants

- Coordinates: `Vec3(x,y,z)` with `x,y,z ∈ {-1,0,1}` ⇒ 27 positions.
- Class counts must always hold: **core=1, centers=6, edges=12, corners=8**.
- Helpers (see `grid.dart`):
  - `cube3Coords()`, `exposure(v)`, `isCore/Center/Edge/Corner`,
  - metrics `l1`, `linf`, `l2`,
  - `facesForVec3(v)` is the same as `exposure(v)`.

---

## 2) Alphabet & codecs

- `kRadix = 27`; `kSymbols` lists the glyphs.
- Convert helpers: `symbolToValue`, `valueToSymbol`, `stringToDigits`, `digitsToString`.
- Codecs (`codec.dart`):
  - CSV (human-readable), Fixed‑width (00–26), Tail‑sentinel BigInt (round‑trips **leading zeros**), Raw base‑27 BigInt (compact, **caller must track length**).
- 64‑bit helpers: `encodeFixedInt`/`decodeFixedInt`, `encodeDecimalInt`/`decodeDecimalInt`.
- Arithmetic (`arith27.dart`):
  - `toDecimal`, `fromDecimal` (BigInt), `add27` (canonical), `add27Balanced` (centered digits −13..+13).
  - TODO kept: finalize “balanced final carry” polish.

**Sanity**: `"a0"` encodes as fixed `"0100"` (decimal `100`) and raw BigInt `27`.

---

## 3) Energy model & the constant K

- **Equilibrium constant**:
  
  \[
  K = \frac{27}{8} + \frac{27}{12} + \frac{27}{6}
    = 27 \left(\frac{1}{8} + \frac{1}{12} + \frac{1}{6}\right)
    = \frac{81}{8} = 10.125
  \]

  - Intuition: 27 times the sum of reciprocals of the exposure‑class multiplicities (corners=8, edges=12, centers=6). It’s a compact **harmonic signature** of the 3×3×3 structure and gives nice exact rationals when split by faces.
  - **Yes**, `10.125` is a base‑10 decimal (exactly `81/8`). Dividing by 2 or 3 stays exact (binary‑friendly fractions):
    - `K/1 = 10.125`, `K/2 = 5.0625`, `K/3 = 3.375`.

- **Symbol “SE9” scale** (`energy.dart`):
  - `SE9 = (faces/3) * 27` ⇒ centers=9, edges=18, corners=27, core=0.

- **K‑units**:
  - `symbolEnergyK(ch) = K * faces(ch)` ⇒ centers=1K, edges=2K, corners=3K, core=0.

- **Per‑face unit energy**:
  - `perFaceUnitEnergy(faces) = K / faces`.

---

## 4) Couplers (field strength)

- Formula (`coupler.dart`):
  
  \[
  C(v) = \tau_0 \cdot \frac{K}{\text{faces}(v)} \cdot \frac{1}{\big(L_1(v)\big)^{\alpha}}
  \]

  - `faces(v) ∈ {1,2,3}`, core excluded (returns 0).
  - `L1(v) ∈ {1,2,3}` for non‑core points.
  - `alpha` is the path‑loss exponent.

- Expected magnitudes (τ₀=1, α=1):
  - L=1 centers: `C = K = 10.125`
  - L=2 edges:  `C = (K/2) / 2 = 2.53125`
  - L=3 corners: `C = (K/3) / 3 = 1.125`

- Helpers: `rankTopCouplers`, `complexSumMagnitude` (phasor toy).

---

## 5) Potts‑Hopfield network

- `Potts27.cube()` builds 27 nodes with 6‑neighborhood (Manhattan‑1) adjacency.
- Build geometry‑aware weights: `buildFromCouplers(params, kernel, targetNorm, geoMix)`.
  - Kernel example: `cosKernel(k,l) = cos(2π(k−l)/27)`.
  - Weights are symmetrized and block‑normalized (L2) to `targetNorm`.
- Store patterns: `store(patterns, scale, targetNorm, blend)`.
- Bias: `setBias({nodeIndex: List<double>(q)})`.
- Dynamics: `stepOnce()` / `relax(maxIters=50)` picks the arg‑max field per node.

**Invariant tests** cover symmetry, distance monotonicity, and that geometry helps (or at least does not hurt) recall.

---

## 6) Moves & rotations

- Faces: `U,D,L,R,F,B`.
- A `FaceMove(face, quarterTurns)` with `±1,±2,±3`.
- `permutationFor(move)` returns length‑27 index mapping; `applyPerm` mutates symbols.
- `applyMoves(seq)` composes permutations in order.
- Rotations: RH rule helpers `rotateX/rotateY/rotateZ`, and `applyRotations`, `invertRotations`.

**Invariants**: energy sum (SE9) and class counts are preserved under any move sequence.

---

## 7) Hierarchical micro‑cube tree

- `CubePath` is a dotted base‑27 path like `"s.y.a"` → `[19,25,1]`.
- `MicroCube` holds 27 digits and an internal `Potts27` for local smoothing.
- `LivniumTree`:
  - `getOrCreate(path)`, `setSymbol(path, pos, digit)`, `getSymbol(path,pos)`.
  - `evolve(maxDepth, biasStrength, localIters)` does post‑order:
    1) recurse children,
    2) `pullFromChildren()` (majority vote into the parent slot),
    3) `stepLocal()` (Potts relax),
    4) `pushBiasToChildren(beta)` (parent slot biases child center).

---

## 8) Exposure mapping generator

- `generateExposureMapping(mode: 'conventional' | 'harmonic')`
  - Conventional: contiguous ranges (`a..f` centers, `g..r` edges, `s..z` corners).
  - Harmonic: interleaves classes using class steps derived from `K`.
- Every symbol maps to `(faces, side)`. The `CORE` is `'0'`.

---

## 9) Tests & how to run

- Run all tests:
  ```bash
  dart test
  ```
- Quick examples (all should assert/print cleanly):
  ```bash
  dart run example/encode_demo.dart
  dart run example/rotate_demo.dart
  dart run example/coupler_demo.dart
  dart run example/projection_demo.dart
  dart run example/arith_carry_demo.dart
  dart run example/recall_demo.dart
  dart run example/hierarchy_demo.dart
  ```

---

## 10) Known issues / TODOs

- **Hierarchy demo output in docs is stale.** The code & tests are correct; re‑run and refresh the captured output (the root’s `"s"` slot should match its child’s majority after two evolutions).
- **Examples duplicating helpers.** Prefer `grid.dart` over local copies to avoid drift.
- **Arithmetic polish.** Implement the “balanced final carry” cleanup noted in `arith27.dart`.
- **Doc clarity.** Keep “exposure == faces” explicit whenever used.

---

## 11) PR checklist (Codex)

- ✅ Preserve class counts (1,6,12,8) and energy invariants in any new transform.  
- ✅ Never invent a composite digit; `'a0'` is `[1,0]`.  
- ✅ Keep K as `81/8` (10.125) and document any place you change normalization.  
- ✅ Examples import the public API unless they intentionally test internals.  
- ✅ Add/adjust tests when changing coupler kernels, path‑loss, or tree evolution.

