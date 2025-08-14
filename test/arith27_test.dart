import 'dart:math';
import 'package:test/test.dart';
import 'package:livnium_core/src/arith27.dart';
import 'package:livnium_core/src/alphabet.dart';

String randWord(Random rng, int len) {
  // digits 0..26 → symbols
  const symbols = [
    '0',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];
  final b = StringBuffer();
  for (var i = 0; i < len; i++) {
    b.write(symbols[rng.nextInt(27)]);
  }
  final s = b.toString();
  // avoid empty/invalid; normalize to at least one non-empty char
  return s.isEmpty ? '0' : s;
}

void main() {
  group('arith27 basics', () {
    test('toDecimal/fromDecimal roundtrip', () {
      final cases = ['0', 'a', 'z', 'a0', '0az', 'liv', '000', 'zzzzzz'];
      for (final w in cases) {
        final dec = toDecimal(w)!;
        final back = fromDecimal(dec)!;
        expect(
          back,
          equals(
            RegExp(r'^0+$').hasMatch(w)
                ? '0'
                : w.replaceFirst(RegExp(r'^0+'), ''),
          ),
        );
      }
    });

    test('add27 small cases', () {
      expect(add27('0', '0'), '0');
      expect(add27('a', '0'), 'a');
      expect(add27('z', 'a'), 'a0'); // 26+1 = 27 → "a0" in base-27
      final sum = fromDecimal(toDecimal('a0')! + toDecimal('a0')!)!;
      expect(add27('a0', 'a0'), sum);
    });

    test('balanced matches canonical', () {
      final pairs = [
        ('0', '0'),
        ('a', 'z'),
        ('zz', 'zz'),
        ('liv', 'nium'),
        ('000', '000'),
      ];
      for (final (x, y) in pairs) {
        expect(add27Balanced(x, y), equals(add27(x, y)));
      }
    });

    test('empty string treated as zero', () {
      expect(toDecimal(''), BigInt.zero);
      expect(add27('', ''), '0');
      expect(add27Balanced('', 'a'), 'a');
      expect(add27Cyclic('z', 'a'), '0');
      final cs = add27CarrySave3('', '', '')!;
      expect(cs.sum, '0');
      expect(cs.carry, '0');
      expect(csFinish('', ''), '0');
    });

    test('modular addition without carry', () {
      expect(add27Cyclic('z', 'z'), 'y');
      expect(add27Cyclic('a0', 'a0'), 'b0');
      expect(add27Cyclic('z', 'a'), '0');
    });

    test('carry-save addition roundtrip', () {
      final r = add27CarrySave3('z', 'z', 'z')!;
      expect(r.sum, 'x');
      expect(r.carry, 'b');
      expect(csFinish(r.sum, r.carry), add27(add27('z', 'z')!, 'z'));
    });
  });

  group('property: 1000 random pairs', () {
    test('add equals BigInt; balanced equals canonical', () {
      final rng = Random(1337);
      for (var t = 0; t < 1000; t++) {
        final a = randWord(rng, rng.nextInt(40) + 1);
        final b = randWord(rng, rng.nextInt(40) + 1);
        final c = randWord(rng, rng.nextInt(40) + 1);

        final decA = toDecimal(a)!;
        final decB = toDecimal(b)!;
        final decC = toDecimal(c)!;
        final sumDec = decA + decB + decC;
        final sumWord = fromDecimal(sumDec)!;

        final abCanon = add27(a, b)!;
        final abBal = add27Balanced(a, b)!;
        expect(abBal, equals(abCanon));

        final s1 = add27(abCanon, c)!;
        final r = add27CarrySave3(a, b, c)!;
        final s2 = csFinish(r.sum, r.carry)!;
        final s3 = add27Balanced(abCanon, c)!;

        expect(s1, equals(sumWord));
        expect(s2, equals(sumWord));
        expect(s3, equals(sumWord));
      }
    });

    test('cyclic addition matches digitwise modular sum', () {
      final rng = Random(2024);
      for (var t = 0; t < 1000; t++) {
        final a = randWord(rng, rng.nextInt(40) + 1);
        final b = randWord(rng, rng.nextInt(40) + 1);
        final cyc = add27Cyclic(a, b)!;
        final n = max(a.length, b.length);
        for (var i = 0; i < n; i++) {
          final da = i < a.length ? symbolToValue(a[a.length - 1 - i])! : 0;
          final db = i < b.length ? symbolToValue(b[b.length - 1 - i])! : 0;
          final expected = (da + db) % 27;
          final rc =
              i < cyc.length ? symbolToValue(cyc[cyc.length - 1 - i])! : 0;
          expect(rc, expected);
        }
      }
    });

    test('random decimal roundtrips', () {
      final rng = Random(4242);
      for (var t = 0; t < 1000; t++) {
        // random up to ~256 bits
        final bits = 1 + rng.nextInt(256);
        BigInt n = BigInt.zero;
        for (var i = 0; i < (bits / 32).ceil(); i++) {
          n = (n << 32) + BigInt.from(rng.nextInt(0x100000000));
        }
        n = n.abs();
        final w = fromDecimal(n)!;
        final back = toDecimal(w)!;
        expect(back, equals(n));
      }
    });
  });
}
