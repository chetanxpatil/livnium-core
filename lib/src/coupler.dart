library;

import 'dart:math';
import 'grid.dart'; // exposes facesForVec3(Vec3) and cube3Coords()
import 'vec3.dart';

/// Tunable parameters for the coupling model.
class CouplerParams {
  /// Overall amplitude (acts like a gain knob).
  final double tau0;

  /// Path-loss exponent applied to the L1 distance.
  /// alpha = 1 → 1/L
  /// alpha = 2 → 1/L^2, etc.
  final double alpha;

  const CouplerParams({this.tau0 = 1.0, this.alpha = 1.0});
}

/// Manhattan (L1) distance from the core (0,0,0).
/// We special-case the core to return 0 without adding branch cost.
int _l1(Vec3 v) =>
    v == const Vec3(0, 0, 0) ? 0 : v.x.abs() + v.y.abs() + v.z.abs();

/// Coupling magnitude for a position v under parameters p.
///
/// Formula:
///   C(v) = tau0 * (10.125 / faces(v)) / (L1(v))^alpha
///
/// Where:
///   - 10.125 is your equilibrium constant (corner + edge + face terms).
///   - faces(v) is exposure count: 3 for corners, 2 for edges, 1 for face centers,
///     0 only for the core (which we exclude).
///   - L1(v) is the Manhattan distance from core.
///   - alpha controls how fast the signal decays with distance.
///
/// Notes:
///   - Core is excluded (returns 0.0) since faces = 0.
///   - We guard L=0 to avoid division by zero (though faces==0 case early-returns).
double couplingAt(Vec3 v, CouplerParams p) {
  final faces = facesForVec3(v); // 3,2,1 for non-core; 0 for core
  if (faces <= 0) return 0.0;    // no coupling defined for the core
  final L = _l1(v);              // 1..3 for the 26 non-core points in {-1,0,1}^3
  final base = 10.125 / faces;   // exposure weighting (corner < edge < face)
  final loss = pow(L.toDouble(), p.alpha); // path-loss
  return p.tau0 * base / (loss == 0 ? 1.0 : loss);
}

/// Rank top-N non-core couplers by descending coupling magnitude.
/// Returns records with:
///   - pos   : grid coordinate
///   - C     : coupling magnitude
///   - L     : L1 distance
///   - faces : exposure class (3/2/1)
List<(Vec3 pos, double C, int L, int faces)> rankTopCouplers(
    CouplerParams p,
    int topN,
    ) {
  final items = <(Vec3, double, int, int)>[];

  for (final v in cube3Coords()) {
    if (v == const Vec3(0, 0, 0)) continue; // skip core
    final faces = facesForVec3(v);
    if (faces <= 0) continue;               // defensive
    final L = _l1(v);
    final C = couplingAt(v, p);
    items.add((v, C, L, faces));
  }

  // Sort by magnitude descending. If you want stable ordering among ties,
  // add a tiebreaker (e.g., L ascending, faces descending, lexicographic pos).
  items.sort((a, b) => b.$2.compareTo(a.$2));

  return items.take(topN).toList(growable: false);
}

/// Sum a set of phasors given in polar form (magnitude, phase in degrees),
/// and return the magnitude of the resultant vector.
/// Useful to see interference/constructive addition across positions.
double complexSumMagnitude(List<(double mag, double phaseDeg)> terms) {
  double xr = 0, xi = 0;
  for (final t in terms) {
    final rad = t.$2 * pi / 180.0;
    xr += t.$1 * cos(rad);
    xi += t.$1 * sin(rad);
  }
  return sqrt(xr * xr + xi * xi);
}
