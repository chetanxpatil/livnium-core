#!/usr/bin/env dart
import 'dart:io';
import 'package:args/args.dart';
import 'package:livnium_core/livnium_core.dart';

void main(List<String> argv) {
  final parser = ArgParser()
    ..addCommand('from-dec') // decimal -> base27
    ..addCommand('to-dec')   // base27 -> decimal
    ..addCommand('energy')   // word energy (SE9 default, or --k)
    ..addCommand('couplers') // list top-N couplers
    ..addCommand('moves')    // apply face-move sequence
    ..addCommand('validate') // run internal invariants
    ..addFlag('help', abbr: 'h', negatable: false);

  // Command-specific options
  (parser.commands['energy']!
    ..addFlag('k', help: 'Use K-units instead of SE9 (default SE9).'))
  ;
  (parser.commands['couplers']!
    ..addOption('n', defaultsTo: '10', help: 'Top N results.')
    ..addOption('tau0', defaultsTo: '1.0')
    ..addOption('alpha', defaultsTo: '1.0'))
  ;
  (parser.commands['moves']!
    ..addOption('seq',
        abbr: 's',
        help: 'Sequence like: "U R F\' D2". Returns permutation and example.'))
  ;

  ArgResults args;
  try {
    args = parser.parse(argv);
  } catch (e) {
    _usage(parser, error: e.toString());
    exit(64);
  }

  if (args['help'] as bool || args.command == null) {
    _usage(parser);
    return;
  }

  switch (args.command!.name) {
    case 'from-dec':
      _cmdFromDec(args.command!);
      break;
    case 'to-dec':
      _cmdToDec(args.command!);
      break;
    case 'energy':
      _cmdEnergy(args.command!);
      break;
    case 'couplers':
      _cmdCouplers(args.command!);
      break;
    case 'moves':
      _cmdMoves(args.command!);
      break;
    case 'validate':
      final ok = runAllSelfChecks();
      stdout.writeln(ok ? '✅ validate: OK' : '❌ validate: FAILED');
      exit(ok ? 0 : 1);
    default:
      _usage(parser);
      exit(64);
  }
}

void _cmdFromDec(ArgResults a) {
  if (a.rest.isEmpty) {
    stderr.writeln('from-dec <integer-decimal>');
    exit(64);
  }
  final n = BigInt.tryParse(a.rest.first);
  if (n == null || n.isNegative) {
    stderr.writeln('from-dec: provide a non-negative integer.');
    exit(64);
  }
  stdout.writeln(fromDecimal(n));
}

void _cmdToDec(ArgResults a) {
  if (a.rest.isEmpty) {
    stderr.writeln('to-dec <base27-word>');
    exit(64);
  }
  final s = a.rest.first;
  final n = toDecimal(s);
  if (n == null) {
    stderr.writeln('to-dec: invalid base-27 word.');
    exit(64);
  }
  stdout.writeln(n);
}

void _cmdEnergy(ArgResults a) {
  if (a.rest.isEmpty) {
    stderr.writeln('energy <base27-word> [--k]');
    exit(64);
  }
  final w = a.rest.first;
  final useK = a['k'] as bool;
  final e = useK ? wordEnergyK(w) : wordEnergy9(w);
  if (e == null) {
    stderr.writeln('energy: invalid base-27 word.');
    exit(64);
  }
  stdout.writeln(e);
}

void _cmdCouplers(ArgResults a) {
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

void _cmdMoves(ArgResults a) {
  final seqStr = (a['seq'] as String?) ?? (a.rest.isNotEmpty ? a.rest.join(' ') : '');
  if (seqStr.trim().isEmpty) {
    stderr.writeln("moves --seq \"U R F' D2\"");
    exit(64);
  }
  final seq = _parseMoves(seqStr);
  final perm = permutationForMany(seq);
  stdout.writeln('Permutation (oldIndex -> newIndex):');
  stdout.writeln(perm);

  // Demonstrate on [0..26]
  final data = List<int>.generate(27, (i) => i);
  applyPerm<int>(data, perm);
  stdout.writeln('Applied to [0..26]:');
  stdout.writeln(data);
}

List<FaceMove> _parseMoves(String s) {
  Face faceOf(String t) {
    switch (t) {
      case 'U':
        return Face.U;
      case 'D':
        return Face.D;
      case 'L':
        return Face.L;
      case 'R':
        return Face.R;
      case 'F':
        return Face.F;
      case 'B':
        return Face.B;
      default:
        throw FormatException('Unknown face "$t"');
    }
  }

  int qTurns(String suffix) {
    if (suffix == "2") return 2;
    if (suffix == "'") return -1;
    return 1;
  }

  final out = <FaceMove>[];
  for (final raw in s.split(RegExp(r'\s+'))) {
    if (raw.isEmpty) continue;
    final token = raw.trim();
    final face = faceOf(token[0]);
    final suf = token.substring(1);
    final t = qTurns(suf);
    out.add(FaceMove(face, t));
  }
  return out;
}

// Compose permutations for multiple moves
List<int> permutationForMany(List<FaceMove> seq) {
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

void _usage(ArgParser p, {String? error}) {
  if (error != null) {
    stderr.writeln('Error: $error\n');
  }
  stdout.writeln('''
livnium — CLI for Livnium Core

Usage:
  livnium from-dec <decimal>
  livnium to-dec <base27-word>
  livnium energy <base27-word> [--k]
  livnium couplers [--n 10] [--tau0 1.0] [--alpha 1.0]
  livnium moves --seq "U R F' D2"
  livnium validate
''');
}
