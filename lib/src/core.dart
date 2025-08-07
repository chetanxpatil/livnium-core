/// livnium_core – core.dart
///
/// A one-stop façade that re-exports the main capabilities:
/// • encoding / decoding  (LivniumCodec)
/// • energy computation   (symbolicEnergy)
/// • rotation helpers     (rotateVec, Axis, Vec3)
///
/// Intended for client code that just wants “do everything” access via a
/// single import.

library;

import 'alphabet.dart';
import 'codec.dart' as codec;
import 'energy.dart';
import 'rotation.dart';

class LivniumCore {
  /* ---------- singleton ---------- */
  LivniumCore._internal();
  static final LivniumCore instance = LivniumCore._internal();

  /* ---------- sub-modules ---------- */
  // final LivniumCodec codec = const LivniumCodec();

  /* ---------- energy ---------- */
  double energy(String word) => symbolicEnergy(word);

  /* ---------- rotation ---------- */

  /// Convenience forwarder to rotation helper.
  /// Quarter-turns can be -3…+3 (mod 4 semantics).
  // Vec3 rotate(Vec3 v, Axis axis, int quarterTurns) =>
  //     rotateVec(v, axis, quarterTurns);

  /// Shorthand for rotating a full (x,y,z) tuple by (qx,qy,qz) quarter-turns.
  // Vec3 rotateXYZ(Vec3 v, {int qx = 0, int qy = 0, int qz = 0}) =>
  //     rotateVec(rotateVec(rotateVec(v, Axis.x, qx), Axis.y, qy), Axis.z, qz);
}
