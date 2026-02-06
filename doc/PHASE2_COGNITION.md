# Phase 2: Cognition — Narrative and Design

This document explains **why** the Phase 2 (GrowthMind / BellPair strength) design is correct and testable, and **why** the first probabilistic test showed `0/100` (and how we fixed it).

---

## 1) The lattice is "physics"

`LatticeState` is a closed system:

* `applyRotationAt(coord, axis, turns)` is a **permutation** of content.
* Because it's a permutation, it preserves the total "mass/energy" (the D2 ledger).
* `auditConservation(state)` is the lab instrument that confirms "no energy leaked."

**Phase 1 = deterministic geometry with conservation.**

---

## 2) BellPair is a non-local constraint

`BellPair(A, B)` adds a rule:

> If A rotates, B must rotate in the opposite direction on the same axis.

So when you rotate A by `+1`, BellPair forces B to rotate by `-1`.

This keeps D2 happy because it's still just structured permutations—zero-sum "spin."

---

## 3) Strength turns coupling into probability

Coupling was extended:

* `strength = 1.0` → always synchronize
* `strength = 0.0` → never synchronize
* `0 < strength < 1` → synchronize with probability `strength`

So "association" is fuzzy:

* deterministic link (1.0)
* no link (0.0)
* probabilistic link (e.g. 0.5)

That's the cognition layer: **association as probabilistic constraint propagation**.

---

## 4) Why the first probabilistic test showed `0/100`

The original "reaction detector" was:

> "Did B's `swEffective` change?"

But BellPair does a **swap** (via rotation partner). If B and its rotation-partner have the **same value** (common in symmetric initialization / same structural class), a swap happens but the value doesn't change.

So:

* sync was firing,
* but the measurement couldn't see it,
* so the test reported 0 reactions.

The system wasn't broken—**the sensor was.**

Classic lab mistake: measuring the wrong observable.

---

## 5) Instrumentation fixed the sensor

We forced asymmetry with **sentinels**:

* set `B = 123`, partner = `456`
* normalize ledger (so conservation still holds)
* store `expectedIfSync = partnerValueAfterNormalization`

Now a sync is **observable**:

> reaction = "B became the partner value"

So we measure the event itself, not "did it look different."

That is why we now get ~50% reactions at strength 0.5.

---

## 6) `synchronize()` returning `bool` makes it science-grade

The coupling operator was upgraded to return ground truth:

* `true` = sync applied
* `false` = sync didn't apply (gate/trigger mismatch / probabilistic skip / no-op direction / invalid axis)

We can count sync events without peeking into floating-point values.

We also **cross-check** the two measurement methods:

* sentinel-based observation
* boolean return from `synchronize` / `PerceiveResult.syncsFired`

If those disagree, the test harness is wrong.

---

## 7) Guardrails stop fake "syncs"

Contract checks were added:

* axis must be 0..2
* direction normalized mod 4
* direction == 0 ⇒ no-op, returns false

This prevents "sync fired" from reporting true when nothing actually happened.

---

## 8) GrowthMind's `perceive()` is the cognition step

`GrowthMind.perceive(coord, axis, dir)`:

1. Rotates the triggered concept locally (physics)
2. Applies all entanglements that include that coord (cognition)
3. Returns `PerceiveResult(syncsFired, syncsPossible)`

So the brain step is:

> local stimulation + probabilistic constraint propagation, still D2/D3 safe

---

## 9) Why `99/200` is exactly what we wanted

With strength = 0.5 and 200 trials:

* expected mean ≈ 100
* we saw 99 (≈49.5%)

That's the correct behavior. If it was 0 or 200, probability wasn't being applied.

---

## One-liner summary

We built a conserved permutation physics system, added a non-local anti-rotation constraint (BellPair), made coupling probabilistic via strength, and fixed the experiment by instrumenting the observable and counting sync events directly via a boolean return + PerceiveResult.

---

*See also: `test/scientific/growth_mind_test.dart`, `lib/src/growth_mind.dart`, `lib/src/bell_pair.dart`.*
