import 'package:livnium_core/livnium_core.dart';
import 'package:test/test.dart';

/// Phase 5 (Learning): Hebbian self-wiring — the brain wires itself from co-occurrence.
///
/// We show many images where (1,1) and (3,1) are both on. The learner records
/// co-activation; applyTo creates a BellPair. Then one poke at (1,1) propagates to (3,1).
void main() {
  group('Phase 5: Hebbian Learner', () {
    test('Self-wiring: repeated co-activation creates entanglement', () {
      const n = 5;
      final mind = GrowthMind(n);
      final encoder = ConceptEncoder(mind);
      final learner = HebbianLearner(n, threshold: 2, strengthScale: 0.5);
      mind.learner = learner;

      final leftEye = LatticeCoord(n, 1, 1, 0);
      final rightEye = LatticeCoord(n, 3, 1, 0);

      // Show 10 "face" images: both eyes on
      for (var i = 0; i < 10; i++) {
        final image = List.generate(n, (_) => List.filled(n, 0.0));
        image[1][1] = 1.0;
        image[1][3] = 1.0;
        encoder.encodeImage(image);
      }

      // No hand-written entangleConcepts; apply learned pairs
      learner.applyTo((a, b, s) => mind.entangleConcepts(a, b, strength: s));

      // Instrument: when we poke (1,1), stabilizer syncs (3,1); (3,1) rotates by -1 on axis 2
      final partnerOfRight = rotateQuarter(rightEye, 2, -1);
      mind.state.getCellAt(rightEye).swEffective = 100.0;
      mind.state.getCellAt(partnerOfRight).swEffective = 200.0;
      normalizeGlobalLedger(mind.state);
      final expectedRight = mind.state.getCellAt(partnerOfRight).swEffective;

      mind.perceive(leftEye, 2, 1);

      expect(mind.state.getCellAt(rightEye).swEffective,
          closeTo(expectedRight, 1e-9),
          reason: 'Right Eye must move (learned pair)');
      expect(mind.isSane, isTrue);
    });

    test('Below threshold: no pair created', () {
      const n = 5;
      final mind = GrowthMind(n);
      final encoder = ConceptEncoder(mind);
      final learner = HebbianLearner(n, threshold: 100, strengthScale: 0.1);
      mind.learner = learner;

      final image = List.generate(n, (_) => List.filled(n, 0.0));
      image[1][1] = 1.0;
      image[1][3] = 1.0;
      encoder.encodeImage(image); // once: count (1,1)-(3,1) = 1

      learner.applyTo((a, b, s) => mind.entangleConcepts(a, b, strength: s));

      final rightEye = LatticeCoord(n, 3, 1, 0);
      final before = mind.state.getCellAt(rightEye).swEffective;
      mind.perceive(LatticeCoord(n, 1, 1, 0), 2, 1);
      final after = mind.state.getCellAt(rightEye).swEffective;

      expect(after, equals(before),
          reason: 'No pair above threshold so Right Eye unchanged');
    });
  });
}
