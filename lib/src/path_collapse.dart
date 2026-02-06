import 'dart:math';

import 'path_flow.dart';

/// Path by **collapse** (relaxation), not search.
/// Start = high potential, Target = ground; obstacles = insulators.
/// The field relaxes; the path is the ridge of flow (steepest descent to target).

const double _startPotential = 100.0;
const double _endPotential = 0.0;
const double _wallPotential = -1.0; // insulator: not updated, blocks flow

/// Stats from collapse: comparable "work" = cellUpdates (or iterations × updatableCells).
class PathCollapseResult {
  final List<GridPoint> path;
  final int cellUpdates;
  final int iterationsUsed;
  final bool converged;
  final int pathLength;

  PathCollapseResult({
    required this.path,
    required this.cellUpdates,
    required this.iterationsUsed,
    required this.converged,
  }) : pathLength = path.length;
}

/// Runs potential-field relaxation (diffusion + A5 polarity bias).
/// Stops early when [maxDelta] < [epsilon]. Returns grid and stats.
/// [cellUpdates] = number of cell updates performed (science-grade work metric).
({List<double> grid, int cellUpdates, int iterationsUsed, bool converged})
    runPotentialCollapseWithStats(
  int size,
  GridPoint start,
  GridPoint end,
  Set<GridPoint> walls, {
  int maxIterations = 200,
  double polarityBias = 0.15,
  double epsilon = 1e-4,
}) {
  final n = size * size;
  final grid = List<double>.filled(n, 50.0);

  double at(GridPoint p) => grid[p.y * size + p.x];
  void setAt(GridPoint p, double v) {
    grid[p.y * size + p.x] = v;
  }

  setAt(start, _startPotential);
  setAt(end, _endPotential);
  for (final w in walls) {
    setAt(w, _wallPotential);
  }

  var cellUpdates = 0;
  var converged = false;
  var step = 0;

  for (step = 0; step < maxIterations; step++) {
    final next = List<double>.from(grid);
    var maxDelta = 0.0;
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        final p = GridPoint(x, y);
        if (p == start || p == end || walls.contains(p)) continue;

        final neighbors = getNeighbors(p, size, walls);
        if (neighbors.isEmpty) continue;

        var sum = 0.0;
        var weightSum = 0.0;
        for (final n in neighbors) {
          final v = at(n);
          if (v < 0) continue;
          final dist = distanceTo(n, end);
          final w = 1.0 + polarityBias / (1.0 + dist);
          sum += w * v;
          weightSum += w;
        }
        if (weightSum > 0) {
          final newVal = sum / weightSum;
          final delta = (newVal - grid[p.y * size + p.x]).abs();
          if (delta > maxDelta) maxDelta = delta;
          next[p.y * size + p.x] = newVal;
          cellUpdates++;
        }
      }
    }
    for (var i = 0; i < n; i++) {
      if (grid[i] != _startPotential &&
          grid[i] != _endPotential &&
          grid[i] != _wallPotential) {
        grid[i] = next[i];
      }
    }
    if (epsilon >= 0 && maxDelta < epsilon) {
      converged = true;
      break;
    }
  }
  return (
    grid: grid,
    cellUpdates: cellUpdates,
    iterationsUsed: step + 1,
    converged: converged
  );
}

/// Legacy: returns only the grid (no stats). Uses fixed iteration count.
List<double> runPotentialCollapse(
  int size,
  GridPoint start,
  GridPoint end,
  Set<GridPoint> walls, {
  int iterations = 200,
  double polarityBias = 0.15,
}) {
  final result = runPotentialCollapseWithStats(
    size,
    start,
    end,
    walls,
    maxIterations: iterations,
    polarityBias: polarityBias,
    epsilon: -1.0,
  );
  return result.grid;
}

/// Extracts path from start to end: steepest descent, with plateau handling.
/// On plateaus (at(next) == at(current)), pick neighbor closer to [end].
List<GridPoint> extractPathFromPotentials(
  int size,
  GridPoint start,
  GridPoint end,
  Set<GridPoint> walls,
  List<double> grid,
) {
  double at(GridPoint p) {
    if (p.x < 0 || p.x >= size || p.y < 0 || p.y >= size)
      return double.infinity;
    final v = grid[p.y * size + p.x];
    return v < 0 ? double.infinity : v;
  }

  final path = <GridPoint>[start];
  var current = start;
  final maxSteps = size * size + 1;

  for (var i = 0; i < maxSteps; i++) {
    if (current == end) break;
    final neighbors = getNeighbors(current, size, walls);
    if (neighbors.isEmpty) break;

    // Best neighbor: smallest potential; tie-break by closer to end (plateau handling)
    GridPoint next = neighbors.first;
    for (final n in neighbors) {
      final an = at(n);
      final aNext = at(next);
      if (an < aNext) {
        next = n;
      } else if (an == aNext && distanceTo(n, end) < distanceTo(next, end)) {
        next = n;
      }
    }
    if (at(next) > at(current)) break; // strict uphill: stop
    path.add(next);
    current = next;
  }
  return path;
}

/// Full collapse with science-grade stats. Work metric = [cellUpdates].
PathCollapseResult runPathCollapseWithStats(
  int size,
  GridPoint start,
  GridPoint end,
  Set<GridPoint> walls, {
  int maxIterations = 200,
  double polarityBias = 0.15,
  double epsilon = 1e-4,
}) {
  final result = runPotentialCollapseWithStats(
    size,
    start,
    end,
    walls,
    maxIterations: maxIterations,
    polarityBias: polarityBias,
    epsilon: epsilon,
  );
  final path = extractPathFromPotentials(size, start, end, walls, result.grid);
  return PathCollapseResult(
    path: path,
    cellUpdates: result.cellUpdates,
    iterationsUsed: result.iterationsUsed,
    converged: result.converged,
  );
}

/// Full collapse solver: relax field, then extract path. Returns path only.
List<GridPoint> runPathCollapse(
  int size,
  GridPoint start,
  GridPoint end,
  Set<GridPoint> walls, {
  int iterations = 200,
  double polarityBias = 0.15,
}) {
  final grid = runPotentialCollapse(size, start, end, walls,
      iterations: iterations, polarityBias: polarityBias);
  return extractPathFromPotentials(size, start, end, walls, grid);
}
