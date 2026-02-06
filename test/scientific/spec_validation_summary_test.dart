import 'package:livnium_core/livnium_core.dart';
import 'package:test/test.dart';

/// Scientific validation summary: hypotheses that must hold for the implementation
/// to be kept. Any failure → drop or fix the corresponding design.
void main() {
  group('Spec validation (keep/drop criteria)', () {
    test('H1: D2 ledger 9*N^2 is exactly reachable and preserved', () {
      final state = LatticeState(3);
      expect(state.totalEffectiveWeight, closeTo(81, 1e-10));
      updateBasinGeometry(state, true);
      expect(state.totalEffectiveWeight, closeTo(81, 1e-8));
      updateBasinGeometry(state, false);
      expect(state.totalEffectiveWeight, closeTo(81, 1e-6));
    });

    test('H2: D3 audit passes after every basin update', () {
      final state = LatticeState(5);
      for (var i = 0; i < 20; i++) {
        state.cells[i % state.length].active = true;
        updateBasinGeometry(state, i.isEven);
        expect(auditConservation(state), isTrue, reason: 'after step $i');
      }
    });

    test('H3: D1 census partitions N^3 for N=1,3,5', () {
      for (final n in [1, 3, 5]) {
        final sum =
            coreCount(n) + centerCount(n) + edgeCount(n) + cornerCount(n);
        expect(sum, totalCells(n), reason: 'N=$n');
      }
    });

    test('H4: Rotation preserves structural class (A4)', () {
      final state = LatticeState(3);
      for (final cell in state.cells) {
        final r = rotateQuarter(cell.coord, 0, 1);
        final c2 = LatticeCoord(cell.coord.n, r.x, r.y, r.z);
        expect(structuralClass(c2), structuralClass(cell.coord));
      }
    });

    test('H5: Livnium-H global ledger = N^3 * (9*N^2)', () {
      final h = HierarchicalState(3);
      expect(h.globalLedger, closeTo(h.targetGlobalLedger, 1e-8));
    });
  });
}
