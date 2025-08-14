library;

import 'alphabet.dart';
import 'codec.dart';
import 'grid.dart';
import 'rotation.dart';
import 'energy.dart';

bool _runAllSelfChecks() {
  // alphabet round-trip
  const samples = ['', '0', 'abc', 'z', '0az', 'livnium'];
  for (final w in samples) {
    final ds = stringToDigits(w);
    if (ds == null) return false;
    final back = digitsToString(ds);
    if (back != w) return false;
  }

  // codecs
  for (final w in samples) {
    if (decodeCsv(encodeCsv(w)!) != w) return false;
    if (decodeFixed(encodeFixed(w)!) != w) return false;
    final big = encodeBigIntTail(w);
    if (big == null || decodeBigIntTail(big) != w) return false;
  }

  // rotation identities
  for (final v in cube3Coords()) {
    var p = v;
    for (var i = 0; i < 4; i++) {
      p = rotateX(p);
    }
    if (p != v) return false;
    p = v;
    for (var i = 0; i < 4; i++) {
      p = rotateY(p);
    }
    if (p != v) return false;
    p = v;
    for (var i = 0; i < 4; i++) {
      p = rotateZ(p);
    }
    if (p != v) return false;
  }

  // sequence + inverse
  final seq = [Rotation(RotationAxis.x, 1), Rotation(RotationAxis.z, 3)];
  final inv = invertRotations(seq);
  for (final v in cube3Coords()) {
    final w = applyRotations(v, seq);
    final back = applyRotations(w, inv);
    if (back != v) return false;
  }

  // grid class counts: 1 core, 6 centers, 12 edges, 8 corners
  var core = 0, cent = 0, edge = 0, corn = 0;
  for (final v in cube3Coords()) {
    if (isCore(v))
      core++;
    else if (isCenter(v))
      cent++;
    else if (isEdge(v))
      edge++;
    else if (isCorner(v))
      corn++;
  }
  if (!(core == 1 && cent == 6 && edge == 12 && corn == 8)) return false;

  // energy basics
  if (equilibriumConstant != 10.125) return false;
  if (perFaceUnitEnergy(1) != 10.125) return false;
  if (perFaceUnitEnergy(2) != 5.0625) return false;
  if (perFaceUnitEnergy(3) != 3.375) return false;

  return true;
}

// Public wrapper for CLI/tests
bool runAllSelfChecks() => _runAllSelfChecks();

