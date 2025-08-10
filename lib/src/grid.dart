library;

import 'vec3.dart';

/// Iterate all integer coords in {-1,0,1}^3 (27 points).
Iterable<Vec3> cube3Coords() sync* {
  for (var x = -1; x <= 1; x++) {
    for (var y = -1; y <= 1; y++) {
      for (var z = -1; z <= 1; z++) {
        yield Vec3(x, y, z);
      }
    }
  }
}

/// Exposure == how many axes are non-zero:
/// 0 → core, 1 → face center, 2 → edge, 3 → corner.
int exposure(Vec3 v) =>
    (v.x != 0 ? 1 : 0) + (v.y != 0 ? 1 : 0) + (v.z != 0 ? 1 : 0);

/// Classification helpers built off [exposure].
bool isCore(Vec3 v)   => exposure(v) == 0;
bool isCenter(Vec3 v) => exposure(v) == 1;
bool isEdge(Vec3 v)   => exposure(v) == 2;
bool isCorner(Vec3 v) => exposure(v) == 3;

/// Backwards-compatible name: number of visible faces for that position.
/// (Same as exposure; returns -1 only if something is off-grid.)
int facesForVec3(Vec3 v) {
  final e = exposure(v);
  return (e >= 0 && e <= 3) ? e : -1;
}

/// Optional geometry helpers you’ll likely use elsewhere.
int l1(Vec3 v) => v.x.abs() + v.y.abs() + v.z.abs();                       // Manhattan
int linf(Vec3 v) => [v.x.abs(), v.y.abs(), v.z.abs()].reduce((a, b) => a > b ? a : b); // Chebyshev
double l2(Vec3 v) => (v.x * v.x + v.y * v.y + v.z * v.z).toDouble().sqrt();

extension on double {
  double sqrt() => MathSqrt(this);
}

// Minimal local sqrt to avoid pulling in dart:math everywhere else.
// If you already import 'dart:math' somewhere, replace with sqrt(x).
double MathSqrt(double x) {
  // Newton–Raphson for a couple of iterations (good enough for small ints)
  if (x <= 0) return 0.0;
  double r = x;
  for (int i = 0; i < 8; i++) r = 0.5 * (r + x / r);
  return r;
}

/// Convenience: filtered lists (non-alloc heavy if you reuse results).
List<Vec3> corePoints()   => cube3Coords().where(isCore).toList();
List<Vec3> centers()      => cube3Coords().where(isCenter).toList();
List<Vec3> edges()        => cube3Coords().where(isEdge).toList();
List<Vec3> corners()      => cube3Coords().where(isCorner).toList();

/// Quick invariants. Call from a demo/test to guard regressions.
void selfTestGrid() {
  final pts = cube3Coords().toList();
  print('Total points: ${pts.length}');
  assert(pts.length == 27);

  final c0 = pts.where(isCore).length;
  final c1 = pts.where(isCenter).length;
  final c2 = pts.where(isEdge).length;
  final c3 = pts.where(isCorner).length;

  print('Core: $c0, Centers: $c1, Edges: $c2, Corners: $c3');
  assert(c0 == 1 && c1 == 6 && c2 == 12 && c3 == 8);

  // Exposure agrees with facesForVec3 for all points.
  for (final v in pts) {
    final f1 = facesForVec3(v);
    final f2 = exposure(v);
    if (f1 != f2) {
      print('Mismatch at $v → facesForVec3=$f1, exposure=$f2');
    }
    assert(f1 == f2);
  }
  print('Exposure mapping OK.');

  // L1 shells sanity (0,1,2,3).
  final byL1 = <int, int>{};
  for (final v in pts) {
    final r = l1(v);
    byL1[r] = (byL1[r] ?? 0) + 1;
  }
  print('L1 shell counts: $byL1');
  assert(byL1[0] == 1 && byL1[1] == 6 && byL1[2] == 12 && byL1[3] == 8);

  print('✅ selfTestGrid passed all invariants.');
}
