import 'dart:math';
import 'package:livnium_core/src/arith27.dart';
import 'package:livnium_core/livnium_core.dart';

String randWord(Random rng, int len) {
  final sb = StringBuffer();
  for (var i = 0; i < len; i++) {
    sb.write(valueToSymbol(rng.nextInt(kRadix))!);
  }
  return sb.toString();
}

({String sum, int carries, int ripple}) addPlainStats(String a, String b) {
  int i = a.length - 1, j = b.length - 1, carry = 0;
  int carries = 0, run = 0, maxRun = 0;
  final out = StringBuffer();
  while (i >= 0 || j >= 0 || carry != 0) {
    final da = i >= 0 ? symbolToValue(a[i--])! : 0;
    final db = j >= 0 ? symbolToValue(b[j--])! : 0;
    var s = da + db + carry;
    carry = s ~/ kRadix;
    s %= kRadix;
    out.write(valueToSymbol(s)!);
    if (carry != 0) {
      carries++;
      run++;
    } else {
      if (run > maxRun) maxRun = run;
      run = 0;
    }
  }
  if (run > maxRun) maxRun = run;
  final res = out.toString().split('').reversed.join();
  return (sum: res, carries: carries, ripple: maxRun);
}

({String sum, int carries, int ripple}) addBalancedStats(String a, String b) {
  int i = a.length - 1, j = b.length - 1, carryC = 0;
  int carries = 0, run = 0, maxRun = 0;
  final out = <int>[];
  while (i >= 0 || j >= 0) {
    final da = i >= 0 ? symbolToValue(a[i--])! : 0;
    final db = j >= 0 ? symbolToValue(b[j--])! : 0;
    var sc = (da - 13) + (db - 13) + carryC;
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
    if (carryC != 0) {
      carries++;
      run++;
    } else {
      if (run > maxRun) maxRun = run;
      run = 0;
    }
  }
  if (carryC != 0) {
    out.add(carryC);
    carries++;
    run++;
  }
  if (run > maxRun) maxRun = run;
  final buf = StringBuffer();
  for (var k = out.length - 1; k >= 0; k--) {
    buf.write(valueToSymbol(out[k] + 13)!);
  }
  final res = buf.toString().replaceFirst(RegExp(r'^0+'), '');
  return (sum: res.isEmpty ? '0' : res, carries: carries, ripple: maxRun);
}

void main() {
  final rng = Random(123);
  print('N  carries_plain  carries_bal  ripple_plain  ripple_bal');
  for (final N in [16, 64, 256]) {
    int cPlain = 0, cBal = 0;
    int rPlain = 0, rBal = 0;
    for (var t = 0; t < 100; t++) {
      final a = randWord(rng, N);
      final b = randWord(rng, N);
      final p = addPlainStats(a, b);
      final q = addBalancedStats(a, b);
      cPlain += p.carries;
      cBal += q.carries;
      rPlain += p.ripple;
      rBal += q.ripple;
    }
    final avgCarriesPlain = cPlain / 100;
    final avgCarriesBal = cBal / 100;
    final avgRipplePlain = rPlain / 100;
    final avgRippleBal = rBal / 100;
    print(
      '$N  ${avgCarriesPlain.toStringAsFixed(2)}  '
      '${avgCarriesBal.toStringAsFixed(2)}  '
      '${avgRipplePlain.toStringAsFixed(2)}  '
      '${avgRippleBal.toStringAsFixed(2)}',
    );
  }
}
