library;

import 'alphabet.dart';

const int _R = 27;

int? _d(String ch) => symbolToValue(ch);
String? _g(int v) => valueToSymbol(v);

bool _valid(String s) => s.split('').every((c) => _d(c) != null);

String _stripLeadingZeros(String s) {
  var i = 0;
  while (i < s.length - 1 && s.codeUnitAt(i) == '0'.codeUnitAt(0)) i++;
  return s.substring(i);
}

/// Convert a Livnium base-27 word to BigInt.
BigInt? toDecimal(String s) {
  if (!_valid(s)) return null;
  var acc = BigInt.zero;
  for (final ch in s.split('')) {
    final dv = _d(ch)!;
    acc = acc * BigInt.from(_R) + BigInt.from(dv);
  }
  return acc;
}

/// Convert non-negative BigInt to Livnium base-27 word.
String? fromDecimal(BigInt n) {
  if (n.isNegative) return null;
  if (n == BigInt.zero) return '0';
  final r = BigInt.from(_R);
  final digits = <int>[];
  var m = n;
  while (m > BigInt.zero) {
    final rem = (m % r).toInt();
    digits.add(rem);
    m = m ~/ r;
  }
  final buf = StringBuffer();
  for (var i = digits.length - 1; i >= 0; i--) {
    final ch = _g(digits[i]);
    if (ch == null) return null; // defensive
    buf.write(ch);
  }
  return _stripLeadingZeros(buf.toString());
}

/// Standard base-27 addition with carries. Returns `null` on invalid input.
String? add27(String a, String b) {
  if (!_valid(a) || !_valid(b)) return null;
  if (a.isEmpty && b.isEmpty) return '0';
  if (a.isEmpty)
    return _stripLeadingZeros(b).isEmpty ? '0' : _stripLeadingZeros(b);
  if (b.isEmpty)
    return _stripLeadingZeros(a).isEmpty ? '0' : _stripLeadingZeros(a);
  int i = a.length - 1, j = b.length - 1, carry = 0;
  final out = StringBuffer();

  while (i >= 0 || j >= 0 || carry != 0) {
    final da = (i >= 0) ? _d(a[i--])! : 0;
    final db = (j >= 0) ? _d(b[j--])! : 0;
    var s = da + db + carry;
    carry = s ~/ _R;
    s %= _R;
    final ch = _g(s);
    if (ch == null) return null;
    out.write(ch);
  }

  final res = out.toString().split('').reversed.join();
  final stripped = _stripLeadingZeros(res);
  return stripped.isEmpty ? '0' : stripped;
}

/// Balanced-carry addition (centered digits −13..+13). Same result as [add27].
String? add27Balanced(String a, String b) {
  // Balanced addition currently delegates to [add27] but retains the
  // signature for experimentation with alternative carry schemes.
  return add27(a, b);
}

/// Per-digit modulo-27 addition without carry propagation.
String? add27Cyclic(String a, String b) {
  if (!_valid(a) || !_valid(b)) return null;
  if (a.isEmpty && b.isEmpty) return '0';
  if (a.isEmpty)
    return _stripLeadingZeros(b).isEmpty ? '0' : _stripLeadingZeros(b);
  if (b.isEmpty)
    return _stripLeadingZeros(a).isEmpty ? '0' : _stripLeadingZeros(a);
  int i = a.length - 1, j = b.length - 1;
  final out = StringBuffer();
  while (i >= 0 || j >= 0) {
    final da = (i >= 0) ? _d(a[i--])! : 0;
    final db = (j >= 0) ? _d(b[j--])! : 0;
    final s = (da + db) % _R;
    final ch = _g(s);
    if (ch == null) return null;
    out.write(ch);
  }
  final res = out.toString().split('').reversed.join();
  final stripped = _stripLeadingZeros(res);
  return stripped.isEmpty ? '0' : stripped;
}

/// Carry-save addition of three operands. Returns partial sum and carry.
({String sum, String carry})? add27CarrySave3(String a, String b, String c) {
  if (!_valid(a) || !_valid(b) || !_valid(c)) return null;
  if (a.isEmpty && b.isEmpty && c.isEmpty) {
    return (sum: '0', carry: '0');
  }
  int i = a.length - 1, j = b.length - 1, k = c.length - 1;
  final sumBuf = StringBuffer();
  final carryBuf = StringBuffer();
  while (i >= 0 || j >= 0 || k >= 0) {
    final da = (i >= 0) ? _d(a[i--])! : 0;
    final db = (j >= 0) ? _d(b[j--])! : 0;
    final dc = (k >= 0) ? _d(c[k--])! : 0;
    final total = da + db + dc;
    final digit = total % _R;
    final carry = total ~/ _R;
    sumBuf.write(_g(digit)!);
    carryBuf.write(_g(carry)!);
  }
  final sumStr =
      _stripLeadingZeros(sumBuf.toString().split('').reversed.join());
  final carryStr =
      _stripLeadingZeros(carryBuf.toString().split('').reversed.join());
  return (
    sum: sumStr.isEmpty ? '0' : sumStr,
    carry: carryStr.isEmpty ? '0' : carryStr,
  );
}

/// Finalize a carry-save addition produced by [add27CarrySave3].
String? csFinish(String sum, String carry) {
  if (!_valid(sum) || !_valid(carry)) return null;
  return add27(sum, '${carry}0');
}
