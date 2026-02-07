# Phase 4: Stabilization (The Soul)

**Core:** `Stabilizer` (see `lib/src/stabilizer.dart`)

## Concept

Thinking is a **chain reaction**. When one cell is rotated (e.g. by perception or the concept encoder), its entangled partners must anti-rotate to conserve angular momentum. Those partners are then treated as new triggers: *their* partners may sync, and so on. The wavefront continues until no further syncs occur (or cycles are avoided via a visited set).

## Mechanism

- **Input:** A rotation event: coordinate + axis + direction, applied to the lattice.
- **Wave:** A queue of pending rotation events. For each event, every [BellPair](https://github.com/chetanxpatil/livnium-core) that contains that coordinate is considered; the partner may synchronise (anti-rotate) with probability given by the pair’s coupling strength.
- **Output:** The number of BellPair syncs that fired. The lattice state is updated in place.

The logic lives in **`Stabilizer.propagate()`**. [GrowthMind](https://github.com/chetanxpatil/livnium-core) applies the initial rotation at a coordinate, then calls the stabilizer so that the consequence ripples through the entanglement graph.

## Result

**Holographic recall:** Remove part of an image (e.g. one eye); encode the rest. The stabilizer propagates the activation through learned BellPairs so that the missing region is “filled in” by the crystal’s geometry—the thought completes itself.

## Verification

`test/scientific/stabilizer_test.dart` checks the domino: A↔B, B↔C; poking A causes B then C to move, with conservation preserved.
