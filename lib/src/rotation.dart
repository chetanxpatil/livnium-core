library;

import 'vec3.dart';
export 'vec3.dart' show Vec3;

/// Right-hand-rule quarter turns. +90° around an axis follows the RH convention.
enum RotationAxis { x, y, z }

class Rotation {
  final RotationAxis axis;

  /// quarterTurns: ±1, ±2, ±3 (mod 4)
  final int quarterTurns;
  const Rotation(this.axis, this.quarterTurns);
}

Vec3 rotateX(Vec3 v) => Vec3(v.x, -v.z, v.y);
Vec3 rotateY(Vec3 v) => Vec3(v.z, v.y, -v.x);

/// Right-hand rule, +90°: (x, y, z) -> (-y, x, z)
Vec3 rotateZ(Vec3 v) => Vec3(-v.y, v.x, v.z);

Vec3 _applyOnce(Vec3 v, RotationAxis a) {
  switch (a) {
    case RotationAxis.x:
      return rotateX(v);
    case RotationAxis.y:
      return rotateY(v);
    case RotationAxis.z:
      return rotateZ(v);
  }
}

Vec3 applyRotations(Vec3 v, List<Rotation> seq) {
  var p = v;
  for (final r in seq) {
    final t = ((r.quarterTurns % 4) + 4) % 4;
    for (var i = 0; i < t; i++) {
      p = _applyOnce(p, r.axis);
    }
  }
  return p;
}

List<Rotation> invertRotations(List<Rotation> seq) => seq.reversed
    .map((r) => Rotation(r.axis, -r.quarterTurns))
    .toList(growable: false);
