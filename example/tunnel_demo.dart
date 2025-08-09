import 'dart:math' as math;
import 'package:livnium_core/src/tunnel.dart';

void main() {
  const tau0 = 1.0;            // base time step
  const fCore = 1.0;           // pick a core mode (1/tau0)
  const usePathLoss = true;    // flip to test per-face model

  // Scan harmonics k=1..3 and list strongest couplers.
  final results = <Map<String, Object>>[];
  for (final t in allTunnels()) {
    for (var k = 1; k <= 3; k++) {
      final fTunnel = t.freq(k, tau0);
      final amp = usePathLoss ? t.ampPathLoss() : t.ampPerFace();
      final c = coupling(fTunnel, fCore, amp);
      results.add({
        'coord': '(${t.x},${t.y},${t.z})',
        'L': t.L,
        'faces': t.faces,
        'k': k,
        'fTunnel': fTunnel,
        'coupling': c,
      });
    }
  }

  results.sort((a, b) =>
      (b['coupling'] as double).compareTo(a['coupling'] as double));

  print('Top couplers to fCore=$fCore (tau0=$tau0, '
      '${usePathLoss ? 'path-loss' : 'per-face'} model):');
  for (var i = 0; i < 10; i++) {
    final r = results[i];
    print('${r['coord']}  L=${r['L']}  faces=${r['faces']}  '
        'k=${r['k']}  f=${(r['fTunnel'] as double).toStringAsFixed(3)}  '
        'C=${(r['coupling'] as double).toStringAsFixed(4)}');
  }

  // Phase interference demo: pick two strongest and sweep phase difference.
  final a = results[0]['coupling'] as double;
  final b = results[1]['coupling'] as double;
  print('\nInterference sweep between top-2 couplers:');
  for (final deg in [0, 60, 120, 180, 240, 300]) {
    final phi = deg * math.pi / 180.0;
    final sum = sumAtCore([a, b], phases: [0.0, phi]);
    print('Δφ=$deg°  |sum|=${sum.toStringAsFixed(4)}');
  }
}

//
//
// double dist(Vec3 a, Vec3 b) {
//   final dx = (a.x - b.x).toDouble();
//   final dy = (a.y - b.y).toDouble();
//   final dz = (a.z - b.z).toDouble();
//   return Math.sqrt(dx*dx + dy*dy + dz*dz);
// }
//
// // For each coupler position r_j, choose φ_j = -k * |p - r_j|
// List<double> steerPhasesToTarget(List<Vec3> couplers, Vec3 target, {double k = 1.0}) {
//   return [
//     for (final r in couplers) -k * dist(target, r)
//   ];
// }
//
//
// double focusedAmplitude(
//     List<Vec3> couplers,
//     List<double> weights,   // e.g., 10.125/f for each coupler
//     List<double> phases,    // from steerPhasesToTarget
//     Vec3 target,
//     {double k = 1.0, double alpha = 1.0}
//     ) {
//   double re = 0, im = 0;
//   for (var j = 0; j < couplers.length; j++) {
//     final d = dist(target, couplers[j]);
//     final theta = k * d + phases[j];
//     final a = weights[j] / Math.pow(d == 0 ? 1 : d, alpha);
//     re += a * Math.cos(theta);
//     im += a * Math.sin(theta);
//   }
//   return Math.sqrt(re*re + im*im);
// }
