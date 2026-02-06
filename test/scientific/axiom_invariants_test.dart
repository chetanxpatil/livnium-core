import 'package:livnium_core/livnium_core.dart';
import 'package:test/test.dart';

/// Scientific tests for A1–A2: spatial alphabet, observer, scale invariance.
void main() {
  group('A1 Generalized Spatial Alphabet', () {
    test('N=3 lattice has 27 cells', () {
      final state = LatticeState(3);
      expect(state.length, 27);
      expect(state.cells.length, 27);
    });

    test('N=1 lattice has 1 cell', () {
      final state = LatticeState(1);
      expect(state.length, 1);
    });

    test('N=5 lattice has 125 cells', () {
      final state = LatticeState(5);
      expect(state.length, 125);
    });

    test('all coordinates in [0, N) and unique', () {
      for (final n in [1, 3, 5]) {
        final state = LatticeState(n);
        final coords = <String>{};
        for (final c in state.cells) {
          expect(c.coord.x, inInclusiveRange(0, n - 1));
          expect(c.coord.y, inInclusiveRange(0, n - 1));
          expect(c.coord.z, inInclusiveRange(0, n - 1));
          coords.add(c.coord.toString());
        }
        expect(coords.length, state.length);
      }
    });
  });

  group('A2 Observer Anchor', () {
    test('global observer center is (N-1)/2 for N=3,5', () {
      expect(globalObserverCenter(3), 1);
      expect(globalObserverCenter(5), 2);
    });
  });

  group('A3 Symbolic Weight', () {
    test(
        'base weights are 1, 3, 9, 27 by exposure (8 core, 12 centers, 6 edges, 1 corner)',
        () {
      final state = LatticeState(3);
      final byBase = <int, int>{};
      for (final c in state.cells) {
        byBase[c.swBase] = (byBase[c.swBase] ?? 0) + 1;
      }
      expect(byBase[1], 8); // exposure 0
      expect(byBase[3], 12); // exposure 1
      expect(byBase[9], 6); // exposure 2
      expect(byBase[27], 1); // exposure 3 (center cell)
    });
  });
}
