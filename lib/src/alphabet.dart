// lib/src/alphabet.dart
// --------------------
// Livnium Core – Base-27 Symbol Alphabet
//
// • Digit-set:  '0', 'a' … 'z'  →  0 … 26
// • No composite “a0” token.  If you need the value 27, write two digits
//   exactly the way “10” works in decimal.
//
// This file is *pure data + helpers*.  Higher-level encoders/decoders
// (CSV, fixed-width, tail-sentinel BigInt, etc.) live in `codec.dart`.

library;

/// Radix of the Livnium number system.
const int kRadix = 27;

/// Ordered symbol list (index == numeric value).
const List<String> kSymbols = [
  '0', //
  'a', 'b', 'c', 'd', 'e', 'f',  //
  'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', //
  'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
];

/// Map single-character symbol → integer value.
final Map<String, int> symbolToValue = {
  for (int i = 0; i < kSymbols.length; i++) kSymbols[i]: i,
};

/// Map integer value → single-character symbol.
final Map<int, String> valueToSymbol = {
  for (int i = 0; i < kSymbols.length; i++) i: kSymbols[i],
};

/// Fast helper: convert *one* symbol to its digit value.
/// Returns `null` if the character is not in the alphabet.
int? charToDigit(String ch) => symbolToValue[ch];

/// Fast helper: convert *one* digit (0‥26) to a symbol.
/// Returns `null` if `v` is outside range.
String? digitToChar(int v) => valueToSymbol[v];

/// Convert `"0az"` → `[0, 1, 26]`.
/// Returns `null` if the input contains an invalid character.
List<int>? stringToDigits(String text) {
  final out = <int>[];
  for (final ch in text.split('')) {
    final d = charToDigit(ch);
    if (d == null) return null;
    out.add(d);
  }
  return out;
}

/// Convert `[0, 1, 26]` → `"0az"`.
/// Returns `null` if any digit is outside `0‥26`.
String? digitsToString(Iterable<int> digits) {
  final buffer = StringBuffer();
  for (final d in digits) {
    final ch = digitToChar(d);
    if (ch == null) return null;
    buffer.write(ch);
  }
  return buffer.toString();
}
