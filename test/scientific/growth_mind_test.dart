import 'dart:math';

import 'package:livnium_core/livnium_core.dart';
import 'package:test/test.dart';

/// Phase 2 (Cognition) scientific tests: holographic recall, energy isolation,
/// and probabilistic thought.
///
/// Validates that the system moves beyond "Calculating" (Physics) to "Associating"
/// (Cognition): e.g. "Left Eye" implies "Right Eye" via entanglement.

bool _almostEq(double a, double b, [double eps = 1e-9]) => (a - b).abs() < eps;

void main() {
  group('Phase 2: GrowthMind Cortex', () {
    // Experiment 1: The Broken Face (Holographic Recall)
    // Hypothesis: Entanglement (Strength 1.0) creates an unbreakable geometric constraint.
    // Moving one part of the concept MUST move the other instantly.
    // Use center (1,1,1) and (2,2,2); anti-rotation of (2,2,2) on axis 0 hits (2,1,2) (different weight class).
    test('The Broken Face: EyeLeft forces EyeRight to appear', () {
      final mind = GrowthMind(3);

      final eyeLeftLoc = LatticeCoord(3, 1, 1, 1);
      final eyeRightLoc = LatticeCoord(3, 2, 2, 2);

      mind.entangleConcepts(eyeLeftLoc, eyeRightLoc, strength: 1.0);

      final valueAtPartner =
          mind.state.getCellAt(rotateQuarter(eyeRightLoc, 0, -1)).swEffective;

      mind.perceive(eyeLeftLoc, 0, 1);

      expect(mind.state.getCellAt(eyeRightLoc).swEffective,
          closeTo(valueAtPartner, 1e-9),
          reason:
              "Right Eye must anti-sync: it gets the value from its rotation partner");

      expect(mind.isSane, isTrue, reason: 'Brain must conserve energy (D2/D3)');
    });

    // Experiment 2: The Ghost Connection (Isolation)
    // Hypothesis: Strength 0.0 means the concepts are unrelated.
    test('Weak Coupling: 0.0 strength causes no reaction', () {
      final mind = GrowthMind(3);
      final locA = LatticeCoord(3, 0, 0, 0);
      final locB = LatticeCoord(3, 2, 2, 2);

      // Create a "Ghost" connection (Strength 0)
      mind.entangleConcepts(locA, locB, strength: 0.0);

      final cellB = mind.state.getCellAt(locB);
      final valBefore = cellB.swEffective;

      // Stimulate A
      mind.perceive(locA, 0, 1);

      // B should ignore it
      expect(mind.state.getCellAt(locB).swEffective, equals(valBefore),
          reason: 'Zero strength should mean zero interaction');
      expect(mind.isSane, isTrue);
    });

    // Experiment 3: Probabilistic Thought (Fuzzy Logic)
    // Hypothesis: Strength 0.5 results in statistical (~50%) sync when random is used.
    // Reaction = "B became the partner value" (anti-sync happened), not "value changed".
    // We instrument with sentinels (123, 456) so swap is visible even when classes match.
    test('Probabilistic Coupling: 0.5 strength produces some sync events', () {
      int reactionsBySentinel = 0;
      int syncsFiredByReturn = 0;
      const trials = 200;

      final locA = LatticeCoord(3, 0, 0, 0);
      final locB = LatticeCoord(3, 2, 2, 2);
      final random = Random(42);

      for (int i = 0; i < trials; i++) {
        final mind = GrowthMind(3);
        mind.entangleConcepts(locA, locB, strength: 0.5);

        final partner = rotateQuarter(locB, 0, -1);

        mind.state.getCellAt(locB).swEffective = 123.0;
        mind.state.getCellAt(partner).swEffective = 456.0;
        normalizeGlobalLedger(mind.state);
        final expectedIfSync = mind.state.getCellAt(partner).swEffective;

        final result = mind.perceive(locA, 0, 1, random: random);
        syncsFiredByReturn += result.syncsFired;

        final after = mind.state.getCellAt(locB).swEffective;
        if (_almostEq(after, expectedIfSync)) reactionsBySentinel++;

        expect(mind.isSane, isTrue);
      }

      expect(syncsFiredByReturn, reactionsBySentinel,
          reason:
              'synchronize() return count must match sentinel-observed syncs');
      print('Probabilistic Test: $reactionsBySentinel/$trials sync events');
      expect(reactionsBySentinel, greaterThan(0));
      expect(reactionsBySentinel, lessThan(trials));
      expect(reactionsBySentinel, inInclusiveRange(40, 160),
          reason: '200 trials at p≈0.5 should land in [40, 160]');
    });

    test('synchronize() bool matches sentinel observation (one trial)', () {
      final state = LatticeState(3);
      final locA = LatticeCoord(3, 0, 0, 0);
      final locB = LatticeCoord(3, 2, 2, 2);
      final partner = rotateQuarter(locB, 0, -1);
      state.getCellAt(locB).swEffective = 123.0;
      state.getCellAt(partner).swEffective = 456.0;
      normalizeGlobalLedger(state);
      final expectedIfSync = state.getCellAt(partner).swEffective;

      state.applyRotationAt(locA, 0, 1);
      final fired = BellPair(locA, locB, couplingStrength: 0.5)
          .synchronize(state, locA, 0, 1, random: _ZeroRandom());

      final after = state.getCellAt(locB).swEffective;
      final sentinelObserved = _almostEq(after, expectedIfSync);
      expect(fired, equals(sentinelObserved),
          reason: 'synchronize() return must match ground-truth sentinel');
    });

    test(
        'Probabilistic: 0.5 with _ZeroRandom fires sync (B gets partner value)',
        () {
      final state = LatticeState(3);
      final locA = LatticeCoord(3, 0, 0, 0);
      final locB = LatticeCoord(3, 2, 2, 2);
      final pair = BellPair(locA, locB, couplingStrength: 0.5);
      final valAtPartner =
          state.getCellAt(rotateQuarter(locB, 0, -1)).swEffective;
      state.applyRotationAt(locA, 0, 1);
      pair.synchronize(state, locA, 0, 1, random: _ZeroRandom());
      expect(state.getCellAt(locB).swEffective, closeTo(valAtPartner, 1e-9));
    });

    test('Strength 1.0: sync copies partner value to B', () {
      final state = LatticeState(3);
      final locA = LatticeCoord(3, 0, 0, 0);
      final locB = LatticeCoord(3, 2, 2, 2);
      final pair = BellPair(locA, locB, couplingStrength: 1.0);
      final valAtPartner =
          state.getCellAt(rotateQuarter(locB, 0, -1)).swEffective;
      state.applyRotationAt(locA, 0, 1);
      pair.synchronize(state, locA, 0, 1);
      expect(state.getCellAt(locB).swEffective, closeTo(valAtPartner, 1e-9));
    });

    test('direction == 0 (mod 4): synchronize returns false (no-op)', () {
      final state = LatticeState(3);
      final a = LatticeCoord(3, 0, 0, 0);
      final b = LatticeCoord(3, 2, 2, 2);
      expect(BellPair(a, b).synchronize(state, a, 0, 0), isFalse);
      expect(BellPair(a, b).synchronize(state, a, 1, 4), isFalse);
    });
  });
}

/// Always returns 0.0 so strength 0.5 always fires sync.
class _ZeroRandom implements Random {
  @override
  double nextDouble() => 0.0;
  @override
  int nextInt(int max) => 0;
  @override
  bool nextBool() => false;
}
