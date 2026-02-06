// Benchmark: run 2000 trials per mode, report solvable rate, success rate, and conditional stats.
// Usage: dart run example/benchmark_path_race.dart

import 'dart:math';
import 'package:livnium_core/livnium_core.dart';

const int size = 20;
const gridPoints = size * size;
final start = GridPoint(0, 0);
final end = GridPoint(size - 1, size - 1);

final _rng = Random(42);

/// Random obstacles: place [wallCount] walls at random (excluding start/end).
/// Returns null if [requireSolvable] and no path exists after [maxAttempts] tries.
Set<GridPoint>? randomObstacles({
  required int wallCount,
  bool requireSolvable = false,
  int maxAttempts = 80,
}) {
  for (var attempt = 0; attempt < maxAttempts; attempt++) {
    final walls = <GridPoint>{};
    while (walls.length < wallCount) {
      final p = GridPoint(_rng.nextInt(size), _rng.nextInt(size));
      if (p == start || p == end) continue;
      walls.add(p);
    }
    if (!requireSolvable) return walls;
    if (optimalPathLength(size, start, end, walls) >= 0) return walls;
  }
  return null; // failed to get solvable in time
}

/// Recursive division maze (complicated). Start/end corners protected.
Set<GridPoint> complicatedMaze() {
  final grid = List.filled(size * size, 0);
  int idx(int x, int y) => y * size + x;
  bool isProtected(int x, int y) =>
      (x == 0 && y == 0) || (x == size - 1 && y == size - 1);

  void divide(int x, int y, int w, int h) {
    if (w < 2 || h < 2) return;
    final splitCol = w > 2 ? x + 1 + _rng.nextInt(w - 2) : x;
    final splitRow = h > 2 ? y + 1 + _rng.nextInt(h - 2) : y;

    if (w >= 2 && splitCol >= x && splitCol < x + w) {
      final gapRow = y + _rng.nextInt(h);
      for (var row = y; row < y + h; row++) {
        if (row == gapRow) continue;
        if (!isProtected(splitCol, row)) grid[idx(splitCol, row)] = 1;
      }
    }
    if (h >= 2 && splitRow >= y && splitRow < y + h) {
      final gapCol = x + _rng.nextInt(w);
      for (var col = x; col < x + w; col++) {
        if (col == gapCol) continue;
        if (!isProtected(col, splitRow)) grid[idx(col, splitRow)] = 1;
      }
    }

    final w1 = splitCol - x, w2 = x + w - splitCol - 1;
    final h1 = splitRow - y, h2 = y + h - splitRow - 1;
    if (w1 >= 2 && h1 >= 2) divide(x, y, w1, h1);
    if (w2 >= 2 && h1 >= 2) divide(splitCol + 1, y, w2, h1);
    if (w1 >= 2 && h2 >= 2) divide(x, splitRow + 1, w1, h2);
    if (w2 >= 2 && h2 >= 2) divide(splitCol + 1, splitRow + 1, w2, h2);
  }

  divide(0, 0, size, size);

  final walls = <GridPoint>{};
  for (var yy = 0; yy < size; yy++) {
    for (var xx = 0; xx < size; xx++) {
      if (grid[idx(xx, yy)] == 1) walls.add(GridPoint(xx, yy));
    }
  }
  return walls;
}

/// Winding maze: DFS backtracker on 21x21 grid, then map to size x size.
Set<GridPoint> windingMaze() {
  const W = 10, H = 10;
  final gw = 2 * W + 1, gh = 2 * H + 1;
  final grid = List.filled(gw * gh, 1);
  int idx(int x, int y) => y * gw + x;

  final stack = <List<int>>[
    [1, 1]
  ];
  grid[idx(1, 1)] = 0;

  const dirs = [-2, 0, 2, 0, 0, -2, 0, 2];
  while (stack.isNotEmpty) {
    final p = stack.last;
    final px = p[0], py = p[1];
    final neighbors = <List<int>>[];
    for (var i = 0; i < dirs.length; i += 2) {
      final nx = px + dirs[i], ny = py + dirs[i + 1];
      if (nx >= 1 &&
          nx < gw - 1 &&
          ny >= 1 &&
          ny < gh - 1 &&
          grid[idx(nx, ny)] == 1) {
        neighbors.add([nx, ny]);
      }
    }
    if (neighbors.isEmpty) {
      stack.removeLast();
      continue;
    }
    final n = neighbors[_rng.nextInt(neighbors.length)];
    grid[idx((px + n[0]) ~/ 2, (py + n[1]) ~/ 2)] = 0;
    grid[idx(n[0], n[1])] = 0;
    stack.add(n);
  }

  final walls = <GridPoint>{};
  for (var sy = 0; sy < size; sy++) {
    for (var sx = 0; sx < size; sx++) {
      final gx = 1 + (sx * (gw - 2) ~/ size);
      final gy = 1 + (sy * (gh - 2) ~/ size);
      if (grid[idx(gx, gy)] == 1 &&
          !(sx == 0 && sy == 0) &&
          !(sx == size - 1 && sy == size - 1)) {
        walls.add(GridPoint(sx, sy));
      }
    }
  }
  return walls;
}

void _row(String label, int found, int n, List<int> expList, List<int> pathList,
    List<int> gapList) {
  final sr = n > 0 ? (100 * found / n).toStringAsFixed(1) : '0';
  final avgExp = expList.isEmpty
      ? '—'
      : (expList.reduce((a, b) => a + b) / expList.length).toStringAsFixed(1);
  final avgPath = pathList.isEmpty
      ? '—'
      : (pathList.reduce((a, b) => a + b) / pathList.length).toStringAsFixed(1);
  final avgGap = gapList.isEmpty
      ? '—'
      : (gapList.reduce((a, b) => a + b) / gapList.length).toStringAsFixed(1);
  print('$label      $sr%         $avgExp       $avgPath           $avgGap');
}

void main() {
  const trials = 2000;

  void runMode(
    String name,
    Set<GridPoint>? Function() gen,
  ) {
    var solvableCount = 0;
    var dFound = 0, aFound = 0, lFound = 0;
    var trialsDone = 0;
    final dExpList = <int>[], aExpList = <int>[], lExpList = <int>[];
    final dPathList = <int>[];
    final aPathList = <int>[], lPathList = <int>[];
    final aGapList = <int>[], lGapList = <int>[];
    var wallCountSum = 0;

    for (var t = 0; t < trials; t++) {
      final walls = gen();
      if (walls == null) {
        trialsDone++;
        continue; // failed to generate (e.g. 30% solvable)
      }
      trialsDone++;
      wallCountSum += walls.length;

      final q = runPathRaceWithQuality(size, start, end, walls);
      final solvable = q.optimalLen >= 0;
      if (solvable) solvableCount++;

      final df = solvable;
      final af = q.aStar.found;
      final lf = q.livniumFlow.found;
      if (df) dFound++;
      if (af) aFound++;
      if (lf) lFound++;

      if (solvable) {
        dExpList.add(q.dijkstraExpanded);
        dPathList.add(q.optimalLen);
        if (af) {
          aExpList.add(q.aStar.expanded);
          aPathList.add(q.aStar.pathLen);
          aGapList.add(q.aStarGap);
        }
        if (lf) {
          lExpList.add(q.livniumFlow.expanded);
          lPathList.add(q.livniumFlow.pathLen);
          lGapList.add(q.livniumGap);
        }
      }
    }

    final n = trialsDone;
    final wallPct = n > 0
        ? (wallCountSum / (n * gridPoints) * 100).toStringAsFixed(1)
        : '0';
    print('\n========== $name (n=$n) ==========');
    print('wallPct (avg): $wallPct%');
    print(
        'solvableRate: ${solvableCount}/$n (${n > 0 ? (100 * solvableCount / n).toStringAsFixed(1) : 0}%)');
    print('');
    print('            successRate   avg(exp)   avg(pathLen)   avg(gap)');
    _row('Dijkstra', dFound, n, dExpList, dPathList, <int>[]);
    _row('A*', aFound, n, aExpList, aPathList, aGapList);
    _row('Livnium', lFound, n, lExpList, lPathList, lGapList);
  }

  print('\n\n*** Random obstacles (easy) ~12% walls, no enforce ***');
  runMode('Random obstacles (easy)', () {
    final count = (gridPoints * 0.12).round().clamp(1, gridPoints - 3);
    return randomObstacles(wallCount: count, requireSolvable: false)!;
  });

  print('\n\n*** Random obstacles (hard) 30% walls, enforce solvable ***');
  runMode('Random obstacles (hard 30%)', () {
    final count = (gridPoints * 0.30).round().clamp(1, gridPoints - 3);
    return randomObstacles(
        wallCount: count, requireSolvable: true, maxAttempts: 80);
  });

  print('\n\n*** Complicated maze (recursive division) ***');
  runMode('Complicated maze', () => complicatedMaze());

  print('\n\n*** Winding maze (DFS backtracker) ***');
  runMode('Winding maze', () => windingMaze());

  // Weighted A* spectrum: w=1 (A*), 1.2, 1.5, 2.0, and Livnium. Shows expansion–gap tradeoff.
  print('\n\n*** Weighted A* spectrum (30% walls, n=2000) ***');
  runWeightedSpectrum(
    name: 'Random 30%',
    gen: () {
      final count = (gridPoints * 0.30).round().clamp(1, gridPoints - 3);
      return randomObstacles(
          wallCount: count, requireSolvable: true, maxAttempts: 80);
    },
    trials: trials,
  );

  print('\n\n*** Weighted A* spectrum (winding maze, n=2000) ***');
  runWeightedSpectrum(
    name: 'Winding maze',
    gen: () => windingMaze(),
    trials: trials,
  );

  print('\n');
}

/// Runs [trials] with [gen], collects avg(exp) and avg(gap) for A* (w=1), wA* 1.2, 1.5, 2.0, Livnium.
void runWeightedSpectrum({
  required String name,
  required Set<GridPoint>? Function() gen,
  required int trials,
}) {
  const weights = [1.0, 1.2, 1.5, 2.0];
  final expLists = List.generate(weights.length + 1, (_) => <int>[]);
  final gapLists = List.generate(weights.length + 1, (_) => <int>[]);

  var done = 0;
  for (var t = 0; t < trials; t++) {
    final walls = gen();
    if (walls == null) continue;
    done++;

    final q = runPathRaceWithQuality(size, start, end, walls);
    if (q.optimalLen < 0) continue;

    // A* (w=1) and Livnium from quality result
    if (q.aStar.found) {
      expLists[0].add(q.aStar.expanded);
      gapLists[0].add(q.aStarGap);
    }
    if (q.livniumFlow.found) {
      expLists[weights.length].add(q.livniumFlow.expanded);
      gapLists[weights.length].add(q.livniumGap);
    }

    // Weighted A* for w=1.2, 1.5, 2.0
    for (var i = 1; i < weights.length; i++) {
      final res = runWeightedAStar(size, start, end, walls, w: weights[i]);
      if (res.found) {
        expLists[i].add(res.expanded);
        gapLists[i].add(res.gapVsOptimal(q.optimalLen));
      }
    }
  }

  print('\n========== $name (n=$done) ==========');
  print('            avg(exp)   avg(gap)');
  String avg(List<int> list) => list.isEmpty
      ? '—'
      : (list.reduce((a, b) => a + b) / list.length).toStringAsFixed(1);
  for (var i = 0; i < weights.length; i++) {
    print(
        'w=${weights[i].toStringAsFixed(1)} (A*)  ${avg(expLists[i]).padLeft(8)}   ${avg(gapLists[i]).padLeft(6)}');
  }
  print(
      'Livnium (GBFS) ${avg(expLists[weights.length]).padLeft(8)}   ${avg(gapLists[weights.length]).padLeft(6)}');
}
