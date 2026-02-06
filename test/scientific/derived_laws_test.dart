import 'package:livnium_core/livnium_core.dart';
import 'package:test/test.dart';

/// Scientific tests for D1 (structural census) and D2 (total energy).
void main() {
  group('D1 Structural Census', () {
    test('N=3: core=8, centers=12, edges=6, corner=1 (D1 sums to 27)', () {
      const n = 3;
      expect(coreCount(n), 8);
      expect(centerCount(n), 12);
      expect(edgeCount(n), 6);
      expect(cornerCount(n), 1);
      expect(coreCount(n) + centerCount(n) + edgeCount(n) + cornerCount(n), 27);
    });

    test('N=1: total cells = 1; single cell has exposure 3 (corner type)', () {
      expect(totalCells(1), 1);
      final state = LatticeState(1);
      expect(state.cells.single.coord.exposure(1), 3);
    });

    test('census sum equals N^3 for N=3,5 (D1 closed form)', () {
      for (final n in [3, 5]) {
        final sum =
            coreCount(n) + centerCount(n) + edgeCount(n) + cornerCount(n);
        expect(sum, totalCells(n), reason: 'N=$n');
      }
    });

    test('lattice class counts match D1 closed form', () {
      for (final n in [3, 5]) {
        final state = LatticeState(n);
        final counts = state.classCounts;
        expect(counts[0], coreCount(n));
        expect(counts[1], centerCount(n));
        expect(counts[2], edgeCount(n));
        expect(counts[3], cornerCount(n));
      }
    });
  });

  group('D2 Total Energy', () {
    test('N=3 total energy = 9*9 = 81', () {
      expect(totalEnergySymbolic(3), 81);
    });

    test('N=1 total energy = 9', () {
      expect(totalEnergySymbolic(1), 9);
    });

    test('fresh lattice total effective weight equals D2', () {
      for (final n in [1, 3, 5]) {
        final state = LatticeState(n);
        expect(
            state.totalEffectiveWeight, closeTo(totalEnergySymbolic(n), 1e-10));
      }
    });

    test('after init, total effective weight equals 9*N^2 (D2 ledger)', () {
      for (final n in [3, 5]) {
        final state = LatticeState(n);
        expect(
            state.totalEffectiveWeight, closeTo(totalEnergySymbolic(n), 1e-10));
      }
    });
  });
}
