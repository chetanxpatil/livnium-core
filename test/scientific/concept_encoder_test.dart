import 'package:livnium_core/livnium_core.dart';
import 'package:test/test.dart';

void main() {
  group('Phase 3: Concept Encoder', () {
    test('Encodes 2D pixel pattern into 3D lattice rotations', () {
      final n = 3;
      final mind = GrowthMind(n);
      final encoder = ConceptEncoder(mind);

      // 1. Setup: Paint the lattice with a gradient so rotations are visible.
      // If all cells have the same value, swapping them is invisible.
      for (int i = 0; i < mind.state.cells.length; i++) {
        mind.state.cells[i].swEffective = i.toDouble() + 1.0;
      }
      normalizeGlobalLedger(mind.state);

      final cell00 = mind.state.getCellAt(LatticeCoord(n, 0, 0, 0));
      final val00 = cell00.swEffective;

      final cell22 = mind.state.getCellAt(LatticeCoord(n, 2, 2, 0));
      final val22 = cell22.swEffective;

      final cell01 = mind.state.getCellAt(LatticeCoord(n, 0, 1, 0));
      final val01 = cell01.swEffective;

      // 2. Diagonal image (pattern)
      // [1, 0, 0]
      // [0, 1, 0]
      // [0, 0, 1]
      final image = [
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0],
      ];

      // 3. Encode: rotates (0,0,0), (1,1,0), (2,2,0) on axis 2
      encoder.encodeImage(image);

      // 4. Verify: active pixels swapped (value changed)
      expect(cell00.swEffective, isNot(equals(val00)),
          reason:
              'Pixel (0,0) was active, so lattice cell should have rotated.');

      expect(cell22.swEffective, isNot(equals(val22)),
          reason:
              'Pixel (2,2) was active, so lattice cell should have rotated.');

      expect(cell01.swEffective, equals(val01),
          reason: 'Pixel (0,1) was 0.0, so lattice cell should be untouched.');

      expect(mind.isSane, isTrue, reason: 'Encoding must conserve energy.');
    });

    test('Throws error on mismatched image size', () {
      final mind = GrowthMind(3);
      final encoder = ConceptEncoder(mind);
      final badImage = [
        [1.0, 0.0],
      ];
      expect(() => encoder.encodeImage(badImage), throwsArgumentError);
    });
  });
}
