
import 'package:livnium_core/src/codec.dart';

void testBase27Uniqueness() {
  final alphabet = [
    '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
    'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
  ];

  final encodedSet = <BigInt>{};
  const maxLen = 3; // test up to 3 symbols

  for (final a in alphabet) {
    for (final b in alphabet) {
      for (final c in alphabet) {
        final word = '$a$b$c';
        final enc = encodeBigIntTail(word)!; // your encoder
        if (!encodedSet.add(enc)) {
          print('❌ Ambiguity detected: $word maps to a duplicate!');
          return;
        }
        final dec = decodeBigIntTail(enc); // your decoder
        if (dec != word) {
          print('❌ Decode mismatch: $word → $dec');
          return;
        }
      }
    }
  }
  print('✅ Base-27 mapping is bijective for tested range.');
}

void main() {
  testBase27Uniqueness();
}
