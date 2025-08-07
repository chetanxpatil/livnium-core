import 'package:test/test.dart';
import 'package:livnium_core/livnium_core.dart';

void main() {
  group('quick start example', () {
    const word = 'liv';

    test('encodes and decodes across all codecs', () {
      final csv = encodeCsv(word);
      final fixed = encodeFixed(word);
      final big = encodeBigIntTail(word);

      expect(decodeCsv(csv!), equals(word));
      expect(decodeFixed(fixed!), equals(word));
      expect(decodeBigIntTail(big!), equals(word));
    });

    test('computes symbolic energy', () {
      expect(symbolicEnergy(word), equals(54.0));
    });

    test('rotates a vector around the Z axis', () {
      const v = Vec3(1, 1, -1);
      final rotated = rotateZQuarter(v);
      expect(rotated, equals(const Vec3(1, -1, -1)));
    });
  });
}
