library;

import 'grid.dart';
import 'rotation.dart';
import 'vec3.dart';

/// Faces of the 3x3x3 cube using standard Rubik notation.
enum Face { U, D, L, R, F, B }

/// Represents a quarter-turn move on a face.
class FaceMove {
  final Face face;
  final int quarterTurns; // \pm1,\pm2,\pm3
  const FaceMove(this.face, this.quarterTurns);
}

// Pre-computed coordinate list and reverse lookup.
final List<Vec3> _coords = cube3Coords().toList(growable: false);
final Map<Vec3, int> _coordIndex = {
  for (var i = 0; i < _coords.length; i++) _coords[i]: i,
};

/// Return a 27-long permutation mapping oldIndex -> newIndex for this move.
List<int> permutationFor(FaceMove m) {
  final perm = List<int>.generate(_coords.length, (i) => i);
  final t = ((m.quarterTurns % 4) + 4) % 4;
  if (t == 0) return perm;

  bool Function(Vec3) select;
  Vec3 Function(Vec3) rot;

  switch (m.face) {
    case Face.U:
      select = (v) => v.z == 1;
      rot = rotateZ;
      break;
    case Face.D:
      select = (v) => v.z == -1;
      rot = rotateZ;
      break;
    case Face.R:
      select = (v) => v.x == 1;
      rot = rotateX;
      break;
    case Face.L:
      select = (v) => v.x == -1;
      rot = rotateX;
      break;
    case Face.F:
      select = (v) => v.y == 1;
      rot = rotateY;
      break;
    case Face.B:
      select = (v) => v.y == -1;
      rot = rotateY;
      break;
  }

  for (var i = 0; i < _coords.length; i++) {
    final v = _coords[i];
    if (select(v)) {
      var p = v;
      for (var k = 0; k < t; k++) {
        p = rot(p);
      }
      final j = _coordIndex[p]!;
      perm[i] = j;
    }
  }
  return perm;
}

/// Apply a permutation to a symbol array (in-place).
void applyPerm<T>(List<T> symbols, List<int> perm) {
  if (symbols.length != perm.length) {
    throw ArgumentError('symbols and perm must have same length');
  }
  final tmp = List<T>.from(symbols);
  for (var i = 0; i < perm.length; i++) {
    symbols[perm[i]] = tmp[i];
  }
}

/// Convenience: apply a sequence of face moves.
void applyMoves(List<int> symbols, List<FaceMove> seq) {
  for (final m in seq) {
    final perm = permutationFor(m);
    applyPerm<int>(symbols, perm);
  }
}
