/// livnium_core ─ rotation.dart
/// --------------------------------
/// Quarter-turn helpers for integer cube coordinates.
///
/// * `Vec3` is immutable.
/// * Each `rotate?Quarter()` accepts an **optional int n**:
///   – positive  => clockwise (right-hand rule)
///   – negative  => counter-clockwise
///   – any value is reduced mod 4 so `n = 5` == `n = 1`.
///
/// All rotations keep the vector inside the -1 … +1 lattice.

library;

/// Simple 3-D integer vector.
class Vec3 {
  final int x, y, z;
  const Vec3(this.x, this.y, this.z);

  @override
  String toString() => '($x,$y,$z)';

  @override
  bool operator ==(Object other) =>
      other is Vec3 && x == other.x && y == other.y && z == other.z;

  @override
  int get hashCode => Object.hash(x, y, z);
}

/*──────────────────────── Private helpers ───────────────────────*/

/// Reduce any quarter-turn count to 0 … 3.
int _mod4(int n) => (n % 4 + 4) % 4;

/*──────────────────────── Public API ────────────────────────────*/

/// Rotate `v` around **X-axis** by *n* quarter turns (90° each).
Vec3 rotateXQuarter(Vec3 v, [int n = 1]) {
  switch (_mod4(n)) {
    case 0:  return v;
    case 1:  return Vec3(v.x, -v.z,  v.y);
    case 2:  return Vec3(v.x, -v.y, -v.z);
    case 3:  return Vec3(v.x,  v.z, -v.y);
    default: throw StateError('unreachable');
  }
}

/// Rotate `v` around **Y-axis** by *n* quarter turns.
Vec3 rotateYQuarter(Vec3 v, [int n = 1]) {
  switch (_mod4(n)) {
    case 0:  return v;
    case 1:  return Vec3( v.z, v.y, -v.x);
    case 2:  return Vec3(-v.x, v.y, -v.z);
    case 3:  return Vec3(-v.z, v.y,  v.x);
    default: throw StateError('unreachable');
  }
}

/// Rotate `v` around **Z-axis** by *n* quarter turns.
Vec3 rotateZQuarter(Vec3 v, [int n = 1]) {
  switch (_mod4(n)) {
    case 0:  return v;
    case 1:  return Vec3( v.y, -v.x, v.z);
    case 2:  return Vec3(-v.x, -v.y, v.z);
    case 3:  return Vec3(-v.y,  v.x, v.z);
    default: throw StateError('unreachable');
  }
}

/// Convenience: rotate on all three axes in order X→Y→Z.
Vec3 rotateXYZ(Vec3 v, {int x = 0, int y = 0, int z = 0}) =>
    rotateZQuarter(rotateYQuarter(rotateXQuarter(v, x), y), z);
