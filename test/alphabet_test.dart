import 'package:test/test.dart';
import 'package:livnium_core/src/alphabet.dart';

void main() {
  group('alphabet helpers', () {
    test('stringToDigits converts valid string', () {
      expect(stringToDigits('0az'), equals([0, 1, 26]));
    });

    test('stringToDigits returns null on invalid character', () {
      expect(stringToDigits('0a?'), isNull);
    });

    test('digitsToString converts digits', () {
      expect(digitsToString([0, 1, 26]), equals('0az'));
    });

    test('digitsToString returns null on out-of-range digit', () {
      expect(digitsToString([0, 27]), isNull);
    });
  });
}
