import 'package:test/test.dart';
import 'package:livnium_core/src/arith27.dart';

void main() {
  test('balanced addition equals BigInt addition', () {
    final cases = [
      ['a', 'z'],
      ['love', 'love'],
      ['zzzz', 'a1a1'.replaceAll('1', 'a')],
    ];
    for (final c in cases) {
      final got = add27Balanced(c[0], c[1])!;
      final want = fromDecimal(toDecimal(c[0])! + toDecimal(c[1])!)!;
      expect(got, equals(want));
    }
  });
}
