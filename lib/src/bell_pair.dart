import 'dart:math';

import 'coordinates.dart';
import 'lattice.dart';

/// Non-local coupling constraint between two cells (Livnium analogue of quantum entanglement).
///
/// A BellPair forces two distant cells to act as a single unit: when one is "rotated"
/// (content swapped along an axis by a quarter-turn), the partner is forced to undergo
/// the opposite rotation so that the combined operation conserves the D2 ledger
/// (zero-sum: +1 and -1 quarter-turns preserve total effective weight and class counts).
///
/// * **Cell A** and **Cell B** can be anywhere on the lattice (non-local).
/// * **Anti-synchronization:** If A rotates by +[direction] on [axis], B rotates by
///   -[direction] on the same axis (conservation of "spin" / angular momentum).
/// * **Coupling strength** in [0, 1]: 0 = no interaction (isolation); (0, 1) = probabilistic
///   sync with probability = strength; 1 = deterministic full anti-rotation.
class BellPair {
  final LatticeCoord cellA;
  final LatticeCoord cellB;

  /// Strength of the link in [0, 1]. 0 = no sync; (0, 1) = probabilistic; 1 = full sync.
  final double couplingStrength;

  static final Random _defaultRandom = Random();

  BellPair(this.cellA, this.cellB, {this.couplingStrength = 1.0}) {
    if (cellA.n != cellB.n) {
      throw ArgumentError(
          'BellPair cells must share the same lattice dimension n');
    }
    if (cellA == cellB) {
      throw ArgumentError('BellPair requires two distinct coordinates');
    }
    if (couplingStrength < 0 || couplingStrength > 1.0) {
      throw ArgumentError('couplingStrength must be in [0, 1]');
    }
  }

  /// Applies the quantum rule: anti-synchronization.
  /// When [trigger] is rotated by [direction] on [axis], the partner is rotated
  /// by [-direction] on the same axis (when coupling fires), preserving the D2 ledger.
  ///
  /// * Strength 0: no-op (isolation).
  /// * Strength in (0, 1): sync with probability [couplingStrength] (probabilistic thought).
  /// * Strength 1: always sync (deterministic entanglement).
  ///
  /// [trigger] must be either [cellA] or [cellB]; otherwise this is a no-op.
  /// [axis] must be 0, 1, or 2 (x, y, z). [direction] is quarter-turns (e.g. +1 or -1);
  /// normalized mod 4; direction == 0 (mod 4) is a no-op and returns false.
  /// Optional [random] for tests; defaults to shared [Random] for production.
  ///
  /// Returns true if anti-rotation was applied (sync fired); false on early exit.
  bool synchronize(
    LatticeState state,
    LatticeCoord trigger,
    int axis,
    int direction, {
    Random? random,
  }) {
    if (couplingStrength <= 0) return false;
    if (trigger != cellA && trigger != cellB) return false;
    if (axis < 0 || axis > 2) return false;
    var turns = direction % 4;
    if (turns < 0) turns += 4;
    if (turns == 0) return false;
    final r = random ?? _defaultRandom;
    if (couplingStrength < 1.0 && r.nextDouble() >= couplingStrength) {
      return false;
    }
    final partner = trigger == cellA ? cellB : cellA;
    final antiDirection = -direction;
    state.applyRotationAt(partner, axis, antiDirection);
    return true;
  }
}
