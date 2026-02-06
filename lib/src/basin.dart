import 'dart:math';
import 'lattice.dart';
import 'derived.dart';
import 'conservation.dart';

/// D4: Basin Engineering Dynamics. Tunable physics constants and thermodynamic policies.
class BasinConstants {
  final double alphaReinforce;
  final double betaDecay;
  final double noiseTemp;

  /// Minimum Mass Law: no cell below this fraction of base weight (Vampire fix).
  final double minimumMassFraction;

  /// Use antipodal permutation instead of random noise when wrong (Entropy Death fix).
  final bool useAntipodalNoise;

  const BasinConstants({
    this.alphaReinforce = 0.05,
    this.betaDecay = 0.10,
    this.noiseTemp = 0.02,
    this.minimumMassFraction = 0.10,
    this.useAntipodalNoise = true,
  });
}

/// Injects geometric noise on coordinate projections (entropy for wrong states).
void injectGeometricNoise(LatticeState state, {required double magnitude}) {
  final r = Random();
  for (final cell in state.cells) {
    if (!cell.active) continue;
    final delta = (r.nextDouble() - 0.5) * 2 * magnitude * cell.swBase;
    cell.swEffective += delta;
  }
}

/// Antipodal Noise: permute weights by inversion through center. Pushes *away* from error (Entropy Death fix).
void applyAntipodalNoise(LatticeState state) {
  final n = state.n;
  final snapshot = state.cells.map((c) => c.swEffective).toList();
  for (var i = 0; i < state.cells.length; i++) {
    final c = state.cells[i].coord;
    final ax = n - 1 - c.x, ay = n - 1 - c.y, az = n - 1 - c.z;
    final j = state.cells.indexWhere((cell) =>
        cell.coord.x == ax && cell.coord.y == ay && cell.coord.z == az);
    state.cells[i].swEffective = snapshot[j];
  }
}

/// Implements D4: Geometric Basin Shaping. Shapes energy landscape so correct paths
/// are downhill and incorrect paths unstable. Always renormalizes to satisfy D3.
/// Applies thermodynamic policies: Minimum Mass (Vampire fix), Antipodal Noise when wrong (Entropy Death fix).
void updateBasinGeometry(
  LatticeState state,
  bool isCorrect, {
  BasinConstants constants = const BasinConstants(),
}) {
  final active = state.active_cells;

  if (isCorrect) {
    for (final cell in active) {
      cell.swEffective += constants.alphaReinforce;
      cell.stabilityIndex += 1;
    }
    enforceLocalSmoothness(state);
  } else {
    for (final cell in active) {
      cell.swEffective *= (1.0 - constants.betaDecay);
      cell.stabilityIndex = (cell.stabilityIndex - 1).clamp(0, 1 << 30);
    }
    if (constants.useAntipodalNoise) {
      applyAntipodalNoise(state);
    } else {
      injectGeometricNoise(state, magnitude: constants.noiseTemp);
    }
  }

  if (constants.minimumMassFraction > 0) {
    enforceMinimumMass(state, fraction: constants.minimumMassFraction);
  }
  normalizeGlobalLedger(state);
}
