library;

import 'dart:math' as math;

import 'grid.dart';
import 'vec3.dart';
import 'coupler.dart';

typedef SimilarityKernel = double Function(int k, int l);

double cosKernel(int k, int l) {
  const twoPiOver27 = 2 * math.pi / 27.0;
  final d = (k - l);
  return math.cos(twoPiOver27 * d);
}

/// Simple Potts-Hopfield network with 27 possible symbols per node.
class Potts27 {
  /// Number of possible symbols per node.
  static const int q = 27;

  /// Number of nodes in the network.
  final int n;

  /// Adjacency list: neighbors for each node.
  final List<List<int>> nbrs;

  /// Coupler weights: W[i][j][k*q + l] represents interaction between
  /// node i in state k and neighbor j in state l.
  final List<List<List<double>>> w;

  /// Local biases for each node/state.
  final List<List<double>> b;

  /// Current state (symbol index 0..26) for each node.
  final List<int> s;

  Potts27(this.n, this.nbrs)
    : w = List.generate(
        n,
        (_) => List.generate(n, (_) => List.filled(q * q, 0.0)),
      ),
      b = List.generate(n, (_) => List.filled(q, 0.0)),
      s = List.filled(n, 0);

  /// Factory that builds a 3×3×3 cube (27 nodes) with 6-neighborhoods.
  factory Potts27.cube() {
    final coords = cube3Coords().toList();
    final n = coords.length;
    final nbrs = List.generate(n, (_) => <int>[]);
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        if (i == j) continue;
        final d = coords[i].sub(coords[j]);
        final manhattan = d.x.abs() + d.y.abs() + d.z.abs();
        if (manhattan == 1) nbrs[i].add(j);
      }
    }
    return Potts27(n, nbrs);
  }

  void buildFromCouplers({
    required CouplerParams params,
    required SimilarityKernel kernel,
    required double targetNorm,
    double geoMix = 1.0,
  }) {
    for (var i = 0; i < n; i++) {
      for (final j in nbrs[i]) {
        final wij = w[i][j];
        for (var t = 0; t < wij.length; t++) {
          wij[t] = 0.0;
        }
      }
    }

    final coords = cube3Coords().toList();
    for (var i = 0; i < n; i++) {
      for (final j in nbrs[i]) {
        final gi = couplingAt(coords[i], params);
        final gj = couplingAt(coords[j], params);
        final G = geoMix * (gi < gj ? gi : gj);

        final wij = w[i][j];
        for (var k = 0; k < Potts27.q; k++) {
          for (var l = 0; l < Potts27.q; l++) {
            wij[k * Potts27.q + l] = G * kernel(k, l);
          }
        }
      }
    }

    for (var i = 0; i < n; i++) {
      for (final j in nbrs[i]) {
        final wij = w[i][j];
        final wji = w[j][i];
        for (var k = 0; k < Potts27.q; k++) {
          for (var l = 0; l < Potts27.q; l++) {
            wji[l * Potts27.q + k] = wij[k * Potts27.q + l];
          }
        }
      }
    }

    for (var i = 0; i < n; i++) {
      for (final j in nbrs[i]) {
        final wij = w[i][j];
        var norm2 = 0.0;
        for (final v in wij) {
          norm2 += v * v;
        }
        final norm = norm2 > 0 ? math.sqrt(norm2) : 0.0;
        final s = norm > 0 ? (targetNorm / norm) : 1.0;
        for (var t = 0; t < wij.length; t++) {
          wij[t] *= s;
        }
      }
    }
  }

  /// Hebbian storage of [patterns]. Each pattern is a list of length [n]
  /// with digits 0..26. After building Hebbian weights, they are symmetrized,
  /// scaled to [targetNorm], then blended with existing weights.
  void store(
    List<List<int>> patterns, {
    double scale = 0.3,
    double targetNorm = 0.4,
    double blend = 0.5,
  }) {
    final invN = scale / n;
    final wHebb = List.generate(
      n,
      (_) => List.generate(n, (_) => List.filled(q * q, 0.0)),
    );
    for (final p in patterns) {
      if (p.length != n) {
        throw ArgumentError('Pattern length ${p.length} != n=$n');
      }
      for (var i = 0; i < n; i++) {
        for (final j in nbrs[i]) {
          // Subtract baseline 1/q from all entries.
          final base = invN / q;
          final wij = wHebb[i][j];
          for (var idx = 0; idx < wij.length; idx++) {
            wij[idx] -= base;
          }
          // Add correlation for observed pair.
          final idx = p[i] * q + p[j];
          wij[idx] += invN;
        }
      }
    }

    // Symmetrize Hebbian weights.
    for (var i = 0; i < n; i++) {
      for (final j in nbrs[i]) {
        final wij = wHebb[i][j];
        final wji = wHebb[j][i];
        for (var k = 0; k < q; k++) {
          for (var l = 0; l < q; l++) {
            wji[l * q + k] = wij[k * q + l];
          }
        }
      }
    }

    // Scale each block to targetNorm.
    for (var i = 0; i < n; i++) {
      for (final j in nbrs[i]) {
        final wij = wHebb[i][j];
        var norm2 = 0.0;
        for (final v in wij) {
          norm2 += v * v;
        }
        final norm = norm2 > 0 ? math.sqrt(norm2) : 0.0;
        final s = norm > 0 ? (targetNorm / norm) : 1.0;
        for (var t = 0; t < wij.length; t++) {
          wij[t] *= s;
        }
      }
    }

    // Blend with existing weights.
    for (var i = 0; i < n; i++) {
      for (final j in nbrs[i]) {
        final wij = w[i][j];
        final hebb = wHebb[i][j];
        for (var t = 0; t < wij.length; t++) {
          wij[t] = (1 - blend) * wij[t] + blend * hebb[t];
        }
      }
    }
  }

  /// Set bias vectors for specific nodes.
  void setBias(Map<int, List<double>> biasByNode) {
    biasByNode.forEach((i, vec) {
      if (i < 0 || i >= n) return;
      if (vec.length != q) {
        throw ArgumentError('Bias vector length must be $q');
      }
      for (var k = 0; k < q; k++) {
        b[i][k] = vec[k];
      }
    });
  }

  /// Perform one asynchronous sweep. Returns `true` if any state changed.
  bool stepOnce() {
    var changed = false;
    for (var i = 0; i < n; i++) {
      final field = List<double>.from(b[i]);
      for (final j in nbrs[i]) {
        final sj = s[j];
        final wij = w[i][j];
        for (var k = 0; k < q; k++) {
          field[k] += wij[k * q + sj];
        }
      }
      var bestK = 0;
      var bestV = field[0];
      for (var k = 1; k < q; k++) {
        final v = field[k];
        if (v > bestV) {
          bestV = v;
          bestK = k;
        }
      }
      if (bestK != s[i]) {
        s[i] = bestK;
        changed = true;
      }
    }
    return changed;
  }

  /// Repeatedly call [stepOnce] until no changes or [maxIters] reached.
  void relax({int maxIters = 50}) {
    for (var t = 0; t < maxIters; t++) {
      if (!stepOnce()) break;
    }
  }
}
