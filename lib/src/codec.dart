library;

/// Livnium Core – loss-free serialisation helpers.
/// ------------------------------------------------
/// This file provides ways to **encode** and **decode**
/// strings in the Livnium base-27 alphabet into different formats.
///
/// Formats supported:
///  1. CSV-like (human readable)
///  2. Fixed-width decimal
///  3. Tail-sentinel BigInt (safe round-trip, preserves leading zeros)
///  4. Pure base-27 BigInt (math-friendly, but loses leading zeros)
///
/// Why?
/// - Different encodings are useful for different storage, math, or network tasks.
/// - The tail-sentinel form is the safest for round-trip correctness.
/// - The raw form is smallest for numeric math, but you must remember the length.
///

import 'alphabet.dart'; // maps symbols ↔ digits

// Precompute BigInt constant for base-27
final _k27 = BigInt.from(kRadix);

// ---------------------------------------------------------------------------
// 1) CSV format: human-friendly list of numbers
// ---------------------------------------------------------------------------

/// Encode as comma-separated numbers.
/// Example: "abc" → "1,2,3"
String? encodeCsv(String text, {String sep = ','}) =>
    stringToDigits(text)?.join(sep);

/// Decode CSV back into text.
/// Example: "1,2,3" → "abc"
String? decodeCsv(String csv, {String sep = ','}) {
  late final List<int> digits;
  try {
    digits = csv.split(sep).map(int.parse).toList();
  } on FormatException {
    return null; // Non-numeric entry found
  }
  return digitsToString(digits);
}

// ---------------------------------------------------------------------------
// 2) Fixed-width numeric format: each digit is 2 decimal characters (00–26)
// ---------------------------------------------------------------------------

/// Encode with fixed 2-digit numbers.
/// Example: "abc" → "010203"
String? encodeFixed(String text) =>
    stringToDigits(text)?.map((d) => d.toString().padLeft(2, '0')).join();

/// Decode fixed-width back to text.
/// Example: "010203" → "abc"
String? decodeFixed(String numeric) {
  if (numeric.isEmpty || numeric.length.isOdd) return null;
  if (numeric.contains(RegExp(r'\D'))) return null; // Non-digit found

  final ds = <int>[];
  for (var i = 0; i < numeric.length; i += 2) {
    final n = int.parse(numeric.substring(i, i + 2));
    if (n < 0 || n >= kRadix) return null; // invalid digit
    ds.add(n);
  }
  return digitsToString(ds);
}

/// Convenience: encode to int (only if it fits in 64-bit)
int? encodeFixedInt(String text) => int.tryParse(encodeFixed(text) ?? '');

/// Decode a 64-bit int back into fixed format string.
/// Pads with zero to ensure even length before decoding.
String? decodeFixedInt(int value) {
  final s = value.toString();
  final even = (s.length + 1) & ~1; // round up to even length
  return decodeFixed(s.padLeft(even, '0'));
}

// ---------------------------------------------------------------------------
// 3) Tail-sentinel BigInt
// ---------------------------------------------------------------------------
// <payload digits> + <length digit>
// This preserves:
// - full data
// - leading zeros
// - exact length
// Max length: 26 (because sentinel is only 1 digit 0–26)

/// Encode to tail-sentinel BigInt.
/// Example: "a0" → digits [1,0], length=2 → append '2'
///   → [1,0,2] → BigInt in base-27.
BigInt? encodeBigIntTail(String text) {
  final payload = stringToDigits(text);
  if (payload == null) return null;
  if (payload.length > 26) {
    throw ArgumentError(
      'Tail-sentinel BigInt supports ≤26 symbols (got ${payload.length})',
    );
  }
  BigInt n = BigInt.zero;
  for (final d in [...payload, payload.length]) {
    n = n * _k27 + BigInt.from(d);
  }
  return n;
}

/// Decode a tail-sentinel BigInt back to text.
String? decodeBigIntTail(BigInt n) {
  if (n == BigInt.zero) return '';
  var m = n;
  final digits = <int>[];
  // Extract base-27 digits
  while (m > BigInt.zero) {
    digits.insert(0, (m % _k27).toInt());
    m ~/= _k27;
  }
  if (digits.isEmpty) return '';

  final sentinel = digits.removeLast();
  if (sentinel < digits.length) return null; // Impossible: too many payload digits

  // Restore any missing leading zeros
  while (digits.length < sentinel) {
    digits.insert(0, 0);
  }
  return digitsToString(digits);
}

// ---------------------------------------------------------------------------
// 4) Decimal wrappers for tail-sentinel
// ---------------------------------------------------------------------------

/// Encode as a base-10 string (just stringify the BigInt)
String? encodeDecimal(String text) => encodeBigIntTail(text)?.toString();

/// Decode from decimal string back to text.
String? decodeDecimal(String decimal) {
  final n = BigInt.tryParse(decimal);
  if (n == null) return null;
  return decodeBigIntTail(n);
}

/// Optional 64-bit int wrappers (may overflow!)
int? encodeDecimalInt(String text) => int.tryParse(encodeDecimal(text) ?? '');
String? decodeDecimalInt(int value) => decodeDecimal(value.toString());

// ---------------------------------------------------------------------------
// 5) Pure base-27 BigInt (raw)
// ---------------------------------------------------------------------------
// - Smallest form for math/comparison
// - Loses leading zeros!
/// Example: "a0" → 27, but "000" → 0

BigInt? encodeBigIntRaw(String text) {
  final payload = stringToDigits(text);
  if (payload == null) return null;
  BigInt n = BigInt.zero;
  for (final d in payload) {
    n = n * _k27 + BigInt.from(d);
  }
  return n;
}

/// Decode raw BigInt when length is known.
/// This is the only way to recover leading zeros in raw form.
String? decodeBigIntRaw(BigInt n, {required int length}) {
  if (length < 0) return null;
  var m = n;
  final ds = List<int>.filled(length, 0);
  for (int i = length - 1; i >= 0; i--) {
    ds[i] = (m % _k27).toInt();
    m ~/= _k27;
  }
  if (m != BigInt.zero) return null; // length too small
  return digitsToString(ds);
}
