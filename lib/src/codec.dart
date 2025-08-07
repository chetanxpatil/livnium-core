// lib/src/codec.dart
// ------------------
// Livnium Core – loss-free serialisation helpers.
//
// This module builds on `alphabet.dart` and gives you three reversible
// wire-formats:
//
//  1. CSV          – human-readable, zero ambiguity
//  2. Fixed-width  – each digit written as 2-digit decimal (00-26)
//  3. Tail-sentinel BigInt – packs a whole word into a single integer
//
// All encoders return `null` on illegal input so callers can fall back
// or surface a clean error.

library;

import 'alphabet.dart';

final _k27 = BigInt.from(kRadix);

/// ------------------------------------------------------------------
/// CSV  (easiest to eyeball & diff)
//  e.g.  "0,a,z"  →  "0az"
/// ------------------------------------------------------------------
String? encodeCsv(String text, {String sep = ','}) =>
    stringToDigits(text)?.join(sep);

String? decodeCsv(String csv, {String sep = ','}) {
  late final List<int> digits;
  try {
    digits = csv.split(sep).map(int.parse).toList();
  } on FormatException {
    return null;
  }
  return digitsToString(digits);
}

/// ------------------------------------------------------------------
/// Fixed-width numeric
//  Each digit becomes two decimal chars (00-26), so the string length
//  is always even and ambiguity-free.
//  e.g.  "0az"  →  "000126"  (→ int.parse(..) fits in 64-bit for
//        up to 9 Livnium symbols).
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

/// Convenience:  numeric-string  ↔  int
String? decodeFixedInt(int value) =>
    decodeFixed(value.toString().padLeft(
        (value.toString().length + 1) & ~1, '0'));

int? encodeFixedInt(String text) =>
    int.tryParse(encodeFixed(text) ?? '');

/// ------------------------------------------------------------------
/// Tail-sentinel BigInt  (compact, loss-free)
//  Layout:  <payload digits …>  <length digit 0-26>
//
//  During decode we pop the last base-27 digit, check that it matches
//  the payload length, and recover the original word – including any
//  leading '0' symbols.
//
//  Max safe length with a one-digit sentinel is 26.  For longer words
//  you can either store a two-digit length sentinel, or use CSV/fixed.
// ------------------------------------------------------------------
BigInt? encodeBigIntTail(String text) {
  final payload = stringToDigits(text);
  if (payload == null) return null;
  if (payload.length > 26) {
    throw ArgumentError(
        'Tail-sentinel BigInt supports ≤26 symbols (got ${payload.length})');
  }

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
  if (digits.isEmpty) return '';

  final sentinel = digits.removeLast();      // tail digit = length
  if (sentinel != digits.length) return null; // length mismatch

  return digitsToString(digits);
}

/// Quick round-trip self-test (call from your unit test suite)
void selfTestCodec() {
  const words = ['0', 'a', '0az', 'xyz', '000', 'livnium'];

  for (final w in words) {
    final c = decodeCsv(encodeCsv(w)!);
    final f = decodeFixed(encodeFixed(w)!);
    final b = decodeBigIntTail(encodeBigIntTail(w)!);
    assert(w == c && w == f && w == b,
    'Codec mismatch on "$w": csv $c, fixed $f, bigint $b');
  }
}
