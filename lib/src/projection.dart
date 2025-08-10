library;

import 'grid.dart';
import 'vec3.dart';

/// Group points by dropping one axis. Key is a Dart record of the kept coords.
Map<(int, int), List<Vec3>> dropAxis(String axis) {
  final out = <(int, int), List<Vec3>>{};
  for (final v in cube3Coords()) {
    late (int, int) key;
    switch (axis) {
      case 'x':
        key = (v.y, v.z);
        break;
      case 'y':
        key = (v.x, v.z);
        break;
      case 'z':
        key = (v.x, v.y);
        break;
      default:
        throw ArgumentError("axis must be 'x'|'y'|'z'");
    }
    (out[key] ??= <Vec3>[]).add(v);
  }
  return out;
}

/// Radial bins by L1 distance from core: 0..3
Map<int, List<Vec3>> radialBins() {
  final out = <int, List<Vec3>>{};
  for (final v in cube3Coords()) {
    final L = v.x.abs() + v.y.abs() + v.z.abs();
    (out[L] ??= <Vec3>[]).add(v);
  }
  return out;
}

/// Coarse grain: group by arbitrary key function
Map<K, List<Vec3>> coarseGrain<K>(K Function(Vec3) keyFn) {
  final out = <K, List<Vec3>>{};
  for (final v in cube3Coords()) {
    final k = keyFn(v);
    (out[k] ??= <Vec3>[]).add(v);
  }
  return out;
}


