import 'package:livnium_core/livnium_core.dart';

void main() {
  final p = CouplerParams(tau0: 1.0, alpha: 1.0);

  final top = rankTopCouplers(p, 10);
  print('Top couplers (tau0=${p.tau0}, alpha=${p.alpha}):');
  for (final t in top) {
    print('${t.pos}  L=${t.L}  faces=${t.faces}  C=${t.C.toStringAsFixed(4)}');
  }

  // Interference sweep between best two
  if (top.length >= 2) {
    final c1 = top[0].C;
    final c2 = top[1].C;
    print('\nInterference sweep (two strongest):');
    for (final deg in [0, 60, 120, 180, 240, 300]) {
      final mag = complexSumMagnitude([(c1, 0), (c2, deg.toDouble())]);
      print('Δφ=$deg°  |sum|=${mag.toStringAsFixed(4)}');
    }
  }
}
