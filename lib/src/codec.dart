
library;

/// Livnium Core – loss-free serialisation helpers.
///
/// Formats supported:
///  1) CSV-like (human readable)
///  2) Fixed-width decimal (each digit → 2 chars 00–26)
///  3) Tail-sentinel BigInt  (safe round-trip; preserves leading zeros)
///  4) Raw base-27 BigInt    (compact for math; caller must track length)
///
/// Notes:
/// - Tail-sentinel appends the payload length (0–26) as the final base-27 digit.
///   During decode we pop the sentinel and left-pad with zero-digits if needed.

import 'alphabet.dart';

final _k27 = BigInt.from(kRadix);

// ────────────────────────────────────────────────────────────────────────────
// 1) CSV (human-friendly)
// ────────────────────────────────────────────────────────────────────────────

/// Encode as comma-separated numbers.  "abc" → "1,2,3"
String? encodeCsv(String text, {String sep = ','}) =>
    stringToDigits(text)?.join(sep);

/// Decode CSV back into text.  "1,2,3" → "abc"
String? decodeCsv(String csv, {String sep = ','}) {
  if (csv.isEmpty) return '';
  late final List<int> digits;
  try {
    digits = csv.split(sep).map(int.parse).toList();
  } on FormatException {
    return null;
  }
  return digitsToString(digits);
}

// ────────────────────────────────────────────────────────────────────────────
/* 2) Fixed-width numeric: each digit → 2 decimal chars (00–26)
   Example: "abc" → "010203"
*/
// ────────────────────────────────────────────────────────────────────────────

String? encodeFixed(String text) =>
    stringToDigits(text)?.map((d) => d.toString().padLeft(2, '0')).join();

String? decodeFixed(String numeric) {
  final n = numeric.length;
  if (n == 0) return '';
  if ((n & 1) == 1) return null;

  // Fast digit check (no RegExp)
  for (var i = 0; i < n; i++) {
    final cu = numeric.codeUnitAt(i);
    if (cu < 0x30 || cu > 0x39) return null; // non-digit
  }

  final ds = <int>[];
  for (var i = 0; i < n; i += 2) {
    final a = numeric.codeUnitAt(i) - 0x30;
    final b = numeric.codeUnitAt(i + 1) - 0x30;
    final v = a * 10 + b;
    if (v < 0 || v >= kRadix) return null;
    ds.add(v);
  }
  return digitsToString(ds);
}

/// Each glyph encodes to two decimal digits. A signed 64-bit int can hold at
/// most 18 decimal digits, so the input is limited to 9 glyphs. Returns `null`
/// if the encoded value would exceed that.
int? encodeFixedInt(String text) {
  if (text.length > 9) return null;
  return int.tryParse(encodeFixed(text) ?? '');
}

/// Decodes a 64-bit int produced by [encodeFixedInt].
String? decodeFixedInt(int value) {
  final s = value.toString();
  final even = (s.length + 1) & ~1; // round to even
  return decodeFixed(s.padLeft(even, '0'));
}

// ────────────────────────────────────────────────────────────────────────────
// 3) Tail-sentinel BigInt  — safe round-trip
// Layout: <payload digits …> <length digit (0–26)>
// ────────────────────────────────────────────────────────────────────────────

BigInt? encodeBigIntTail(String text) {
  final payload = stringToDigits(text);
  if (payload == null) return null;
  if (payload.length > 26) {
    throw ArgumentError(
      'Tail-sentinel BigInt supports ≤26 symbols (got ${payload.length})',
    );
  }
  BigInt n = BigInt.zero;
  // fold payload
  for (final d in payload) {
    n = n * _k27 + BigInt.from(d);
  }
  // append length sentinel
  n = n * _k27 + BigInt.from(payload.length);
  return n;
}

String? decodeBigIntTail(BigInt n) {
  if (n == BigInt.zero) return '';

  // extract digits (base-27) MSB→LSB
  var m = n;
  final digits = <int>[];
  while (m > BigInt.zero) {
    digits.insert(0, (m % _k27).toInt());
    m ~/= _k27;
  }
  if (digits.isEmpty) return '';

  // last digit is the sentinel (length)
  final sentinel = digits.removeLast();

  // If BigInt collapsed leading zeros, digits.length may be < sentinel.
  if (digits.length > sentinel) return null; // corrupt / mismatch
  while (digits.length < sentinel) {
    digits.insert(0, 0);
  }
  return digitsToString(digits);
}

// ────────────────────────────────────────────────────────────────────────────
// 4) Decimal wrappers for tail-sentinel
// ────────────────────────────────────────────────────────────────────────────

String? encodeDecimal(String text) => encodeBigIntTail(text)?.toString();

String? decodeDecimal(String decimal) {
  final n = BigInt.tryParse(decimal);
  if (n == null) return null;
  return decodeBigIntTail(n);
}

/// Encode to a decimal string and parse as 64-bit int. Returns `null` if the
/// decimal representation would exceed 19 digits (signed 64-bit limit).
int? encodeDecimalInt(String text) {
  final dec = encodeDecimal(text);
  if (dec == null) return null;
  if (dec.length > 19) return null;
  return int.tryParse(dec);
}

/// Decodes a decimal int produced by [encodeDecimalInt].
String? decodeDecimalInt(int value) => decodeDecimal(value.toString());

// ────────────────────────────────────────────────────────────────────────────
// 5) Raw base-27 BigInt (math-friendly; loses leading zeros unless length known)
// ────────────────────────────────────────────────────────────────────────────

BigInt? encodeBigIntRaw(String text) {
  final payload = stringToDigits(text);
  if (payload == null) return null;
  BigInt n = BigInt.zero;
  for (final d in payload) {
    n = n * _k27 + BigInt.from(d);
  }
  return n;
}

String? decodeBigIntRaw(BigInt n, {required int length}) {
  if (length < 0) return null;
  var m = n;
  final ds = List<int>.filled(length, 0, growable: false);
  for (var i = length - 1; i >= 0; i--) {
    ds[i] = (m % _k27).toInt();
    m ~/= _k27;
  }
  if (m != BigInt.zero) return null; // provided length too small
  return digitsToString(ds);
}

/// Quick self-test (optional)
void _selfTestCodec() {
  const samples = ['', '0', 'a', '0az', 'xyz', '000', 'livnium'];
  for (final w in samples) {
    final c = decodeCsv(encodeCsv(w)!);
    final f = decodeFixed(encodeFixed(w)!);
    final bt = decodeBigIntTail(encodeBigIntTail(w)!);
    assert(
      w == c && w == f && w == bt,
      'Codec mismatch on "$w": csv=$c fixed=$f bigTail=$bt',
    );
  }
}
