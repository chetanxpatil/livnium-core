import 'package:livnium_core/livnium_core.dart';

void main() {
  // identity check
  for (final v in cube3Coords()) {
    var p = v;
    for (var i = 0; i < 4; i++) {
      p = rotateX(p);
    }
    assert(p == v);
  }
  print('rotateX^4 identity ok');

  // sequence + inverse
  final seq = [Rotation(RotationAxis.x, 1), Rotation(RotationAxis.z, 2)];
  final inv = invertRotations(seq);
  var ok = true;
  for (final v in cube3Coords()) {
    final w = applyRotations(v, seq);
    final back = applyRotations(w, inv);
    if (v != back) {
      ok = false;
      break;
    }
  }
  print('sequence inverse: ${ok ? "ok" : "fail"}');
}
