# Livnium Core: The Geometric Intelligence Engine

> **"What is the shape of a thought?"**

Livnium is a **Geometric Artificial Intelligence**. Unlike standard AI, which relies on statistical probability (matrices and weights), Livnium relies on **Physics and Geometry**.

It models intelligence as a **Crystal Lattice** that relaxes to its lowest energy state. It does not "guess" the answer; it physically stabilizes into the answer.

---

## 🏗 Architecture: The 5 Phases

Livnium is built on five pillars, moving from strict physical laws to high-level autonomous thought.

### Phase 1: The Physics (Conservation)
**Core:** `LatticeState`
* **Concept:** The universe is a 3D grid of spinning cells.
* **Law:** **Conservation of Energy (D² Metric).** You cannot create or destroy data; you can only move it.
* **Mechanism:** Every rotation must be balanced by a counter-rotation (Parity). This prevents the AI from "hallucinating" wildly—it must obey the laws of physics.

### Phase 2: Cognition (Entanglement)
**Core:** `BellPair` & `GrowthMind`
* **Concept:** Thoughts are connections between distant points.
* **Mechanism:** **Quantum Entanglement.** If Cell A is linked to Cell B, rotating A forces B to rotate instantly to conserve angular momentum.
* **Result:** **Instant Context.** The brain knows "Left Eye implies Right Eye" without searching.

### Phase 3: Vision (The Encoder)
**Core:** `ConceptEncoder`
* **Concept:** The "Eye" of the system.
* **Mechanism:** Maps 2D pixel data (images) onto the surface (Z=0 face) of the 3D lattice.
* **Result:** High-intensity pixels become physical rotations in the crystal structure.

### Phase 4: The Soul (Stabilization)
**Core:** `Stabilizer` (see `lib/src/stabilizer.dart` and `doc/PHASE4_STABILIZATION.md`)
* **Concept:** Thinking is a chain reaction.
* **Mechanism:** A geometric wavefront. If A moves B, and B is linked to C, the stabilizer propagates the energy until the entire thought is formed.
* **Result:** **Holographic Recall.** You can remove 50% of an image, and the crystal will physically reconstruct the missing half to satisfy its internal geometry.

### Phase 5: Life (Hebbian Learning)
**Core:** `HebbianLearner`
* **Concept:** The brain wires itself.
* **Mechanism:** **"Cells that fire together, wire together."**
* **Result:** **Autonomous Learning.** You do not program rules. You show the brain images, and it automatically discovers the geometric relationships (BellPairs) to optimize its energy flow.

---

## 🚀 Getting Started

### 1. Installation
Add `livnium_core` to your Dart project (or clone this repo and depend on the path).

### 2. The "Hello World" of Geometric AI
This script creates a brain, teaches it what a "Face" looks like by showing it examples, and then asks it to repair a broken image.

```dart
import 'package:livnium_core/livnium_core.dart';

void main() {
  final n = 5;
  final mind = GrowthMind(n);
  final encoder = ConceptEncoder(mind);
  final learner = HebbianLearner(n, threshold: 3, strengthScale: 0.2);
  mind.learner = learner;

  // Train: show images where Left Eye (1,1) and Right Eye (3,1) appear together
  for (var i = 0; i < 30; i++) {
    final image = List.generate(n, (_) => List.filled(n, 0.0));
    image[1][1] = 1.0;
    image[1][3] = 1.0;
    encoder.encodeImage(image);
  }

  // Consolidate: learner creates BellPairs for statistically significant patterns
  learner.applyTo((a, b, s) => mind.entangleConcepts(a, b, strength: s));

  // Test: show an image with ONLY the Left Eye (broken face)
  final brokenFace = List.generate(n, (_) => List.filled(n, 0.0));
  brokenFace[1][1] = 1.0;
  encoder.encodeImage(brokenFace);

  // The stabilizer runs; the Right Eye (3,1) materializes. Physics has healed the data.
}
```

Run the full demo: `dart run example/livnium_learned_brain.dart`

### 3. Interactive Vision Server
```bash
dart run example/livnium_server.dart
```
Open the printed URL. Click the cyan cell (Left Eye); the magenta cell (Right Eye) reacts.

---

## 🧪 Scientific Verification

Livnium is not a black box. It is verified by rigorous scientific tests in `test/scientific/`:

* **`bell_pair_test.dart`** — Non-local interaction (Spooky Action) and energy conservation.
* **`growth_mind_test.dart`** — Holographic memory recall and probabilistic coupling.
* **`stabilizer_test.dart`** — Phase 4 recursive thought propagation (Domino A→B→C).
* **`hebbian_test.dart`** — Autonomous self-wiring and threshold (no hallucination from noise).
* **`basin_dynamics_test.dart`** — Basin reinforcement/decay and minimum mass.
* **`conservation_ledger_test.dart`** — Ledger audit and renormalisation.
* **`cheat_prevention_test.dart`** — Safeguards against manual weight tampering.
* **`concept_encoder_test.dart`** — Image-to-lattice encoding.
* **`rotation_conservation_test.dart`**, **`axiom_invariants_test.dart`**, **`derived_laws_test.dart`** — Physics and invariants.
* **`path_flow` / `path_collapse`** — Pathfinding behaviour covered by tests in `test/`.

Run all: `dart test`

---

## 🔮 The Philosophy

> "Statistics is the science of guessing. Geometry is the science of being."

Standard AI minimizes **Error**. Livnium minimizes **Energy**.
By forcing Intelligence to obey Physics, we create a system that is transparent, efficient, and grounded in reality.

---

*Built by The Architect.*  
*Verified 2026.*
