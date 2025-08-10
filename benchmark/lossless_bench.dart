// benchmark/lossless_bench.dart
import 'dart:math';
import 'dart:io';

import 'package:livnium_core/livnium_core.dart' as lv;

/// Charset: '0' + 'a'..'z'
const _alphabet = '0abcdefghijklmnopqrstuvwxyz';

String _randWord(Random rng, int maxLen) {
  final len = 1 + rng.nextInt(maxLen); // 1..maxLen
  final buf = StringBuffer();
  for (var i = 0; i < len; i++) {
    buf.write(_alphabet[rng.nextInt(_alphabet.length)]);
  }
  return buf.toString();
}

typedef Encode<T> = T? Function(String);
typedef Decode<T> = String? Function(T);

class _BenchResult {
  final String name;
  final int iters;
  final Duration elapsed;
  final int mismatches;
  _BenchResult(this.name, this.iters, this.elapsed, this.mismatches);
}

_BenchResult _bench<T>({
  required String name,
  required int iters,
  required int maxLen,
  required int seed,
  required bool verify,
  required Encode<T> enc,
  required Decode<T> dec,
}) {
  final rng = Random(seed);
  final sw = Stopwatch()..start();
  var mismatches = 0;

  // Rolling checksum to keep JIT honest (don’t eliminate work).
  var checksum = 0;

  for (var i = 0; i < iters; i++) {
    final w = _randWord(rng, maxLen);
    final e = enc(w);
    if (e == null) {
      mismatches++;
      continue;
    }
    final back = dec(e);
    if (!verify) {
      // Touch result minimally.
      checksum ^= w.codeUnitAt(0);
      continue;
    }
    if (back == null || back != w) {
      mismatches++;
    } else {
      // Touch result minimally.
      checksum ^= back.codeUnitAt(0);
    }
  }
  sw.stop();

  // Print checksum so the loop’s work is observable.
  if (!verify) {
    stdout.writeln('[$name] checksum=$checksum');
  }
  return _BenchResult(name, iters, sw.elapsed, mismatches);
}

void _printResult(_BenchResult r) {
  final opsPerSec = r.iters / r.elapsed.inMicroseconds * 1e6;
  stdout.writeln(
      '${r.name.padRight(20)}  iters=${r.iters.toString().padLeft(9)}  '
          'time=${r.elapsed.inMilliseconds} ms  '
          'throughput=${opsPerSec.toStringAsFixed(0)}/s  '
          'mismatches=${r.mismatches}');
}

void main(List<String> args) {
  // Defaults: safe & quick. Push to millions with --iters.
  var iters = 200000;      // total random words per codec
  var maxLen = 12;         // max word length
  var seed = 42;
  var verify = true;

  for (var i = 0; i < args.length; i++) {
    final a = args[i];
    if (a == '--iters' && i + 1 < args.length) iters = int.parse(args[++i]);
    else if (a == '--max-len' && i + 1 < args.length) maxLen = int.parse(args[++i]);
    else if (a == '--seed' && i + 1 < args.length) seed = int.parse(args[++i]);
    else if (a == '--no-verify') verify = false;
    else if (a == '--help') {
      stdout.writeln(
          'Usage: dart benchmark/lossless_bench.dart [--iters N] [--max-len L] '
              '[--seed S] [--no-verify]\n'
              'Tip: for big runs use release mode or compiled exe.');
      return;
    }
  }

  stdout.writeln('Livnium lossless transform benchmark');
  stdout.writeln('iters=$iters  maxLen=$maxLen  seed=$seed  verify=$verify');
  stdout.writeln('--- warmup (50k per codec) ---');

  // Warmup to let the JIT settle.
  for (final _ in [1, 2]) {
    _bench<String>(
      name: 'CSV-warmup',
      iters: 50000,
      maxLen: maxLen,
      seed: seed,
      verify: false,
      enc: (w) => lv.encodeCsv(w),
      dec: (s) => lv.decodeCsv(s),
    );
    _bench<String>(
      name: 'Fixed-warm',
      iters: 50000,
      maxLen: maxLen,
      seed: seed,
      verify: false,
      enc: (w) => lv.encodeFixed(w),
      dec: (s) => lv.decodeFixed(s),
    );
    _bench<BigInt>(
      name: 'BigInt-warm',
      iters: 50000,
      maxLen: maxLen.clamp(1, 26), // one-digit sentinel supports ≤26 digits
      seed: seed,
      verify: false,
      enc: (w) => lv.encodeBigIntTail(w),
      dec: (n) => lv.decodeBigIntTail(n),
    );
  }
  stdout.writeln('--- run ---');

  final results = <_BenchResult>[
    _bench<String>(
      name: 'CSV',
      iters: iters,
      maxLen: maxLen,
      seed: seed,
      verify: verify,
      enc: (w) => lv.encodeCsv(w),
      dec: (s) => lv.decodeCsv(s),
    ),
    _bench<String>(
      name: 'Fixed-width',
      iters: iters,
      maxLen: maxLen,
      seed: seed + 1,
      verify: verify,
      enc: (w) => lv.encodeFixed(w),
      dec: (s) => lv.decodeFixed(s),
    ),
    _bench<BigInt>(
      name: 'BigInt-tail',
      iters: iters,
      maxLen: maxLen.clamp(1, 26),
      seed: seed + 2,
      verify: verify,
      enc: (w) => lv.encodeBigIntTail(w),
      dec: (n) => lv.decodeBigIntTail(n),
    ),
  ];

  stdout.writeln('--- results ---');
  for (final r in results) {
    _printResult(r);
  }

  if (verify) {
    final bad = results.where((r) => r.mismatches != 0).toList();
    if (bad.isEmpty) {
      stdout.writeln('✅ Lossless round-trip verified for all codecs.');
    } else {
      stdout.writeln('❌ Mismatches detected: ${bad.map((r) => r.name).join(', ')}');
      exitCode = 1;
    }
  }
}
