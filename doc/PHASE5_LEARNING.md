# Phase 5: The Self-Learning Brain (Hebbian Loop)

## Goal

Today **you** wire the brain: `entangleConcepts(LeftEye, RightEye)`.  
In Phase 5 the **machine** wires itself: it observes which cells "fire together" and creates `BellPair`s when that correlation is strong enough.

**Finish line:** A Livnium Core that can learn associations from data (e.g. images) without hand-written entanglement.

---

## Two Hebbian Variants

**Hebb’s rule:** *“Neurons that fire together wire together.”*  
In Livnium: **coordinates that participate in the same “thought” get linked.**

### Variant A: Co-activation in the same **thought** (wave)

- **When:** After each `perceive(coord, …)`, the stabilizer wave touches a set of cells (the initial coord + every partner that synced).
- **Rule:** For every pair `(A, B)` that appeared as **trigger → partner** in the same wave, record “A and B fired together.”
- **Learning:** Accumulate these (A,B) counts; when count(A,B) (or symmetric) exceeds a threshold, ensure `BellPair(A, B)` exists (create or strengthen).
- **Pros:** Uses the actual propagation (thought structure); reinforces links that the physics already “wants.”
- **Cons:** Requires the stabilizer to report which (trigger, partner) pairs fired (or to call a learner callback).

### Variant B: Co-activation in the same **image** (input)

- **When:** In `encodeImage`, we call `perceive(coord, 2, 1)` for every pixel above threshold. So the set of coords stimulated in one image is known.
- **Rule:** For every pair (A, B) in that set, record “A and B were stimulated together in this image.”
- **Learning:** Same: when correlation(A,B) > threshold, create or strengthen `BellPair(A, B)`.
- **Pros:** Very simple; no change to stabilizer; encoder already has the set of “active” coords per image.
- **Cons:** Links “same image” rather than “same thought”; still meaningful for vision (repeated patterns → entanglement).

**Recommendation:** Start with **Variant B** (same-image co-occurrence) to get a working self-wiring loop with minimal changes. Add **Variant A** (same-wave) later so the brain can also learn from internal propagation.

---

## Design (Variant B)

### 1. `HebbianLearner` (new)

- **State:** A map or matrix of (coord, coord) → correlation count (or strength).
- **Input:** `recordCoactivation(Iterable<LatticeCoord> coords)` — for each unordered pair {A,B} in coords, increment correlation(A,B). (Normalize by image count or decay over time if desired.)
- **Output:** `applyTo(GrowthMind mind)` or callback: for each pair with correlation above threshold, call `mind.entangleConcepts(A, B, strength: min(1.0, f(correlation)))`. Use a threshold to avoid creating millions of weak pairs.
- **Optional:** Decay old counts so recent images matter more (sliding window or exponential decay).

### 2. `ConceptEncoder` change

- **Option (a):** Encoder collects the list of coords that were perceived in this image, then calls `mind.recordCoactivation(coords)` (encoder must have access to a learner).
- **Option (b):** Encoder returns the set of coords it stimulated; caller (e.g. demo script) calls `learner.recordCoactivation(coords)` then `learner.applyTo(mind)`. Keeps encoder dumb, learning explicit in the loop.

Prefer **Option (a)** with encoder taking an optional learner so the “one shot” flow is: `encoder.encodeImage(image);` (which both perceives and records coactivation), then periodically or at the end `learner.applyTo(mind)`.

### 3. `GrowthMind` change

- Add optional `HebbianLearner? learner` (or setter).
- Add `void recordCoactivation(Iterable<LatticeCoord> coords)` that forwards to `learner?.recordCoactivation(coords)`.
- No change to `_stabilize` for Variant B.

### 4. API sketch

```dart
// Learning
final learner = HebbianLearner(threshold: 3, strengthScale: 0.2);
mind.learner = learner;

// Training: show many images
for (final image in trainingImages) {
  encoder.encodeImage(image);  // perceives + records coactivation
}
learner.applyTo(mind);  // create/strengthen BellPairs above threshold

// Now mind has learned links; no hand-written entangleConcepts needed for those pairs.
```

### 5. Variant A (later)

- In `_stabilize`, for each sync (event.coord → partner), call `learner?.recordSync(event.coord, partner)`.
- `HebbianLearner.recordSync(A, B)` increments correlation(A,B).
- Same `applyTo(mind)` to create/strengthen pairs. Optionally combine with Variant B (same-image + same-wave both feed the same correlation map).

---

## Success Criteria for Phase 5

1. **No hand-written entanglement for a demo:** e.g. show 50–100 images where (1,1) and (3,1) are often both on; run learner; then a single image with only (1,1) on should still make (3,1) react (stabilizer propagates through the learned pair).
2. **Conservation preserved:** `mind.isSane` remains true after learning and after perception.
3. **Threshold and strength are tunable** so we can avoid over-wiring (too many pairs) and control strength (e.g. 0.5 for fuzzy, 1.0 for deterministic).

---

## Files to Add/Change

| File | Change |
|------|--------|
| `lib/src/hebbian_learner.dart` | **New.** HebbianLearner class: recordCoactivation, recordSync (for A), applyTo(mind), threshold, strengthScale. |
| `lib/src/growth_mind.dart` | Optional learner; `recordCoactivation(Iterable<LatticeCoord>)`. |
| `lib/src/concept_encoder.dart` | Collect coords per image; call `mind.recordCoactivation(coords)` after encodeImage (if learner attached). |
| `lib/livnium_core.dart` | Export hebbian_learner.dart. |
| `test/scientific/hebbian_test.dart` | **New.** e.g. Feed N images with (1,1)+(3,1) on; applyTo; assert pair exists and strength ≥ X; perceive(1,1) and assert (3,1) moved. |
| `example/livnium_brain.dart` or new script | Demo: train on synthetic “face” images, then run broken-face without manual entangleConcepts. |

---

## Time Estimate

- **Variant B only:** One focused session (learner class, encoder + mind wiring, one test, one demo).
- **Variant A on top:** Extra half-session (recordSync in _stabilize, tests for wave-based learning).

Once Phase 5 is done, Livnium Core has a complete loop: **Physics → Cognition → Vision → Soul → Learning**, and can be called a self-learning geometric AI engine.
