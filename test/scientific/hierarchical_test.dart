import 'package:livnium_core/livnium_core.dart';
import 'package:test/test.dart';

/// Scientific tests for H1–H3: recursive structure, coupled conservation.
void main() {
  group('H1 Recursive Structure', () {
    test('macro N=3 has 27 micro lattices', () {
      final h = HierarchicalState(3);
      expect(h.microLattices.length, 27);
    });

    test('each micro has 27 cells', () {
      final h = HierarchicalState(3);
      for (final L in h.microLattices) {
        expect(L.length, 27);
      }
    });
  });

  group('H3 Coupled Conservation', () {
    test('each micro lattice initially has total = 9*N^2', () {
      final h = HierarchicalState(3);
      final target = totalEnergySymbolic(3);
      for (final L in h.microLattices) {
        expect(L.totalEffectiveWeight, closeTo(target, 1e-10));
      }
    });

    test('global ledger = 27 * 81 = 2187 for N=3', () {
      final h = HierarchicalState(3);
      expect(h.targetGlobalLedger, 2187);
      expect(h.globalLedger, closeTo(2187, 1e-8));
    });

    test('normalizeAllMicroLedgers restores global ledger', () {
      final h = HierarchicalState(3);
      for (final L in h.microLattices) {
        for (final c in L.cells) c.swEffective = 1.0;
      }
      h.normalizeAllMicroLedgers();
      expect(h.globalLedger, closeTo(h.targetGlobalLedger, 1e-6));
    });
  });
}
