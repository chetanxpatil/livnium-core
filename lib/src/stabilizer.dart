import 'dart:collection';
import 'dart:math';

import 'bell_pair.dart';
import 'coordinates.dart';
import 'lattice.dart';

/// Phase 4 (Soul): propagates a rotation wave through the BellPair network.
///
/// When cell A is rotated, any partner B linked by a [BellPair] may anti-rotate.
/// That rotation is then treated as a new event, so B's partners (e.g. C) can move,
/// and so on. The wavefront continues until no new syncs occur (or cycles are
/// avoided via a visited set).
///
/// This is the "thinking loop": a chain reaction that forms an entire thought
/// from a single poke (holographic recall).
class Stabilizer {
  Stabilizer();

  /// Runs the propagation wave: [initialTrigger] has just been rotated on [axis]
  /// by [direction]. Applies synchronisation through [pairs] on [state] until
  /// the wavefront is done. Returns the number of BellPair syncs that fired.
  ///
  /// Optional [random] for probabilistic coupling; when null, each pair uses
  /// its default RNG.
  int propagate(
    LatticeState state,
    List<BellPair> pairs,
    LatticeCoord initialTrigger,
    int axis,
    int direction, {
    Random? random,
  }) {
    final queue = Queue<_RotationEvent>();
    final visited = <LatticeCoord>{};
    var syncsFired = 0;

    queue.add(_RotationEvent(initialTrigger, axis, direction));
    visited.add(initialTrigger);

    while (queue.isNotEmpty) {
      final event = queue.removeFirst();

      for (final pair in pairs) {
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
}

class _RotationEvent {
  final LatticeCoord coord;
  final int axis;
  final int direction;
  _RotationEvent(this.coord, this.axis, this.direction);
}
