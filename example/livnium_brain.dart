import 'package:livnium_core/livnium_core.dart';

/// Grand Finale: The Living Crystal Brain.
///
/// Full pipeline: Physics → Cognition → Vision → Stabilization.
/// We entangle Left Eye ↔ Right Eye, show only the Left Eye, and watch
/// the Right Eye physically materialize (holographic recall).
void main() {
  print('=== THE LIVNIUM CRYSTAL BRAIN ===\n');

  // 1. INITIALIZE: Create a 5x5x5 Lattice (The Physics Engine)
  final n = 5;
  final mind = GrowthMind(n);
  final encoder = ConceptEncoder(mind);

  print('1. Physics Engine Online (N=$n)');
  print(
      '   Total Energy: ${mind.state.totalEffectiveWeight.toStringAsFixed(2)}');

  // 2. LEARN: Define the Concept "Face" (The Wiring)
  final leftEyeCoord = LatticeCoord(n, 1, 1, 0);
  final rightEyeCoord = LatticeCoord(n, 3, 1, 0);

  mind.entangleConcepts(leftEyeCoord, rightEyeCoord, strength: 1.0);
  print('2. Concept Learned: \'Face\' (Left Eye <-> Right Eye Entangled)');

  // 3. BLINDFOLD: Input image with only the Left Eye (Right Eye missing)
  final inputImage = List.generate(n, (_) => List.filled(n, 0.0));
  inputImage[1][1] = 1.0; // Left Eye
  inputImage[1][3] = 0.0; // Right Eye missing

  print('3. Input Prepared: \'Broken Face\' (Right Eye Missing)');

  // Instrument Right Eye: when stabilizer syncs, it will swap Right Eye with its
  // rotation partner (axis 2, -1). Set partner to a distinct value so recall is visible.
  const axisZ = 2;
  final partnerOfRightEye = rotateQuarter(rightEyeCoord, axisZ, -1);
  mind.state.getCellAt(rightEyeCoord).swEffective = 100.0;
  mind.state.getCellAt(partnerOfRightEye).swEffective = 200.0;
  normalizeGlobalLedger(mind.state);

  final cellRight = mind.state.getCellAt(rightEyeCoord);
  final valBefore = cellRight.swEffective;
  final expectedAfterRecall =
      mind.state.getCellAt(partnerOfRightEye).swEffective;
  print(
      '   Right Eye State (Before): ${valBefore.toStringAsFixed(4)} (Dormant)');

  // 4. SEE & THINK: Encode image → encoder rotates Left Eye → stabilizer ripples to Right Eye
  print('4. Processing...');
  encoder.encodeImage(inputImage);

  final valAfter = cellRight.swEffective;
  print('   Right Eye State (After):  ${valAfter.toStringAsFixed(4)} (Active)');

  if ((valAfter - expectedAfterRecall).abs() < 1e-9) {
    print('\nSUCCESS: Holographic Recall Achieved!');
    print(
        'The Brain physically Hallucinated the Right Eye to match the concept.');
  } else {
    print('\nFAILURE: The Brain remained blind.');
  }

  if (mind.isSane) {
    print('6. Physics Laws Preserved (Energy Conserved).');
  } else {
    print('CRITICAL FAILURE: Energy Conservation Violated!');
  }
}
