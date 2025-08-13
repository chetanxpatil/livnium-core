# Livnium Core Overview

Livnium Core is a spatial operating system for symbolic computation and intentional geometry.  It represents information as a 3×3×3 lattice of symbols and provides a base‑27 number system with a central **Om (0)** symbol anchoring the structure.

## Repository Structure
- `lib/` – source code for the Livnium Core library.
- `example/` – example programs demonstrating library usage.
- `test/` – automated tests covering arithmetic, alphabet utilities, hierarchy trees, and Potts network models.
- `benchmark/` – performance benchmarks.
- `pubspec.yaml` – Dart package configuration.

## Key Features
- **27‑symbol alphabet**: supports encoding and decoding between strings, BigInts, and fixed representations.
- **Hierarchical trees**: `MicroCube` and `LivniumTree` manage nested cubes and bias propagation.
- **Potts networks**: models associative memory with optional geometric couplers.
- **Energy and rotation utilities**: compute symbol energies and rotate vectors in 3D space.

The accompanying test suite exercises these capabilities to ensure that encoding/decoding routines, arithmetic functions, hierarchical behaviors, and neural models operate as intended.
