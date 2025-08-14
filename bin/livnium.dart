#!/usr/bin/env dart
import 'dart:io';
import 'package:args/args.dart';
import 'package:livnium_core/livnium_core.dart';

void main(List<String> argv) {
  final p = ArgParser()
    ..addCommand('encode')
    ..addCommand('decode')
    ..addCommand('add')        // base-27 addition (canonical/balanced/cyclic)
    ..addCommand('cs')         // carry-save: a + b + c
    ..addCommand('energy')     // SE9 or --k
    ..addCommand('couplers')   // rank top-N
    ..addCommand('moves')      // apply face-move sequence
    ..addCommand('project')    // drop-axis/radial/coarse
    ..addCommand('mapping')    // exposure mapping (conventional|harmonic)
    ..addCommand('validate')   // run internal self-checks
    ..addFlag('help', abbr: 'h', negatable: false);

  // encode/decode options
  (p.commands['encode']!
    ..addOption('codec',
        allowed: ['csv', 'fixed', 'decimal', 'raw'],
        defaultsTo: 'decimal',
        help: 'Choose output format.')
    ..addOption('len',
        help: 'Required for --codec=raw decode counterpart (informational).'))
  ;
  (p.commands['decode']!
    ..addOption('codec',
        allowed: ['csv', 'fixed', 'decimal', 'raw'],
        defaultsTo: 'decimal',
        help: 'Choose input format.')
    ..addOption('len',
        help: 'Required length for RAW decoding.'))
  ;

  // add / cs
  (p.commands['add']!
    ..addOption('mode',
        allowed: ['canonical', 'balanced', 'cyclic'],
        defaultsTo: 'canonical'))
  ;
  (p.commands['cs']!); // no options

  // energy
  (p.commands['energy']!
    ..addFlag('k', help: 'Use K-units instead of SE9 (default SE9).'))
  ;

  // couplers
  (p.commands['couplers']!
    ..addOption('n', defaultsTo: '10')
    ..addOption('tau0', defaultsTo: '1.0')
    ..addOption('alpha', defaultsTo: '1.0'))
  ;

  // moves
  (p.commands['moves']!
    ..addOption('seq',
        abbr: 's',
        help: 'Sequence like: "U R F\' D2".'))
  ;

  // project
  (p.commands['project']!
    ..addFlag('radial', help: 'Show L1 radial bins.')
    ..addOption('drop',
        allowed: ['x', 'y', 'z'],
        help: 'Drop one axis and bucket by the other two.')
    ..addFlag('coarse-faces',
        help: 'Group by exposure (faces) count.'))
  ;

  // mapping
  (p.commands['mapping']!
    ..addOption('mode',
        allowed: ['conventional', 'harmonic'],
        defaultsTo: 'conventional'))
  ;

  ArgResults args;
  try {
    args = p.parse(argv);
  } catch (e) {
    _usage(p, error: e.toString());
    exit(64);
  }

  if (args['help'] as bool || args.command == null) {
    _usage(p);
    return;
  }

  switch (args.command!.name) {
    case 'encode':
      _encode(args.command!);
      break;
    case 'decode':
      _decode(args.command!);
      break;
    case 'add':
      _add(args.command!);
      break;
    case 'cs':
      _cs(args.command!);
      break;
    case 'energy':
      _energy(args.command!);
      break;
    case 'couplers':
      _couplers(args.command!);
      break;
    case 'moves':
      _moves(args.command!);
      break;
    case 'project':
      _project(args.command!);
      break;
    case 'mapping':
      _mapping(args.command!);
      break;
    case 'validate':
      final ok = runAllSelfChecks();
      stdout.writeln(ok ? '✅ validate: OK' : '❌ validate: FAILED');
      exit(ok ? 0 : 1);
    default:
      _usage(p);
      exit(64);
  }
}

void _encode(ArgResults a) {
  final codec = a['codec'] as String;
  if (a.rest.isEmpty) {
    stderr.writeln('encode --codec <$codec> <word>');
    exit(64);
  }
  final w = a.rest.first;

  switch (codec) {
    case 'csv':
      final s = encodeCsv(w);
      if (s == null) _bad('invalid word'); stdout.writeln(s);
      break;
    case 'fixed':
      final s = encodeFixed(w);
      if (s == null) _bad('invalid word'); stdout.writeln(s);
      break;
    case 'decimal':
      final s = encodeDecimal(w);
      if (s == null) _bad('invalid word'); stdout.writeln(s);
      break;
    case 'raw':
      final n = encodeBigIntRaw(w);
      if (n == null) _bad('invalid word');
      final len = stringToDigits(w)!.length;
      stdout.writeln('$n (len=$len)');
      break;
  }
}

void _decode(ArgResults a) {
  final codec = a['codec'] as String;
  if (a.rest.isEmpty) {
    stderr.writeln('decode --codec <$codec> <payload>');
    exit(64);
  }
  final s = a.rest.first;
  switch (codec) {
    case 'csv':
      final out = decodeCsv(s);
      if (out == null) _bad('invalid CSV'); stdout.writeln(out);
      break;
    case 'fixed':
      final out = decodeFixed(s);
      if (out == null) _bad('invalid fixed numeric'); stdout.writeln(out);
      break;
    case 'decimal':
      final out = decodeDecimal(s);
      if (out == null) _bad('invalid decimal'); stdout.writeln(out);
      break;
    case 'raw':
      final lenStr = a['len'] as String?;
      if (lenStr == null) _bad('--len is required for raw decoding');
      final len = int.tryParse(lenStr) ?? _bad('--len must be an integer');
      final n = BigInt.tryParse(s) ?? _bad('invalid BigInt');
      final out = decodeBigIntRaw(n, length: len);
      if (out == null) _bad('raw decode failed (length mismatch?)');
      stdout.writeln(out);
      break;
  }
}

void _add(ArgResults a) {
  final mode = a['mode'] as String;
  if (a.rest.length != 2) {
    stderr.writeln('add --mode <$mode> <a> <b>');
    exit(64);
  }
  final x = a.rest[0], y = a.rest[1];
  String? res;
  switch (mode) {
    case 'canonical':
      res = add27(x, y);
      break;
    case 'balanced':
      res = add27Balanced(x, y);
      break;
    case 'cyclic':
      res = add27Cyclic(x, y);
      break;
  }
  if (res == null) _bad('invalid base-27 word');
  stdout.writeln(res);
}

void _cs(ArgResults a) {
  if (a.rest.length != 3) {
    stderr.writeln('cs <a> <b> <c>');
    exit(64);
  }
  final r = add27CarrySave3(a.rest[0], a.rest[1], a.rest[2]);
  if (r == null) _bad('invalid base-27 word');
  final finished = csFinish(r.sum, r.carry);
  stdout.writeln('sum=${r.sum} carry=${r.carry} final=${finished ?? "ERR"}');
}

void _energy(ArgResults a) {
  if (a.rest.isEmpty) {
    stderr.writeln('energy <word> [--k]');
    exit(64);
  }
  final w = a.rest.first;
  final useK = a['k'] as bool;
  final e = useK ? wordEnergyK(w) : wordEnergy9(w);
  if (e == null) _bad('invalid base-27 word');
  stdout.writeln(e);
}

void _couplers(ArgResults a) {
  final n = int.tryParse(a['n'] as String) ?? 10;
  final tau0 = double.tryParse(a['tau0'] as String) ?? 1.0;
  final alpha = double.tryParse(a['alpha'] as String) ?? 1.0;
  final p = CouplerParams(tau0: tau0, alpha: alpha);
  final top = rankTopCouplers(p, n);
  stdout.writeln('Top $n couplers (tau0=$tau0, alpha=$alpha):');
  for (final t in top) {
    stdout.writeln(
        'pos=${t.pos}  L=${t.L}  faces=${t.faces}  C=${t.C.toStringAsFixed(6)}');
  }
}

void _moves(ArgResults a) {
  final seqStr = (a['seq'] as String?) ?? (a.rest.isNotEmpty ? a.rest.join(' ') : '');
  if (seqStr.trim().isEmpty) {
    stderr.writeln("moves --seq \"U R F' D2\"");
    exit(64);
  }
  final seq = _parseMoves(seqStr);
  final perm = _permutationForMany(seq);
  stdout.writeln('Permutation (oldIndex -> newIndex):');
  stdout.writeln(perm);

  final data = List<int>.generate(27, (i) => i);
  applyPerm<int>(data, perm);
  stdout.writeln('Applied to [0..26]:');
  stdout.writeln(data);
}

void _project(ArgResults a) {
  if (a['radial'] as bool) {
    final r = radialBins();
    for (final k in [0, 1, 2, 3]) {
      stdout.writeln('L1=$k -> ${r[k]?.length ?? 0} points');
    }
    return;
  }
  if (a['coarse-faces'] as bool) {
    final c = coarseGrain<int>((v) =>
    ((v.x != 0) ? 1 : 0) + ((v.y != 0) ? 1 : 0) + ((v.z != 0) ? 1 : 0));
    for (final k in [0, 1, 2, 3]) {
      stdout.writeln('faces=$k -> ${c[k]?.length ?? 0} points');
    }
    return;
  }
  final drop = a['drop'] as String?;
  if (drop == null) {
    stderr.writeln('project --radial | --coarse-faces | --drop <x|y|z>');
    exit(64);
  }
  final buckets = dropAxis(drop);
  for (final entry in buckets.entries) {
    stdout.writeln('key=${entry.key} count=${entry.value.length}');
  }
}

void _mapping(ArgResults a) {
  final mode = a['mode'] as String;
  final m = generateExposureMapping(mode: mode);
  stdout.writeln('symbol,faces,side');
  for (final e in m.entries) {
    stdout.writeln('${e.key},${e.value.$1},${e.value.$2}');
  }
}

List<FaceMove> _parseMoves(String s) {
  Face faceOf(String t) => switch (t) {
    'U' => Face.U,
    'D' => Face.D,
    'L' => Face.L,
    'R' => Face.R,
    'F' => Face.F,
    'B' => Face.B,
    _ => throw FormatException('Unknown face "$t"'),
  };
  int qTurns(String suffix) => suffix == '2' ? 2 : (suffix == "'" ? -1 : 1);
  final out = <FaceMove>[];
  for (final raw in s.split(RegExp(r'\s+'))) {
    if (raw.isEmpty) continue;
    final face = faceOf(raw[0]);
    final t = qTurns(raw.substring(1));
    out.add(FaceMove(face, t));
  }
  return out;
}

List<int> _permutationForMany(List<FaceMove> seq) {
  var perm = List<int>.generate(27, (i) => i);
  for (final m in seq) {
    final p = permutationFor(m);
    final tmp = List<int>.from(perm);
    for (var i = 0; i < perm.length; i++) {
      perm[i] = p[tmp[i]];
    }
  }
  return perm;
}

Never _bad(String msg) {
  stderr.writeln('Error: $msg');
  exit(64);
}

void _usage(ArgParser p, {String? error}) {
  if (error != null) stderr.writeln('Error: $error\n');
  stdout.writeln('''
livnium — CLI for Livnium Core

Usage:
  livnium encode   --codec <csv|fixed|decimal|raw> <word>
  livnium decode   --codec <csv|fixed|decimal|raw> <payload> [--len N]
  livnium add      --mode <canonical|balanced|cyclic> <a> <b>
  livnium cs       <a> <b> <c>
  livnium energy   <word> [--k]
  livnium couplers [--n 10] [--tau0 1.0] [--alpha 1.0]
  livnium moves    --seq "U R F' D2"
  livnium project  --radial | --coarse-faces | --drop <x|y|z>
  livnium mapping  [--mode conventional|harmonic]
  livnium validate

Examples:
  livnium encode --codec decimal livnium
  livnium decode --codec raw 123456 --len 5
  livnium add --mode balanced love love
  livnium energy a0rsw --k
  livnium couplers --n 5 --alpha 1.5
  livnium project --drop z
''');
}
