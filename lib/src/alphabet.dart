// lib/src/alphabet.dart
// --------------------
// Livnium Core – Base-27 Symbol Alphabet
//
// Digit-set: '0', 'a' … 'z' → values 0 … 26
// This is a positional numeral system: "a0" = 27 decimal.
// (No special single-symbol token for 27; use multi-digit representation.)
//
// This file is *pure data + helpers*. Higher-level encoders/decoders
// live in `codec.dart`.

library;

/// Radix of the Livnium number system.
const int kRadix = 27;

/// Ordered symbol list (index == numeric value).
const List<String> kSymbols = [
  '0', //
  'a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
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

/// Convert *one* symbol to its digit value.
/// Returns `null` if the character is not in the alphabet.
int? charToDigit(String ch) => symbolToValue[ch];

/// Convert *one* digit (0‥26) to a symbol.
/// Returns `null` if `v` is outside range.
String? digitToChar(int v) => valueToSymbol[v];

/// Convert `"0az"` → `[0, 1, 26]`.
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
String? digitsToString(Iterable<int> digits) {
  final buffer = StringBuffer();
  for (final d in digits) {
    final ch = digitToChar(d);
    if (ch == null) return null;
    buffer.write(ch);
  }
  return buffer.toString();
}
