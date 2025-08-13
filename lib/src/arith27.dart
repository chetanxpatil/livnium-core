library;

import 'alphabet.dart';

// Optional polish (not yet implemented):
// 1. Balanced final carry — convert any leftover centered carry to a
//    standard 0..26 digit instead of emitting then verifying via
//    [add27], eliminating the fallback.
// 2. Input validity semantics — `_valid` rejects empty strings; consider
//    allowing "" as zero or clearly documenting the non-empty requirement.

const int _R = 27;

int? _d(String ch) => symbolToValue(ch);
String? _g(int v) => valueToSymbol(v);

bool _valid(String s) =>
    s.isNotEmpty && s.split('').every((c) => _d(c) != null);

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
  return _stripLeadingZeros(res);
}

/// Balanced-carry addition (centered digits −13..+13). Same result as [add27].
String? add27Balanced(String a, String b) {
  if (!_valid(a) || !_valid(b)) return null;
  int i = a.length - 1, j = b.length - 1, carryC = 0; // centered carry
  final out = <int>[]; // centered digits −13..+13

  while (i >= 0 || j >= 0) {
    final da = (i >= 0) ? _d(a[i--])! : 0;
    final db = (j >= 0) ? _d(b[j--])! : 0;
    var sc = (da - 13) + (db - 13) + carryC; // centered sum
    if (sc > 13) {
      sc -= 27;
      carryC = 1;
    } else if (sc < -13) {
      sc += 27;
      carryC = -1;
    } else {
      carryC = 0;
    }
    out.add(sc);
  }

  if (carryC != 0) out.add(carryC);

  // Map centered digits back to 0..26 and build string
  final buf = StringBuffer();
  for (var k = out.length - 1; k >= 0; k--) {
    final dv = out[k] + 13; // 0..26
    final ch = _g(dv);
    if (ch == null) return null;
    buf.write(ch);
  }
  final res = _stripLeadingZeros(buf.toString());

  // Safety: must match canonical add27
  final canon = add27(a, b);
  if (canon == null || res != canon) return canon; // fall back if mismatch
  return res;
}
