# Changelog
All notable changes to this project will be documented in this file.

## 1.3.0
### Added
- **Arithmetic (base-27)**
    - `add27Cyclic(a,b)` — per-digit mod-27, no-carry addition (phase/rotation math).
    - `add27CarrySave3(a,b,c)` + `csFinish(sum,carry)` — carry-save addition for 3 operands; finalize once at the end.
    - Property tests and demos (`example/arith_carry_demo.dart`) showing reduced carry count and ripple.
- **Configurable core “tunnel” bit**
    - `CoreBit` programmable cell with center bias (`configureCenter(digit,beta)`) and Potts relaxation.
    - Demo: `example/corebit_demo.dart`.
- **Hierarchy**
    - `MicroCube`, `LivniumTree`, `CubePath` (27-ary tree); child pooling, parent→child bias flow, and `evolve(...)`.
    - Demo + tests: `example/hierarchy_demo.dart`, `test/hierarchy_test.dart`.
- **Geometry & projections**
    - New public helpers: `dropAxis`, `radialBins`, `coarseGrain` (`lib/src/projection.dart`), exported via `livnium_core.dart`.
    - Exposure mapping generator with two modes: `conventional` and `harmonic` (`lib/src/generate_mapping.dart`).
    - Demos: `example/projection_demo.dart`, `example/exposure_demo.dart`, `example/grouping_test.dart`.
- **Examples & tests**
    - Interference/coupler demos (`example/coupler_demo.dart`, `example/interference_demo.dart`, `example/tunnel_demo.dart`).
    - Potts + couplers tests (`test/potts_coupler_test.dart`, `test/coupler_values_test.dart`).
    - Codec/energy/arith tests and quick-start usage (`test/core_usage_test.dart`, `test/arith27_test.dart`, etc.).

### Changed
- Public exports updated in `lib/livnium_core.dart` to surface new modules (`projection.dart`, `generate_mapping.dart`).

### Notes
- No breaking API removals; additions are backward-compatible.

---

## 1.2.0
- Add 2×2 seed tier and scale ladder foundations.
- Harden canonical radix-27 number system with tail-sentinel BigInt encoding.
- Clarify energy model and introduce coupler field utilities.

## 1.0.0
- Initial version.
