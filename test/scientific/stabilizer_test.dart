import 'package:livnium_core/livnium_core.dart';
import 'package:test/test.dart';

/// Phase 4 (Soul / Stabilizer): the "Thinking Loop" — chain reaction propagation.
///
/// When A is poked, B moves (linked to A). The stabilizer then treats B's move
/// as a new event, so C moves (linked to B). The thought ripples until the wave
/// is done.

void main() {
  group('Phase 4: Stabilizer (Domino / Chain Reaction)', () {
    // Experiment: The Domino Effect
    // Setup: Entangle A ↔ B and B ↔ C.
    // Action: Rotate A (axis 0, direction 1).
    // Expected: A moves B (first hop), then B's move moves C (second hop).
    // Check: C has rotated (e.g. C holds the value from its rotation partner).
    test('Domino: A → B → C — poking A propagates to C', () {
      final mind = GrowthMind(3);

      final a = LatticeCoord(3, 0, 0, 0);
      final b = LatticeCoord(3, 1, 1, 1);
      final c = LatticeCoord(3, 2, 2, 2);

      mind.entangleConcepts(a, b, strength: 1.0);
      mind.entangleConcepts(b, c, strength: 1.0);

      // When the chain reaches C, C is anti-rotated: trigger is B with direction -1,
      // so C rotates by +1. applyRotationAt(C, axis, 1) swaps C with rotateQuarter(C, axis, 1),
      // so the value that ends up at C comes from rotateQuarter(C, axis, 1).
      const axis = 0;
      const direction = 1;
      final sourceForC = rotateQuarter(c, axis, 1);

      mind.state.getCellAt(c).swEffective = 123.0;
      mind.state.getCellAt(sourceForC).swEffective = 456.0;
      normalizeGlobalLedger(mind.state);
      final expectedCAfterSync = mind.state.getCellAt(sourceForC).swEffective;

      final result = mind.perceive(a, axis, direction);

      // Both hops should fire: A→B and B→C
      expect(result.syncsFired, equals(2),
          reason: 'Stabilizer must propagate through both pairs');
      expect(mind.state.getCellAt(c).swEffective,
          closeTo(expectedCAfterSync, 1e-9),
          reason: 'C must have moved (domino: A moved B, B moved C)');
      expect(mind.isSane, isTrue, reason: 'D2/D3 conservation must hold');
    });
  });
}
