import 'coordinates.dart';

/// A4: Dynamic Law — 24-element Cubic Rotation Group. 90° quarter-turns about axes.
/// Bijective; preserves set of symbols and total weight.

/// Rotate (x,y,z) in range [0..n-1] by 90° around axis. Axis: 0=x, 1=y, 2=z.
/// Positive rotation by right-hand rule.
LatticeCoord rotateQuarter(LatticeCoord c, int axis, int turns) {
  final n = c.n;
  var x = c.x, y = c.y, z = c.z;
  turns = turns % 4;
  if (turns < 0) turns += 4;
  for (var t = 0; t < turns; t++) {
    switch (axis) {
      case 0: // about x: (x, y, z) -> (x, z, n-1-y)
        final ny = z;
        final nz = n - 1 - y;
        y = ny;
        z = nz;
        break;
      case 1: // about y: (x, y, z) -> (n-1-z, y, x)
        final nx = n - 1 - z;
        final nz = x;
        x = nx;
        z = nz;
        break;
      case 2: // about z: (x, y, z) -> (y, n-1-x, z)
        final nx = y;
        final ny = n - 1 - x;
        x = nx;
        y = ny;
        break;
      default:
        throw ArgumentError('axis must be 0, 1, or 2');
    }
  }
  return LatticeCoord(n, x, y, z);
}

/// Apply a rotation index in [0..23] (standard ordering of the 24 rotations).
LatticeCoord applyRotationIndex(LatticeCoord c, int index) {
  index = index % 24;
  if (index < 0) index += 24;
  // Decompose: 4 rotations about z * 2 flips (identity or 180 about x) * 3 choices of "up"
  final zTurns = index % 4;
  index ~/= 4;
  final flip = index % 2;
  index ~/= 2;
  final axis = index % 3;
  var r = c;
  if (flip == 1) r = rotateQuarter(r, 0, 2);
  r = rotateQuarter(r, 2, zTurns);
  if (axis == 1) r = rotateQuarter(r, 1, 1);
  if (axis == 2) r = rotateQuarter(r, 0, 1);
  return r;
}
