import 'dart:math' as math;

import 'package:test/test.dart';
import 'package:livnium_core/livnium_core.dart';
import 'package:livnium_core/src/potts.dart';

void main() {
  group('Potts with couplers', () {
    test('symmetry', () {
      final net = Potts27.cube();
      net.buildFromCouplers(
        params: CouplerParams(tau0: 1, alpha: 1),
        kernel: cosKernel,
        targetNorm: 0.5,
      );
      for (var i = 0; i < net.n; i++) {
        for (final j in net.nbrs[i]) {
          final wij = net.w[i][j];
          final wji = net.w[j][i];
          for (var k = 0; k < Potts27.q; k++) {
            for (var l = 0; l < Potts27.q; l++) {
              expect(
                wji[l * Potts27.q + k],
                closeTo(wij[k * Potts27.q + l], 1e-9),
              );
            }
          }
        }
      }
    });

    test('distance monotonicity', () {
      final net = Potts27.cube();
      net.buildFromCouplers(
        params: CouplerParams(tau0: 1, alpha: 1),
        kernel: cosKernel,
        targetNorm: 0.5,
      );
      final coords = cube3Coords().toList();
      final params = CouplerParams(tau0: 1, alpha: 1);
      final mags = <int, List<double>>{1: [], 2: [], 3: []};
      for (var i = 0; i < coords.length; i++) {
        final L = coords[i].x.abs() + coords[i].y.abs() + coords[i].z.abs();
        if (L == 0) continue;
        mags[L]!.add(couplingAt(coords[i], params));
      }
      double avg(List<double> xs) => xs.reduce((a, b) => a + b) / xs.length;
      final l1 = avg(mags[1]!);
      final l2 = avg(mags[2]!);
      final l3 = avg(mags[3]!);
      expect(l1 >= l2 && l2 >= l3, isTrue);
    });

    test('geometry aids recall', () {
      final patterns = [
        List.generate(27, (i) => i % Potts27.q),
        List.filled(27, 3),
        List.generate(27, (i) => (i * 2) % Potts27.q),
      ];

      Potts27 buildGeom() {
        final net = Potts27.cube();
        net.buildFromCouplers(
          params: CouplerParams(tau0: 1, alpha: 1),
          kernel: cosKernel,
          targetNorm: 0.5,
        );
        net.store(patterns, blend: 0.5);
        return net;
      }

      Potts27 buildFlat() {
        final net = Potts27.cube();
        net.buildFromCouplers(
          params: CouplerParams(tau0: 1, alpha: 1),
          kernel: cosKernel,
          targetNorm: 0.5,
          geoMix: 0,
        );
        net.store(patterns, blend: 1.0);
        return net;
      }

      final geom = buildGeom();
      final flat = buildFlat();

      final coords = cube3Coords().toList();
      final target = patterns[0];
      final noisy = List<int>.from(target);
      for (var i = 0; i < coords.length; i++) {
        if (coords[i].z == 1) {
          noisy[i] = (noisy[i] + 1) % Potts27.q;
        }
      }
      for (var i = 0; i < geom.n; i++) {
        geom.s[i] = noisy[i];
        flat.s[i] = noisy[i];
      }
      geom.relax();
      flat.relax();

      int correct(Potts27 net) {
        var c = 0;
        for (var i = 0; i < net.n; i++) {
          if (net.s[i] == target[i]) c++;
        }
        return c;
      }

      expect(correct(geom) >= correct(flat), isTrue);
    });
  });
}
