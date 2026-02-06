import 'package:livnium_core/livnium_core.dart';
import 'package:test/test.dart';

/// Scientific tests for A4: rotation is bijective and preserves total weight / class.
void main() {
  group('A4 Rotation Group', () {
    test('quarter rotation about z preserves set of positions', () {
      final n = 3;
      final coords = <String>{};
      for (var x = 0; x < n; x++) {
        for (var y = 0; y < n; y++) {
          for (var z = 0; z < n; z++) {
            final c = LatticeCoord(n, x, y, z);
            final r = rotateQuarter(c, 2, 1);
            coords.add(r.toString());
          }
        }
      }
      expect(coords.length, 27);
    });

    test('four quarter-turns about z return to identity', () {
      final c = LatticeCoord(3, 0, 1, 2);
      var r = c;
      for (var i = 0; i < 4; i++) r = rotateQuarter(r, 2, 1);
      expect(r.x, c.x);
      expect(r.y, c.y);
      expect(r.z, c.z);
    });

    test('rotation preserves structural class (exposure)', () {
      final state = LatticeState(3);
      for (final cell in state.cells) {
        final c = cell.coord;
        final r = rotateQuarter(c, 0, 1);
        expect(structuralClass(LatticeCoord(c.n, r.x, r.y, r.z)),
            structuralClass(c));
      }
    });

    test('rotation preserves base weight (same exposure)', () {
      final state = LatticeState(3);
      for (final cell in state.cells) {
        final c = cell.coord;
        final r = rotateQuarter(c, 1, 2);
        final wOrig = symbolicWeightBase(c);
        final wRot = symbolicWeightBase(LatticeCoord(c.n, r.x, r.y, r.z));
        expect(wRot, wOrig);
      }
    });
  });
}
