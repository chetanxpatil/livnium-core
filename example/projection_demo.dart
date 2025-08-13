import 'package:livnium_core/livnium_core.dart';

void main() {
  // Basic counts using public helpers
  final pts = cube3Coords().toList();
  final byExpo = <int, int>{};
  for (final v in pts) {
    final e = facesForVec3(v);
    byExpo[e] = (byExpo[e] ?? 0) + 1;
  }
  print('Coarse by faces:');
  for (final f in [3, 2, 1, 0]) {
    print('faces=$f -> ${byExpo[f] ?? 0}');
  }
  print('');

  // L1 / L∞ / L2 bins
  final byL1 = <int, int>{};
  final byLinf = <int, int>{};
  final byL2r = <String, int>{};
  for (final v in pts) {
    byL1[l1(v)] = (byL1[l1(v)] ?? 0) + 1;
    byLinf[linf(v)] = (byLinf[linf(v)] ?? 0) + 1;
    byL2r[l2(v).toStringAsFixed(0)] =
        (byL2r[l2(v).toStringAsFixed(0)] ?? 0) + 1;
  }
  print('Radial bins L1:');
  for (final r in [3, 2, 1, 0]) {
    print('L=$r -> ${byL1[r] ?? 0} points');
  }
  print('');

  print('Radial bins L∞ (Chebyshev):');
  for (final r in [1, 0]) {
    print('L∞=$r -> ${byLinf[r] ?? 0} points');
  }
  print('');

  print('Radial bins L2 (rounded):');
  for (final r in ['2', '1', '0']) {
    print('L2≈$r -> ${byL2r[r] ?? 0} points');
  }
  print('');

  // Projections and heatmaps now come from public 'projection.dart'
  void pretty(Map<(int, int), List<Vec3>> buckets, String label) {
    print('Slices after dropping $label:');
    for (final yy in [-1, 0, 1]) {
      for (final xx in [-1, 0, 1]) {
        final key = (xx, yy);
        final c = buckets[key]?.length ?? 0;
        print('key=(${key.$1}, ${key.$2})  count=$c');
      }
    }
    print('');
  }

  pretty(dropAxis('z'), 'Z');
  pretty(dropAxis('x'), 'X');
  pretty(dropAxis('y'), 'Y');
}
