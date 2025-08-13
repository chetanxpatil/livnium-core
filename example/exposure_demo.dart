import 'package:livnium_core/livnium_core.dart';

void main() {
  final exposure = generateExposureMapping(mode: 'conventional');
  final coords = <String, Vec3>{};
  exposure.forEach((sym, v) => coords[sym] = _sideToVec3(v.$2));
  _printAllFaces(coords);
}

// --- local helpers copied from the old demo (scoped to example only) ---
Vec3 _sideToVec3(String side) {
  if (side == 'CORE') return const Vec3(0, 0, 0);
  int x = 0, y = 0, z = 0;
  for (final m in RegExp(r'([+-][XYZ])').allMatches(side)) {
    switch (m.group(0)) {
      case '+X':
        x = 1;
        break;
      case '-X':
        x = -1;
        break;
      case '+Y':
        y = 1;
        break;
      case '-Y':
        y = -1;
        break;
      case '+Z':
        z = 1;
        break;
      case '-Z':
        z = -1;
        break;
    }
  }
  return Vec3(x, y, z);
}

void _printFace(String name, int axis, int sign, Map<String, Vec3> coords) {
  print('Face: $name');
  for (int rowY = 1; rowY >= -1; rowY--) {
    var row = '';
    for (int colX = -1; colX <= 1; colX++) {
      Vec3 target = const Vec3(0, 0, 0);
      if (axis == 2) target = Vec3(colX, rowY, sign); // Z face
      if (axis == 0) target = Vec3(sign, rowY, -colX); // X face
      if (axis == 1) target = Vec3(colX, sign, -rowY); // Y face

      final match = coords.entries
          .firstWhere(
            (e) => e.value == target,
            orElse: () => MapEntry(' ', const Vec3(0, 0, 0)),
          )
          .key;
      row += ' ${match.padRight(1)} ';
    }
    print(row);
  }
  print('');
}

void _printAllFaces(Map<String, Vec3> coords) {
  _printFace('Up (Z=+1)', 2, 1, coords);
  _printFace('Down (Z=-1)', 2, -1, coords);
  _printFace('Left (X=-1)', 0, -1, coords);
  _printFace('Right (X=+1)', 0, 1, coords);
  _printFace('Front (Y=+1)', 1, 1, coords);
  _printFace('Back (Y=-1)', 1, -1, coords);
}
