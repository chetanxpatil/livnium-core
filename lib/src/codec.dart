library;

/// Livnium Core – loss-free serialisation helpers.
/// CSV, fixed-width numeric, and tail-sentinel BigInt.

import 'alphabet.dart';

final _k27 = BigInt.from(kRadix);

/// CSV (human-readable)
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

/// Fixed-width numeric: each digit → 2 decimal chars (00–26)
String? encodeFixed(String text) =>
    stringToDigits(text)?.map((d) => d.toString().padLeft(2, '0')).join();

String? decodeFixed(String numeric) {
  if (numeric.isEmpty || numeric.length.isOdd) return null;
  if (numeric.contains(RegExp(r'\D'))) return null;
  final ds = <int>[];
  for (var i = 0; i < numeric.length; i += 2) {
    final n = int.parse(numeric.substring(i, i + 2));
    if (n < 0 || n >= kRadix) return null;
    ds.add(n);
  }
  return digitsToString(ds);
}

/// Convenience int wrappers (careful with 64-bit limits)
int? encodeFixedInt(String text) => int.tryParse(encodeFixed(text) ?? '');

String? decodeFixedInt(int value) {
  final s = value.toString();
  final even = (s.length + 1) & ~1;
  return decodeFixed(s.padLeft(even, '0'));
}

/// Tail-sentinel BigInt: <payload digits …> <length digit 0–26>
/// Max length with 1-digit sentinel = 26.
BigInt? encodeBigIntTail(String text) {
  final payload = stringToDigits(text);
  if (payload == null) return null;
  if (payload.length > 26) {
    throw ArgumentError(
      'Tail-sentinel BigInt supports ≤26 symbols '
      '(got ${payload.length})',
    );
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
  final sentinel = digits.removeLast();
  if (sentinel < digits.length) return null;
  while (digits.length < sentinel) {
    digits.insert(0, 0);
  }
  return digitsToString(digits);
}

/// Quick smoke test for all codecs
void selfTestCodec() {
  const words = ['0', 'a', '0az', 'xyz', '000', 'livnium'];
  for (final w in words) {
    final c = decodeCsv(encodeCsv(w)!);
    final f = decodeFixed(encodeFixed(w)!);
    final b = decodeBigIntTail(encodeBigIntTail(w)!);
    assert(
      w == c && w == f && w == b,
      'Codec mismatch "$w": csv=$c fixed=$f big=$b',
    );
  }
}
