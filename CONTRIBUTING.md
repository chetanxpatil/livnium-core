# Contributing to Livnium Core

Thank you for your interest in the Geometric Intelligence Engine. This document explains how to run the project locally, run tests, and submit changes.

## Prerequisites

- **Dart SDK 3.0+**  
  Install from [dart.dev](https://dart.dev/get-dart) or your package manager.  
  On macOS: `brew install dart`.  
  Verify: `dart --version`.

## Getting started

1. **Clone the repository**
   ```bash
   git clone https://github.com/chetanxpatil/livnium-core.git
   cd livnium-core
   ```

2. **Resolve dependencies**
   ```bash
   dart pub get
   ```

3. **Run tests**
   ```bash
   dart test
   ```
   All tests (including `test/scientific/`) should pass.

4. **Run the learned-brain example**
   ```bash
   dart run example/livnium_learned_brain.dart
   ```

## Code style and analysis

- **Format**
  ```bash
  dart format .
  ```

- **Analyze**
  ```bash
  dart analyze
  ```
  Fix any reported errors or warnings before submitting.

- **Lint**  
  The project uses `.analysis_options` for consistent rules. Keep new code aligned with existing style (e.g. use `ArgumentError` for invalid arguments where the codebase does).

## Submitting changes

1. Create a branch from `main` (or the current default branch).
2. Make your changes; ensure `dart test` and `dart analyze` pass.
3. Run `dart format .` and commit the result.
4. Open a **Pull Request** with a clear description of the change and, if relevant, how it fits the five-phase architecture (Physics, Cognition, Vision, Stabilization, Learning).

## Test layout

- **`test/scientific/`** — Rigorous verification of conservation, entanglement, stabilizer propagation, Hebbian learning, basin dynamics, pathfinding, and cheat prevention. These tests are the “spec” for the engine.
- **`test/`** — Path and other unit tests.

When adding features, please add or extend tests in the appropriate folder so that scientific invariants remain verified.

## Documentation

- **`doc/`** — Design notes for Phase 2 (Cognition) and Phase 5 (Learning).  
  When changing behavior in those areas, consider updating the relevant doc.
- **`README.md`** — High-level architecture and getting started.  
  Update the “Scientific Verification” section if you add or remove test files.

## Questions

Open an issue for bugs, design questions, or feature ideas. For the philosophy and architecture, see the README and the docs in `doc/`.
