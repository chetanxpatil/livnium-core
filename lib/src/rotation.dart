/// lib/src/rotation.dart
/// ---------------------
/// Quarter-turn helpers for integer cube coordinates (-1, 0, 1).
///
/// * `Vec3` is immutable.
/// * All rotations are right-hand rule (looking down the axis toward origin):
///   – Positive quarter-turn = clockwise (CW)
///   – Negative quarter-turn = counter-clockwise (CCW)
/// * Any quarter-turn count is reduced mod 4:
///     n = 5  →  1 quarter-turn CW
///     n = -3 →  1 quarter-turn CCW
///
/// All rotations keep the vector inside the -1 … +1 lattice.

library;

/// 3-D integer vector representing a cubelet position.
class Vec3 {
  final int x, y, z;
  const Vec3(this.x, this.y, this.z)
      : assert(x >= -1 && x <= 1),
        assert(y >= -1 && y <= 1),
        assert(z >= -1 && z <= 1);

  @override
  String toString() => '($x,$y,$z)';

  @override
  bool operator ==(Object other) =>
      other is Vec3 && x == other.x && y == other.y && z == other.z;

  @override
  int get hashCode => Object.hash(x, y, z);
}

/// Direction for rotation (optional convenience).
enum Direction { cw, ccw }

/// Reduce any quarter-turn count to 0 … 3.
int _mod4(int n) => (n % 4 + 4) % 4;

/// Rotate around the **X-axis** by `n` quarter-turns.
Vec3 rotateXQuarter(Vec3 v, [int n = 1]) {
  switch (_mod4(n)) {
    case 0: return v;
    case 1: return Vec3(v.x, -v.z,  v.y);
    case 2: return Vec3(v.x, -v.y, -v.z);
    case 3: return Vec3(v.x,  v.z, -v.y);
    default: throw StateError('unreachable');
  }
}

/// Rotate around the **Y-axis** by `n` quarter-turns.
Vec3 rotateYQuarter(Vec3 v, [int n = 1]) {
  switch (_mod4(n)) {
    case 0: return v;
    case 1: return Vec3( v.z, v.y, -v.x);
    case 2: return Vec3(-v.x, v.y, -v.z);
    case 3: return Vec3(-v.z, v.y,  v.x);
    default: throw StateError('unreachable');
  }
}

/// Rotate around the **Z-axis** by `n` quarter-turns.
Vec3 rotateZQuarter(Vec3 v, [int n = 1]) {
  switch (_mod4(n)) {
    case 0: return v;
    case 1: return Vec3( v.y, -v.x, v.z);
    case 2: return Vec3(-v.x, -v.y, v.z);
    case 3: return Vec3(-v.y,  v.x, v.z);
    default: throw StateError('unreachable');
  }
}

/// Convenience: rotate sequentially on all three axes in order X→Y→Z.
///
/// Example:
/// ```dart
/// final v = Vec3(1, 1, -1);
/// final rotated = rotateXYZ(v, x: 1, y: 0, z: -1);
/// ```
Vec3 rotateXYZ(Vec3 v, {int x = 0, int y = 0, int z = 0}) =>
    rotateZQuarter(rotateYQuarter(rotateXQuarter(v, x), y), z);
