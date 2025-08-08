/// lib/src/generate_mapping.dart
/// -----------------------------
/// Auto-generates the Livnium symbol → face-exposure + side mapping
/// using harmonic steps from the cube's equilibrium constant.
library;

const double equilibriumConstant = 27 / 8 + 27 / 12 + 27 / 6; // 10.125

/// Cube geometry counts
const int _coreCount = 1;
const int _centreCount = 6; // 1 face visible
const int _edgeCount = 12;  // 2 faces visible
const int _cornerCount = 8; // 3 faces visible

/// The symbol list in order (0, a–z)
const List<String> kSymbols = [
  '0', //
  'a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
  'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
];

/// Predefined sides for each position type
/// These will loop if count > available side labels
const List<String> _centreSides = ['+X', '-X', '+Y', '-Y', '+Z', '-Z'];
const List<String> _edgeSides = [
  '+X+Y', '+X-Y', '-X+Y', '-X-Y',
  '+X+Z', '+X-Z', '-X+Z', '-X-Z',
  '+Y+Z', '+Y-Z', '-Y+Z', '-Y-Z',
];
const List<String> _cornerSides = [
  '+X+Y+Z', '+X+Y-Z', '+X-Y+Z', '+X-Y-Z',
  '-X+Y+Z', '-X+Y-Z', '-X-Y+Z', '-X-Y-Z',
];

/// Generate the mapping: symbol → {faces, side}
Map<String, (int faces, String side)> generateExposureMapping() {
  // Step sizes for each group based on harmonic spacing
  final double stepCorner = equilibriumConstant / _cornerCount;
  final double stepEdge   = equilibriumConstant / _edgeCount;
  final double stepCentre = equilibriumConstant / _centreCount;

  // Priority queue simulation
  final queue = <_Entry>[
    _Entry(step: stepCorner, faces: 3, remaining: _cornerCount, sideList: _cornerSides),
    _Entry(step: stepEdge,   faces: 2, remaining: _edgeCount,   sideList: _edgeSides),
    _Entry(step: stepCentre, faces: 1, remaining: _centreCount, sideList: _centreSides),
  ];

  final mapping = <String, (int faces, String side)>{};

  // Core is always first
  mapping[kSymbols[0]] = (0, 'CORE');

  // Fill the rest of the 26 positions
  int symbolIndex = 1;

  while (queue.any((e) => e.remaining > 0)) {
    queue.sort((a, b) => a.nextTime.compareTo(b.nextTime));
    final current = queue.first;

    // Assign next symbol to this group with next side label
    final sideLabel = current.sideList[
    (current.sideIndex++ % current.sideList.length)
    ];
    mapping[kSymbols[symbolIndex++]] = (current.faces, sideLabel);

    current.remaining--;
    current.nextTime += current.step;
  }

  return mapping;
}

class _Entry {
  final double step;
  final int faces;
  int remaining;
  double nextTime;
  final List<String> sideList;
  int sideIndex = 0;
  _Entry({
    required this.step,
    required this.faces,
    required this.remaining,
    required this.sideList,
  }) : nextTime = 0;
}


class Vec3 {
  final int x, y, z;
  const Vec3(this.x, this.y, this.z);
  @override
  bool operator ==(Object other) =>
      other is Vec3 && x == other.x && y == other.y && z == other.z;
  @override
  int get hashCode => Object.hash(x, y, z);
}

void printFace(String name, int axis, int sign, Map<String, Vec3> coords) {
  print('Face: $name');
  for (int rowY = 1; rowY >= -1; rowY--) {
    String row = '';
    for (int colX = -1; colX <= 1; colX++) {
      Vec3 target = const Vec3(0, 0, 0); // default init
      if (axis == 2) target = Vec3(colX, rowY, sign);      // Z face
      if (axis == 0) target = Vec3(sign, rowY, -colX);     // X face
      if (axis == 1) target = Vec3(colX, sign, -rowY);     // Y face

      final match = coords.entries
          .firstWhere((e) => e.value == target, orElse: () => MapEntry(' ', const Vec3(0,0,0)))
          .key;
      row += ' ${match.padRight(1)} ';
    }
    print(row);
  }
  print('');
}


void printAllFaces(Map<String, Vec3> coords) {
  printFace('Up (Z=+1)', 2, 1, coords);
  printFace('Down (Z=-1)', 2, -1, coords);
  printFace('Left (X=-1)', 0, -1, coords);
  printFace('Right (X=+1)', 0, 1, coords);
  printFace('Front (Y=+1)', 1, 1, coords);
  printFace('Back (Y=-1)', 1, -1, coords);
}


void main() {
  final exposure = generateExposureMapping();

  // Print mapping
  for (final entry in exposure.entries) {
    print('${entry.key} → faces=${entry.value.$1}, side=${entry.value.$2}');
  }

  // Build coordinates map
  final coords = <String, Vec3>{};
  for (final entry in exposure.entries) {
    coords[entry.key] = _sideToVec3(entry.value.$2);
  }

  // Print cube layout
  printAllFaces(coords);
}


Vec3 _sideToVec3(String side) {
  if (side == 'CORE') return const Vec3(0, 0, 0);

  int x = 0, y = 0, z = 0;
  final matches = RegExp(r'([+-][XYZ])').allMatches(side);
  for (final m in matches) {
    switch (m.group(0)) {
      case '+X': x = 1; break;
      case '-X': x = -1; break;
      case '+Y': y = 1; break;
      case '-Y': y = -1; break;
      case '+Z': z = 1; break;
      case '-Z': z = -1; break;
    }
  }
  return Vec3(x, y, z);
}
