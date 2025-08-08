import 'package:livnium_core/livnium_core.dart';

void main() {
  final core = LivniumCore.instance;

  // Pick a symbol to track — say 'a'
  final pos = Vec3(1, 1, 1); // Example corner coordinate for 'a'

  print('Original: $pos');

  // Rotate 90° clockwise around Z axis
  final rotatedZ = core.rotateZ(pos);
  print('After Z+90°: $rotatedZ');

  // Rotate 90° clockwise around X axis
  final rotatedX = core.rotateX(pos);
  print('After X+90°: $rotatedX');

  // Rotate 90° clockwise around Y axis
  final rotatedY = core.rotateY(pos);
  print('After Y+90°: $rotatedY');
}
