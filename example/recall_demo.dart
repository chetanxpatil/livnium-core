import 'package:livnium_core/livnium_core.dart';
import 'package:livnium_core/src/potts.dart';

void main() {
  final patterns = [
    List.generate(27, (i) => i % Potts27.q),
    List.filled(27, 3),
    List.generate(27, (i) => (i * 2) % Potts27.q),
  ];

  final netGeom = Potts27.cube();
  netGeom.buildFromCouplers(
    params: CouplerParams(tau0: 1, alpha: 1),
    kernel: cosKernel,
    targetNorm: 0.5,
  );
  netGeom.store(patterns, blend: 0.5);

  final netFlat = Potts27.cube();
  netFlat.buildFromCouplers(
    params: CouplerParams(tau0: 1, alpha: 1),
    kernel: cosKernel,
    targetNorm: 0.5,
    geoMix: 0,
  );
  netFlat.store(patterns, blend: 1.0);

  final coords = cube3Coords().toList();
  final target = patterns[0];
  final noisy = List<int>.from(target);
  for (var i = 0; i < coords.length; i++) {
    if (coords[i].z == 1) {
      noisy[i] = (noisy[i] + 1) % Potts27.q;
    }
  }

  for (var i = 0; i < netGeom.n; i++) {
    netGeom.s[i] = noisy[i];
    netFlat.s[i] = noisy[i];
  }

  netGeom.relax();
  netFlat.relax();

  int correct(List<int> s) {
    var c = 0;
    for (var i = 0; i < target.length; i++) {
      if (s[i] == target[i]) c++;
    }
    return c;
  }

  final geomCorrect = correct(netGeom.s);
  final flatCorrect = correct(netFlat.s);

  print('Geom correct: $geomCorrect / ${target.length}');
  print('Flat correct: $flatCorrect / ${target.length}');
}
