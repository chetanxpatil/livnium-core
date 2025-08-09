// lib/src/codec.dart
// ------------------
// Livnium Core – loss-free serialisation helpers.
//
// Builds on `alphabet.dart` to provide three reversible wire-formats:
//
// 1. CSV (numeric)          – human-readable, zero ambiguity
//    e.g. "0az" → "0,1,26"
// 2. Fixed-width numeric    – each digit as two decimal chars (00–26)
//    e.g. "0az" → "000126"
// 3. Tail-sentinel BigInt   – packs a whole word into a single integer
//
// All encoders return `null` on illegal input.

library;

import 'alphabet.dart';

final _k27 = BigInt.from(kRadix);

/// ------------------------------------------------------------------
/// CSV (numeric)
/// "0az" → "0,1,26"
/// ------------------------------------------------------------------
String? encodeCsv(String text, {String sep = ','}) =>
    stringToDigits(text)?.join(sep);

String? decodeCsv(String csv, {String sep = ','}) {
  try {
    final digits = csv.split(sep).map(int.parse).toList();
    return digitsToString(digits);
  } on FormatException {
    return null;
  }
}

/// ------------------------------------------------------------------
/// Fixed-width numeric
/// "0az" → "000126"
/// ------------------------------------------------------------------
String? encodeFixed(String text) =>
    stringToDigits(text)
        ?.map((d) => d.toString().padLeft(2, '0'))
        .join();

String? decodeFixed(String numeric) {
  if (numeric.length.isOdd || numeric.contains(RegExp(r'\D'))) return null;
  final digits = <int>[];
  for (var i = 0; i < numeric.length; i += 2) {
    digits.add(int.parse(numeric.substring(i, i + 2)));
  }
  return digitsToString(digits);
}

/// ------------------------------------------------------------------
/// Fixed-int (base-27 <-> decimal int)
/// ------------------------------------------------------------------
String? decodeFixedInt(int value) {
  if (value < 0) return null;
  final digits = <int>[];
  var n = value;
  while (n > 0) {
    digits.insert(0, n % kRadix);
    n ~/= kRadix;
  }
  return digitsToString(digits.isEmpty ? [0] : digits);
}

int? encodeFixedInt(String text) {
  final digits = stringToDigits(text);
  if (digits == null) return null;
  var value = 0;
  for (final d in digits) {
    value = value * kRadix + d;
  }
  return value;
}

/// ------------------------------------------------------------------
/// Tail-sentinel BigInt
/// Layout: <payload digits…> <length digit>
/// ------------------------------------------------------------------
BigInt? encodeBigIntTail(String text) {
  final payload = stringToDigits(text);
  if (payload == null) return null;
  if (payload.length > 26) {
    throw ArgumentError('Tail-sentinel supports ≤26 symbols.');
  }
  // Ensure we shift enough to keep leading zeros
  BigInt n = BigInt.zero;
  for (final d in [...payload, payload.length]) {
    n = n * _k27 + BigInt.from(d);
  }
  return n;
}


String? decodeBigIntTail(BigInt n) {
  if (n == BigInt.zero) return '';
  var m = n;
  final digits = <int>[];
  while (m > BigInt.zero) {
    digits.insert(0, (m % _k27).toInt());
    m ~/= _k27;
  }
  final sentinel = digits.removeLast();
  while (digits.length < sentinel) { // restore leading 0's
    digits.insert(0, 0);
  }
  if (sentinel != digits.length) return null;
  return digitsToString(digits);
}
