library;

import 'alphabet.dart' show kSymbols;
import 'energy.dart' show equilibriumConstant;

const int _centerCount = 6; // 1 face visible
const int _edgeCount = 12; // 2 faces visible
const int _cornerCount = 8; // 3 faces visible

/// Predefined sides for each position type (cycled)
const List<String> _centerSides = ['+X', '-X', '+Y', '-Y', '+Z', '-Z'];
const List<String> _edgeSides = [
  '+X+Y',
  '+X-Y',
  '-X+Y',
  '-X-Y',
  '+X+Z',
  '+X-Z',
  '-X+Z',
  '-X-Z',
  '+Y+Z',
  '+Y-Z',
  '-Y+Z',
  '-Y-Z',
];
const List<String> _cornerSides = [
  '+X+Y+Z',
  '+X+Y-Z',
  '+X-Y+Z',
  '+X-Y-Z',
  '-X+Y+Z',
  '-X+Y-Z',
  '-X-Y+Z',
  '-X-Y-Z',
];

/// Generate the mapping: symbol → (faces, side).
Map<String, (int faces, String side)> generateExposureMapping({
  String mode = 'conventional',
}) {
  return switch (mode) {
    'harmonic' => _generateHarmonic(),
    'conventional' => _generateConventional(),
    _ => throw ArgumentError('Unknown mode: $mode'),
  };
}

/// ---------------------- Conventional (grouped) ---------------------------
Map<String, (int faces, String side)> _generateConventional() {
  final m = <String, (int, String)>{};
  m[kSymbols[0]] = (0, 'CORE');

  // a..f → centers
  for (int i = 0; i < _centerCount; i++) {
    final sym = kSymbols[1 + i];
    m[sym] = (1, _centerSides[i % _centerSides.length]);
  }
  // g..r → edges (12)
  for (int i = 0; i < _edgeCount; i++) {
    final sym = kSymbols[1 + _centerCount + i];
    m[sym] = (2, _edgeSides[i % _edgeSides.length]);
  }
  // s..z → corners (8)
  for (int i = 0; i < _cornerCount; i++) {
    final sym = kSymbols[1 + _centerCount + _edgeCount + i];
    m[sym] = (3, _cornerSides[i % _cornerSides.length]);
  }
  return m;
}

/// ----------------------- Harmonic (interleaved) --------------------------
int _tiePriorityForFaces(int faces) => switch (faces) {
      1 => 0,
      2 => 1,
      3 => 2,
      _ => 99,
    };

Map<String, (int faces, String side)> _generateHarmonic() {
  final stepCorner = equilibriumConstant / _cornerCount;
  final stepEdge = equilibriumConstant / _edgeCount;
  final stepCenter = equilibriumConstant / _centerCount;

  final queue = <_Entry>[
    _Entry(
        step: stepCorner,
        faces: 3,
        remaining: _cornerCount,
        sideList: _cornerSides),
    _Entry(
        step: stepEdge, faces: 2, remaining: _edgeCount, sideList: _edgeSides),
    _Entry(
        step: stepCenter,
        faces: 1,
        remaining: _centerCount,
        sideList: _centerSides),
  ];

  final mapping = <String, (int faces, String side)>{};
  mapping[kSymbols[0]] = (0, 'CORE');

  var idx = 1;
  while (queue.any((e) => e.remaining > 0)) {
    queue.sort((a, b) {
      final t = a.nextTime.compareTo(b.nextTime);
      if (t != 0) return t;
      final pa = _tiePriorityForFaces(a.faces);
      final pb = _tiePriorityForFaces(b.faces);
      if (pa != pb) return pa - pb;
      return a.faces - b.faces;
    });
    final cur = queue.first;
    final side = cur.sideList[(cur.sideIndex++ % cur.sideList.length)];
    mapping[kSymbols[idx++]] = (cur.faces, side);
    cur.remaining--;
    cur.nextTime += cur.step;
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

/// Basic invariants for the conventional mapping.
void selfTestConventionalMapping(Map<String, (int faces, String side)> m) {
  int c1 = 0, c2 = 0, c3 = 0;
  for (final e in m.entries) {
    final s = e.key;
    final f = e.value.$1;
    if (s == '0') {
      assert(f == 0);
      continue;
    }
    if (f == 1) {
      c1++;
    } else if (f == 2) {
      c2++;
    } else if (f == 3) {
      c3++;
    } else {
      assert(false);
    }
  }
  assert(c1 == 6 && c2 == 12 && c3 == 8);

  // Exact symbol ranges
  for (final s in ['a', 'b', 'c', 'd', 'e', 'f']) {
    assert(m[s]!.$1 == 1);
  }
  for (final s in [
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r'
  ]) {
    assert(m[s]!.$1 == 2);
  }
  for (final s in ['s', 't', 'u', 'v', 'w', 'x', 'y', 'z']) {
    assert(m[s]!.$1 == 3);
  }

  // Side sets uniqueness
  final sides1 = <String>{}, sides2 = <String>{}, sides3 = <String>{};
  m.forEach((sym, v) {
    switch (v.$1) {
      case 1:
        assert(sides1.add(v.$2));
        break;
      case 2:
        assert(sides2.add(v.$2));
        break;
      case 3:
        assert(sides3.add(v.$2));
        break;
    }
  });
  assert(sides1.length == 6 && sides2.length == 12 && sides3.length == 8);
}
