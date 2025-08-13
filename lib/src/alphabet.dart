
library;

/// Livnium alphabet — a custom base-27 numbering system.
///
/// Why base-27?
/// - We encode data using **27 unique symbols** for compact storage and
///   spatial mapping.
/// - Symbols: `'0' → 0`, `'a' → 1`, …, `'z' → 26`.
///
/// This mapping is *bijective*: each symbol maps to exactly one number,
/// and vice-versa.

const int kRadix = 27; // 0..26

/// Fast digit→glyph table (index = digit). Publicly exported as [kSymbols].
const List<String> _kDigitToSymbol = [
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
  'z'
];

/// Public view used across the library. Single source of truth.
const List<String> kSymbols = _kDigitToSymbol;

// Symbol→digit map (kept private; public API uses helpers below)
const Map<String, int> _symbolToValue = {
  '0': 0,
  'a': 1,
  'b': 2,
  'c': 3,
  'd': 4,
  'e': 5,
  'f': 6,
  'g': 7,
  'h': 8,
  'i': 9,
  'j': 10,
  'k': 11,
  'l': 12,
  'm': 13,
  'n': 14,
  'o': 15,
  'p': 16,
  'q': 17,
  'r': 18,
  's': 19,
  't': 20,
  'u': 21,
  'v': 22,
  'w': 23,
  'x': 24,
  'y': 25,
  'z': 26,
};

/// Convert one glyph (e.g. `'c'`) to its digit (e.g. `3`).
/// Returns `null` if `ch` is not exactly one of: `0` or `a`..`z`.
int? symbolToValue(String ch) {
  if (ch.length != 1) return null;
  return _symbolToValue[ch];
}

/// Convert one digit (0..26) back to its glyph (`'0'`..`'z'`).
/// Returns `null` if `v` is outside 0..26.
String? valueToSymbol(int v) {
  if (v < 0 || v >= kRadix) return null;
  return _kDigitToSymbol[v];
}

/// Convert a whole word to base-27 digits.
/// Example: `"cat"` → `[3, 1, 20]`.
/// Returns `null` if any character is invalid.
List<int>? stringToDigits(String text) {
  final out = List<int>.filled(text.length, 0, growable: false);
  for (var i = 0; i < text.length; i++) {
    final v = symbolToValue(text[i]);
    if (v == null) return null;
    out[i] = v;
  }
  return out;
}

/// Convert base-27 digits back to a word.
/// Example: `[3, 1, 20]` → `"cat"`.
/// Returns `null` if any digit is outside 0..26.
String? digitsToString(List<int> digits) {
  final b = StringBuffer();
  for (final d in digits) {
    if (d < 0 || d >= kRadix) return null;
    b.write(_kDigitToSymbol[d]);
  }
  return b.toString();
}

/// Returns `true` iff every character in [text] is a valid Livnium glyph.
/// Empty string is considered valid.
bool isValidWord(String text) => stringToDigits(text) != null;
