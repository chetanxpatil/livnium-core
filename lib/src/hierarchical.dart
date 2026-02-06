import 'coordinates.dart';
import 'lattice.dart';
import 'derived.dart';

/// H1: Recursive Structure. Level 0 = macro (N³), Level 1 = micro (each cell has N³).
/// Address = (macroCoord, microCoord).
class HierarchicalAddress {
  final LatticeCoord macro;
  final LatticeCoord micro;

  const HierarchicalAddress(this.macro, this.micro);
}

/// Livnium-H: one macro lattice; each macro cell holds one micro lattice.
class HierarchicalState {
  final int n;
  final List<LatticeState> microLattices;
  final LatticeState macroLattice;

  HierarchicalState(this.n)
      : macroLattice = LatticeState(n),
        microLattices = List.generate(
          n * n * n,
          (_) => LatticeState(n),
          growable: false,
        );

  LatticeState microAt(int mx, int my, int mz) {
    final i = mx * n * n + my * n + mz;
    return microLattices[i];
  }

  /// H3: Global ledger = sum of all micro ledgers (each micro conserves its own).
  double get globalLedger =>
      microLattices.fold<double>(0.0, (s, L) => s + L.totalEffectiveWeight);

  /// Target global = N³ * (9*N²) = 9*N^5.
  double get targetGlobalLedger => 9.0 * n * n * n * n * n;

  /// Normalize each micro to its D2 target so global ledger is conserved.
  void normalizeAllMicroLedgers() {
    final targetMicro = totalEnergySymbolic(n);
    for (final L in microLattices) {
      final t = L.totalEffectiveWeight;
      if (t > 0) {
        final scale = targetMicro / t;
        for (final c in L.cells) c.swEffective *= scale;
      }
    }
  }
}
