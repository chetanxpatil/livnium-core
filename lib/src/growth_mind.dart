import 'dart:collection';
import 'dart:math';

import 'bell_pair.dart';
import 'conservation.dart';
import 'coordinates.dart';
import 'hebbian_learner.dart';
import 'lattice.dart';

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
  /// If A moves B and B is linked to C, C moves too; visited set prevents cycles.
  int _stabilize(LatticeCoord initialTrigger, int axis, int direction,
      {Random? random}) {
    final queue = Queue<_RotationEvent>();
    final visited = <LatticeCoord>{};
    var syncsFired = 0;

    queue.add(_RotationEvent(initialTrigger, axis, direction));
    visited.add(initialTrigger);

    while (queue.isNotEmpty) {
      final event = queue.removeFirst();

      for (final pair in _pairs) {
        if (pair.cellA != event.coord && pair.cellB != event.coord) continue;

        final partner = pair.cellA == event.coord ? pair.cellB : pair.cellA;
        if (visited.contains(partner)) continue;

        final didSync = pair.synchronize(
            state, event.coord, event.axis, event.direction,
            random: random);
        if (didSync) {
          syncsFired++;
          queue.add(_RotationEvent(partner, event.axis, -event.direction));
          visited.add(partner);
        }
      }
    }

    return syncsFired;
  }

  /// Records that [coords] were activated together (e.g. in one image). Used by Phase 5 learning.
  /// No-op if [learner] is null.
  void recordCoactivation(Iterable<LatticeCoord> coords) {
    _learner?.recordCoactivation(coords);
  }

  /// True if the lattice satisfies D2/D3 conservation (energy and class counts).
  bool get isSane => auditConservation(state);
}

class _RotationEvent {
  final LatticeCoord coord;
  final int axis;
  final int direction;
  _RotationEvent(this.coord, this.axis, this.direction);
}
