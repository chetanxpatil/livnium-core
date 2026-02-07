import 'dart:math';

import 'bell_pair.dart';
import 'conservation.dart';
import 'coordinates.dart';
import 'hebbian_learner.dart';
import 'lattice.dart';
import 'stabilizer.dart';

/// Result of a single [GrowthMind.perceive] call: how many entanglements fired.
class PerceiveResult {
  /// Number of BellPairs that applied anti-rotation (sync fired).
  final int syncsFired;

  /// Number of BellPairs that included the triggered coordinate (sync possible).
  final int syncsPossible;

  const PerceiveResult({required this.syncsFired, required this.syncsPossible});
}

/// Phase 2 (Cognition): a cortex that holds a lattice state and concept entanglements.
///
/// * **Entanglement:** [entangleConcepts] links two coordinates with a [strength] in [0, 1].
/// * **Perception:** [perceive] applies a rotation at a coordinate and triggers all pairs
///   that contain it (deterministic or probabilistic by strength).
/// * **Sanity:** [isSane] is true when D2/D3 conservation holds.
class GrowthMind {
  final LatticeState state;
  final List<BellPair> _pairs = [];

  HebbianLearner? _learner;

  GrowthMind(int n) : state = LatticeState(n);

  /// Optional Hebbian learner for Phase 5 (self-wiring). When set, [recordCoactivation] is recorded here.
  HebbianLearner? get learner => _learner;
  set learner(HebbianLearner? value) => _learner = value;

  /// Registers an entanglement between [a] and [b] with [strength] in [0, 1].
  /// Strength 0 = isolation (no link); (0, 1) = probabilistic; 1 = full sync.
  void entangleConcepts(LatticeCoord a, LatticeCoord b,
      {double strength = 1.0}) {
    if (strength <= 0) return;
    _pairs.add(BellPair(a, b, couplingStrength: strength));
  }

  /// Applies a quarter-turn rotation at [coord] on [axis] by [direction],
  /// then runs the stabilizer: propagates the consequence through the BellPair
  /// network (A moves B, B moves C, …) until the wavefront is done.
  /// Optional [random] for probabilistic coupling.
  /// Returns [PerceiveResult] with total [PerceiveResult.syncsFired] from the wave.
  PerceiveResult perceive(LatticeCoord coord, int axis, int direction,
      {Random? random}) {
    state.applyRotationAt(coord, axis, direction);
    final fired = _stabilize(coord, axis, direction, random: random);
    return PerceiveResult(syncsFired: fired, syncsPossible: _pairs.length);
  }

  /// Propagates rotation events through the pair network (wavefront).
  /// Delegates to [Stabilizer] (Phase 4).
  int _stabilize(LatticeCoord initialTrigger, int axis, int direction,
      {Random? random}) {
    return Stabilizer().propagate(
        state, _pairs, initialTrigger, axis, direction,
        random: random);
  }

  /// Records that [coords] were activated together (e.g. in one image). Used by Phase 5 learning.
  /// No-op if [learner] is null.
  void recordCoactivation(Iterable<LatticeCoord> coords) {
    _learner?.recordCoactivation(coords);
  }

  /// True if the lattice satisfies D2/D3 conservation (energy and class counts).
  bool get isSane => auditConservation(state);

  /// Exports the current entanglements (BellPairs) to a JSON-serializable format.
  /// Use with [loadEntanglements] to save/load the trained model.
  List<Map<String, dynamic>> exportEntanglements() {
    return _pairs.map((p) {
      return <String, dynamic>{
        'ax': p.cellA.x,
        'ay': p.cellA.y,
        'az': p.cellA.z,
        'bx': p.cellB.x,
        'by': p.cellB.y,
        'bz': p.cellB.z,
        'strength': p.couplingStrength,
      };
    }).toList();
  }

  /// Loads entanglements from a list produced by [exportEntanglements].
  /// Does not clear existing pairs; use a fresh [GrowthMind] if you want only these pairs.
  void loadEntanglements(List<Map<String, dynamic>> pairs) {
    final n = state.n;
    for (final p in pairs) {
      final ax = p['ax'] as int? ?? (p['ax'] as num?)?.toInt();
      final ay = p['ay'] as int? ?? (p['ay'] as num?)?.toInt();
      final az = p['az'] as int? ?? (p['az'] as num?)?.toInt();
      final bx = p['bx'] as int? ?? (p['bx'] as num?)?.toInt();
      final by = p['by'] as int? ?? (p['by'] as num?)?.toInt();
      final bz = p['bz'] as int? ?? (p['bz'] as num?)?.toInt();
      final strength = (p['strength'] as num?)?.toDouble() ?? 1.0;
      if (ax == null ||
          ay == null ||
          az == null ||
          bx == null ||
          by == null ||
          bz == null) continue;
      entangleConcepts(
        LatticeCoord(n, ax, ay, az),
        LatticeCoord(n, bx, by, bz),
        strength: strength.clamp(0.0, 1.0),
      );
    }
  }

  /// Creates a new [GrowthMind] from an exported snapshot (e.g. from disk).
  /// [data] must contain "n" (int) and "pairs" (List of maps with ax,ay,az,bx,by,bz,strength).
  static GrowthMind fromExport(Map<String, dynamic> data) {
    final n = data['n'] as int? ?? (data['n'] as num?)?.toInt() ?? 3;
    final mind = GrowthMind(n);
    final pairs = data['pairs'] as List<dynamic>?;
    if (pairs != null && pairs.isNotEmpty) {
      mind.loadEntanglements(
        pairs.cast<Map<String, dynamic>>(),
      );
    }
    return mind;
  }
}
