library;

import 'dart:math';
import 'grid.dart';
import 'vec3.dart';

class CouplerParams {
  final double tau0; // base amplitude
  final double alpha; // path-loss exponent for L1 distance
  const CouplerParams({this.tau0 = 1.0, this.alpha = 1.0});
}

/// L1 distance from core
int _l1(Vec3 v) =>
    v == const Vec3(0, 0, 0) ? 0 : v.x.abs() + v.y.abs() + v.z.abs();

/// Coupling magnitude: tau0 * (10.125/faces) / L^alpha
double couplingAt(Vec3 v, CouplerParams p) {
  final faces = facesForVec3(v);
  if (faces <= 0) return 0.0;
  final L = _l1(v);
  final base = 10.125 / faces;
  final loss = pow(L.toDouble(), p.alpha);
  return p.tau0 * base / (loss == 0 ? 1.0 : loss);
}

/// Rank top-N non-core couplers
List<(Vec3 pos, double C, int L, int faces)> rankTopCouplers(
  CouplerParams p,
  int topN,
) {
  final items = <(Vec3, double, int, int)>[];
  for (final v in cube3Coords()) {
    if (v == const Vec3(0, 0, 0)) continue;
    final faces = facesForVec3(v);
    if (faces <= 0) continue;
    final L = _l1(v);
    final C = couplingAt(v, p);
    items.add((v, C, L, faces));
  }
  items.sort((a, b) => b.$2.compareTo(a.$2));
  return items.take(topN).toList(growable: false);
}

/// Sum phasors given (magnitude, phaseDeg)
double complexSumMagnitude(List<(double mag, double phaseDeg)> terms) {
  double xr = 0, xi = 0;
  for (final t in terms) {
    final rad = t.$2 * pi / 180.0;
    xr += t.$1 * cos(rad);
    xi += t.$1 * sin(rad);
  }
  return sqrt(xr * xr + xi * xi);
}
