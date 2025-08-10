import 'dart:math' as math;

// Coords in {-1,0,1}³
Iterable<(int, int, int)> cube27() sync* {
  for (var x = -1; x <= 1; x++) {
    for (var y = -1; y <= 1; y++) {
      for (var z = -1; z <= 1; z++) {
        yield (x, y, z);
      }
    }
  }
}

int exposure((int, int, int) v) {
  final (x, y, z) = v;
  var c = 0;
  if (x != 0) c++;
  if (y != 0) c++;
  if (z != 0) c++;
  return c; // faces exposed
}

int l1((int, int, int) v) {
  final (x, y, z) = v;
  return x.abs() + y.abs() + z.abs();
}

int linf((int, int, int) v) {
  final (x, y, z) = v;
  return math.max(x.abs(), math.max(y.abs(), z.abs()));
}

double l2((int, int, int) v) {
  final (x, y, z) = v;
  return math.sqrt((x * x + y * y + z * z).toDouble());
}

Map<T, int> countBy<T>(Iterable<T> items) {
  final m = <T, int>{};
  for (final it in items) {
    m.update(it, (v) => v + 1, ifAbsent: () => 1);
  }
  return m;
}

// Use record keys (value-equality) for projection buckets.
Map<(int, int), int> projectCounts(String dropAxis) {
  int idx(String a) => {'x': 0, 'y': 1, 'z': 2}[a]!;
  final di = idx(dropAxis);
  final m = <(int, int), int>{};
  for (final p in cube27()) {
    final (x, y, z) = p;
    // keep the two coordinates not dropped
    final key = switch (di) {
      0 => (y, z), // drop x
      1 => (x, z), // drop y
      2 => (x, y), // drop z
      _ => (0, 0),
    };
    m.update(key, (v) => v + 1, ifAbsent: () => 1);
  }
  return m;
}

void prettyProjection(String dropAxis) {
  final m = projectCounts(dropAxis);
  print('Slices after dropping ${dropAxis.toUpperCase()}:');
  // Stable order (-1,0,1)
  for (final yy in [-1, 0, 1]) {
    for (final xx in [-1, 0, 1]) {
      final key = (xx, yy);
      final c = m[key] ?? 0;
      print('key=(${key.$1}, ${key.$2})  count=$c');
    }
  }
  print('');
}

// === Projection heatmaps (C/E/F/O counts per 2D cell) ========================

String _classForExposure(int e) => switch (e) {
  3 => 'C', // corner (3 faces)
  2 => 'E', // edge (2 faces)
  1 => 'F', // face center (1 face)
  0 => 'O', // core (0 faces)
  _ => '?',
};

Map<(int, int), Map<String, int>> projectionClassCounts(String dropAxis) {
  int idx(String a) => {'x': 0, 'y': 1, 'z': 2}[a]!;
  final di = idx(dropAxis);
  final m = <(int, int), Map<String, int>>{};
  for (final p in cube27()) {
    final (x, y, z) = p;
    final key = switch (di) {
      0 => (y, z), // drop x → (y,z) plane
      1 => (x, z), // drop y → (x,z) plane
      2 => (x, y), // drop z → (x,y) plane
      _ => (0, 0),
    };
    final cls = _classForExposure(exposure(p));
    final bin = m.putIfAbsent(key, () => {'C': 0, 'E': 0, 'F': 0, 'O': 0});
    bin[cls] = (bin[cls] ?? 0) + 1;
  }
  return m;
}

String _cellLabel(Map<String, int> counts) {
  // Compact label like "C2E1" or "F2O1" (omit zeros), fixed width 4–5 chars
  final parts = <String>[];
  for (final k in ['C', 'E', 'F', 'O']) {
    final v = counts[k] ?? 0;
    if (v > 0) parts.add('$k$v');
  }
  final s = parts.join();
  // pad to width for neat grid; tweak if you want tighter/looser
  return s.padRight(4);
}

void printProjectionHeatmap(String dropAxis) {
  final m = projectionClassCounts(dropAxis);
  print('Heatmap after dropping ${dropAxis.toUpperCase()}  (per cell, 3 stacked points)');
  print('Legend: C=Corner, E=Edge, F=Face, O=Core   Example: "C2E1" = 2 corners + 1 edge');
  for (final yy in [-1, 0, 1]) {
    final row = <String>[];
    for (final xx in [-1, 0, 1]) {
      final key = (xx, yy);
      final counts = m[key] ?? const {'C': 0, 'E': 0, 'F': 0, 'O': 0};
      row.add(_cellLabel(counts));
    }
    print(row.map((c) => c.padLeft(5)).join(' '));
  }
  print('');
}

void main() {
  final pts = cube27().toList();
  assert(pts.length == 27);

  // Exposure buckets (faces=0/1/2/3)
  final byExpo = countBy(pts.map(exposure));
  print('Coarse by faces:');
  for (final f in [3, 2, 1, 0]) {
    print('faces=$f -> ${byExpo[f] ?? 0}');
  }
  print('');

  // L1 / L∞ / L2 bins
  final byL1 = countBy(pts.map(l1));
  final byLinf = countBy(pts.map(linf));
  final byL2 = countBy(pts.map((p) => l2(p).toStringAsFixed(0))); // 0,1,2

  print('Radial bins L1:');
  for (final r in [3, 2, 1, 0]) {
    print('L=$r -> ${byL1[r] ?? 0} points');
  }
  print('');

  print('Radial bins L∞ (Chebyshev):');
  for (final r in [1, 0]) {
    print('L∞=$r -> ${byLinf[r] ?? 0} points');
  }
  print('');

  print('Radial bins L2 (rounded):');
  for (final r in ['2', '1', '0']) {
    print('L2≈$r -> ${byL2[r] ?? 0} points');
  }
  print('');

  // Projections
  prettyProjection('z');
  prettyProjection('x');
  prettyProjection('y');

  // Heatmaps
  printProjectionHeatmap('z');
  printProjectionHeatmap('x');
  printProjectionHeatmap('y');

  // Strong correctness asserts
  assert(byExpo[3] == 8 && byExpo[2] == 12 && byExpo[1] == 6 && byExpo[0] == 1);
  assert(byL1[3] == 8 && byL1[2] == 12 && byL1[1] == 6 && byL1[0] == 1);

  // Each (x,y), (y,z), (x,z) pair should have exactly 3 points across the dropped axis
  assert(projectCounts('z').values.every((c) => c == 3));
  assert(projectCounts('x').values.every((c) => c == 3));
  assert(projectCounts('y').values.every((c) => c == 3));



  print('All checks passed ✔️');
}
