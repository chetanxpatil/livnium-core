import 'package:livnium_core/livnium_core.dart';

/// Phase 5 demo: the brain wires itself. No hand-written entangleConcepts.
///
/// 1. Create mind + encoder + learner.
/// 2. Show many "face" images (Left Eye + Right Eye on).
/// 3. applyTo(mind) creates the BellPair from co-occurrence.
/// 4. Show broken face (only Left Eye). Right Eye still materializes.
void main() {
  print('=== LIVNIUM LEARNED BRAIN (Phase 5) ===\n');

  const n = 5;
  final mind = GrowthMind(n);
  final encoder = ConceptEncoder(mind);
  final learner = HebbianLearner(n, threshold: 3, strengthScale: 0.2);
  mind.learner = learner;

  final leftEye = LatticeCoord(n, 1, 1, 0);
  final rightEye = LatticeCoord(n, 3, 1, 0);

  print('1. Training: 30 images with both eyes on...');
  for (var i = 0; i < 30; i++) {
    final image = List.generate(n, (_) => List.filled(n, 0.0));
    image[1][1] = 1.0;
    image[1][3] = 1.0;
    encoder.encodeImage(image);
  }

  print('2. Applying Hebbian learning (no manual entangleConcepts)...');
  learner.applyTo((a, b, s) => mind.entangleConcepts(a, b, strength: s));

  print('3. Broken face: only Left Eye in input.');
  final partnerOfRight = rotateQuarter(rightEye, 2, -1);
  mind.state.getCellAt(rightEye).swEffective = 100.0;
  mind.state.getCellAt(partnerOfRight).swEffective = 200.0;
  normalizeGlobalLedger(mind.state);
  final expectedRight = mind.state.getCellAt(partnerOfRight).swEffective;

  final brokenFace = List.generate(n, (_) => List.filled(n, 0.0));
  brokenFace[1][1] = 1.0;
  encoder.encodeImage(brokenFace);

  final actualRight = mind.state.getCellAt(rightEye).swEffective;
  final ok = (actualRight - expectedRight).abs() < 1e-9;

  print(
      '   Right Eye after recall: ${actualRight.toStringAsFixed(4)} (expected ${expectedRight.toStringAsFixed(4)})');
  print(ok
      ? '\nSUCCESS: Self-wired brain recalled the Right Eye.'
      : '\nFAIL: Recall failed.');
  print('   Physics: ${mind.isSane ? "STABLE" : "VIOLATED"}');
}
