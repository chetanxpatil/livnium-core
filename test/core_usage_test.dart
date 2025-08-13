import 'package:test/test.dart';
import 'package:livnium_core/livnium_core.dart';

void main() {
  group('quick start example', () {
    const word = 'liv';

    test('encodes and decodes across all codecs', () {
      final csv = encodeCsv(word)!;
      final fixed = encodeFixed(word)!;
      final big = encodeBigIntTail(word)!;

      expect(decodeCsv(csv), equals(word));
      expect(decodeFixed(fixed), equals(word));
      expect(decodeBigIntTail(big), equals(word));
    });

    test('computes word energy', () {
      expect(wordEnergy9(word), equals(63.0));
    });

    test('computes symbol energy in K units', () {
      expect(symbolEnergyK('a'), equals(10.125));
      expect(symbolEnergyK('g'), equals(20.25));
      expect(symbolEnergyK('s'), equals(30.375));
      expect(symbolEnergyK('?'), isNull);
    });

    test('computes word energy in K units', () {
      expect(wordEnergyK(word), equals(70.875));
    });

    test('rotates a vector around the Z axis', () {
      const v = Vec3(1, 1, -1);
      final rotated = rotateZ(v);
      expect(rotated, equals(const Vec3(-1, 1, -1)));
    });

    test('fixed codec maps a0 to decimal 100', () {
      final encoded = encodeFixedInt('a0');
      expect(encoded, equals(100));
      expect(decodeFixedInt(encoded!), equals('a0'));
    });
  });
}
