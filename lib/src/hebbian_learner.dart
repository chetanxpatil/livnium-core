import 'coordinates.dart';

/// Phase 5 (Learning): Hebbian self-wiring — "cells that fire together wire together."
///
/// Records which coordinates are stimulated together (e.g. in the same image).
/// When correlation exceeds [threshold], [applyTo] invokes [createPair] for each pair so the
/// brain (e.g. [GrowthMind]) can create [BellPair]s. No direct dependency on [GrowthMind].
class HebbianLearner {
  /// Lattice dimension (same as [GrowthMind.state.n]) for reconstructing coords in [applyTo].
  final int n;

  /// Minimum co-occurrence count before creating a [BellPair].
  final int threshold;

  /// Strength = min(1.0, count * strengthScale). Use a value like 0.1–0.3 so a few dozen
  /// co-occurrences give strength near 1.0.
  final double strengthScale;

  final Map<String, int> _counts = {};
  final Map<String, List<int>> _keyToCoords =
      {}; // key -> [x1,y1,z1,x2,y2,z2] for applyTo

  HebbianLearner(this.n, {this.threshold = 3, this.strengthScale = 0.1}) {
    if (n <= 0 || n % 2 != 1) throw ArgumentError('n must be odd positive');
    if (threshold < 1) throw ArgumentError('threshold must be >= 1');
    if (strengthScale <= 0) throw ArgumentError('strengthScale must be > 0');
  }

  /// Canonical key for an unordered pair of coords so (a,b) and (b,a) map to the same entry.
  static String _key(LatticeCoord a, LatticeCoord b) {
    final first = [a.x, a.y, a.z];
    final second = [b.x, b.y, b.z];
    final cmp = first[0].compareTo(second[0]);
    if (cmp != 0) {
      if (cmp > 0) return _key(b, a);
    } else {
      final cy = first[1].compareTo(second[1]);
      if (cy != 0) {
        if (cy > 0) return _key(b, a);
      } else {
        final cz = first[2].compareTo(second[2]);
        if (cz > 0) return _key(b, a);
      }
    }
    return '${a.x},${a.y},${a.z}-${b.x},${b.y},${b.z}';
  }

  /// Records that all [coords] were activated together (e.g. in one image).
  /// For every unordered pair (A,B) in [coords] with A != B, increments the correlation count.
  void recordCoactivation(Iterable<LatticeCoord> coords) {
    final list = coords.toList();
    for (var i = 0; i < list.length; i++) {
      for (var j = i + 1; j < list.length; j++) {
        final a = list[i];
        final b = list[j];
        if (a == b) continue;
        if (a.n != n || b.n != n) continue;
        final k = _key(a, b);
        _counts[k] = (_counts[k] ?? 0) + 1;
        _keyToCoords[k] = [a.x, a.y, a.z, b.x, b.y, b.z];
      }
    }
  }

  /// For every pair whose count >= [threshold], calls [createPair](a, b, strength).
  /// Strength = min(1.0, count * strengthScale). Use with [GrowthMind]: e.g.
  /// `learner.applyTo((a, b, s) => mind.entangleConcepts(a, b, strength: s));`
  void applyTo(
      void Function(LatticeCoord a, LatticeCoord b, double strength)
          createPair) {
    for (final e in _counts.entries) {
      if (e.value < threshold) continue;
      final xs = _keyToCoords[e.key];
      if (xs == null || xs.length != 6) continue;
      final a = LatticeCoord(n, xs[0], xs[1], xs[2]);
      final b = LatticeCoord(n, xs[3], xs[4], xs[5]);
      final strength = (e.value * strengthScale).clamp(0.0, 1.0);
      createPair(a, b, strength);
    }
  }
}
