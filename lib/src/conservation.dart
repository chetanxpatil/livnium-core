import 'lattice.dart';
import 'derived.dart';

/// D3: Conservation Ledger — audit and normalization.

/// Audit: total effective weight must match D2; class counts must match D1.
bool auditConservation(LatticeState state, {double tolerance = 1e-10}) {
  final target = totalEnergySymbolic(state.n);
  final actual = state.totalEffectiveWeight;
  if ((actual - target).abs() > tolerance) return false;
  final counts = state.classCounts;
  if (counts[0] != coreCount(state.n)) return false;
  if (counts[1] != centerCount(state.n)) return false;
  if (counts[2] != edgeCount(state.n)) return false;
  if (counts[3] != cornerCount(state.n)) return false;
  return true;
}

/// Thermodynamic Policy: Minimum Mass Law.
/// No symbol drops below [fraction] of its base weight — prevents "Vampire Effect" (mode collapse).
void enforceMinimumMass(LatticeState state, {double fraction = 0.10}) {
  for (final cell in state.cells) {
    final floor = fraction * cell.swBase;
    if (cell.swEffective < floor) cell.swEffective = floor;
  }
}

/// Enforce global renormalization so sum of effective weights = 9*N^2 (D2).
void normalizeGlobalLedger(LatticeState state) {
  final target = totalEnergySymbolic(state.n);
  final current = state.totalEffectiveWeight;
  if (current <= 0) return;
  final scale = target / current;
  for (final cell in state.cells) {
    cell.swEffective *= scale;
  }
}

/// Local smoothness: optional local equilibrium step (e.g. Laplacian smoothing on effective weights).
/// Default: no-op; can be overridden for "smooth geometry" after reinforcement.
void enforceLocalSmoothness(LatticeState state) {
  // Placeholder: could average sw_effective with neighbors.
  // For strict D3 we must not change total; so any smoothing must be conservative.
}
