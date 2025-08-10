import 'package:livnium_core/livnium_core.dart';

void main() {
  final p = CouplerParams(tau0: 1.0, alpha: 1.0);

  // Show top 10 strongest couplers
  final top = rankTopCouplers(p, 10);
  print('Top couplers (alpha=${p.alpha}):');
  for (final t in top) {
    print('pos=${t.$1}  C=${t.$2.toStringAsFixed(6)}  L=${t.$3}  faces=${t.$4}');
  }

  // Bucket by exposure to verify corner/edge/face magnitudes at L=1
  // (There are exactly 6 face centers, 12 edges, 8 corners in the shell L1=1..3.)
  final sample = <String, List<double>>{'F': [], 'E': [], 'C': []};
  for (final v in cube3Coords()) {
    if (v == const Vec3(0,0,0)) continue;
    final f = facesForVec3(v);
    final c = couplingAt(v, p);
    switch (f) {
      case 1: sample['F']!.add(c); break;
      case 2: sample['E']!.add(c); break;
      case 3: sample['C']!.add(c); break;
    }
  }
  double avg(List<double> xs) => xs.isEmpty ? 0 : xs.reduce((a,b)=>a+b)/xs.length;
  print('\nAverage C by class (alpha=${p.alpha}): '
      'F=${avg(sample['F']!).toStringAsFixed(6)}  '
      'E=${avg(sample['E']!).toStringAsFixed(6)}  '
      'C=${avg(sample['C']!).toStringAsFixed(6)}');

  // Phasor toy: assume all L=1 points (6 faces + 12 edges + 8 corners at L=1?)
  // Actually in {-1,0,1}^3: L1=1 → exactly 6 points (face centers).
  // Sum them with symmetric phases to show constructive/destructive behavior.
  final l1Faces = <(double,double)>[];
  for (final v in cube3Coords()) {
    if (v == const Vec3(0,0,0)) continue;
    if ((v.x.abs() + v.y.abs() + v.z.abs()) == 1) {
      final c = couplingAt(v, p);
      // spread phases for demo: 0°, 60°, 120°, ...
      final phase = 60.0 * l1Faces.length;
      l1Faces.add((c, phase));
    }
  }
  final R = complexSumMagnitude(l1Faces);
  print('\nPhasor sum over L1=1 face centers: |R|=${R.toStringAsFixed(6)}');
}
