import 'dart:math';

/// 2D grid point for pathfinding (path race: Dijkstra vs Livnium Flow).
class GridPoint {
  final int x;
  final int y;

  const GridPoint(this.x, this.y);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is GridPoint && x == other.x && y == other.y;

  @override
  int get hashCode => Object.hash(x, y);

  @override
  String toString() => '($x,$y)';
}

/// Euclidean distance (for polarity / geometric potential).
double distanceTo(GridPoint a, GridPoint b) {
  final dx = (b.x - a.x).toDouble();
  final dy = (b.y - a.y).toDouble();
  return sqrt(dx * dx + dy * dy);
}

/// Manhattan distance: admissible heuristic for 4-neighbor grids. Sharper than Euclidean for A*.
int manhattanDistance(GridPoint a, GridPoint b) {
  return (a.x - b.x).abs() + (a.y - b.y).abs();
}

/// A5-style polarity: how much point [p] is "toward" [target].
/// Cosine-like: higher when p is closer to target (geometric pull).
/// We use negative distance so "higher polarity" = more toward target.
double polarityTowardTarget(GridPoint p, GridPoint target) {
  return -distanceTo(p, target);
}

/// 4-neighbors (no diagonals) within [size] x [size], excluding [walls].
List<GridPoint> getNeighbors(GridPoint p, int size, Set<GridPoint> walls) {
  const d = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  final out = <GridPoint>[];
  for (final d in d) {
    final nx = p.x + d[0];
    final ny = p.y + d[1];
    if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue;
    final n = GridPoint(nx, ny);
    if (walls.contains(n)) continue;
    out.add(n);
  }
  return out;
}

/// All search solvers return **expanded node count**: pop → add to closed → if goal break (goal is counted).
/// Same metric across Dijkstra, A*, and Livnium Flow.

/// Result of a path search: expanded nodes, path length (nodes in path), and whether goal was reached.
class PathSearchResult {
  final int expanded;
  final int pathLen;
  final bool found;

  const PathSearchResult(
      {required this.expanded, required this.pathLen, required this.found});

  /// Gap vs optimal: pathLen - optimalLen. Negative = no path; 0 = optimal.
  int gapVsOptimal(int optimalLen) =>
      found && optimalLen >= 0 ? pathLen - optimalLen : -1;
}

/// Dijkstra: expand by minimum g (cost from start). Blind wavefront.
int runDijkstra(
    int size, GridPoint start, GridPoint end, Set<GridPoint> walls) {
  final dist = <GridPoint, double>{start: 0};
  final open = <GridPoint>{start};
  final visited = <GridPoint>{};

  while (open.isNotEmpty) {
    final current = open.reduce((a, b) =>
        (dist[a] ?? double.infinity) <= (dist[b] ?? double.infinity) ? a : b);
    open.remove(current);
    if (visited.contains(current)) continue;
    visited.add(current);
    if (current == end) break;

    final dCurrent = dist[current] ?? double.infinity;
    for (final n in getNeighbors(current, size, walls)) {
      final dNew = dCurrent + 1;
      if (dNew < (dist[n] ?? double.infinity)) {
        dist[n] = dNew;
        open.add(n);
      }
    }
  }
  return visited.length;
}

/// A*: expand by minimum f = g + h. Uses Manhattan heuristic (admissible, sharper on 4-neighbor grid).
/// Returns expanded count, path length, and found. Path is optimal when found.
PathSearchResult runAStar(
    int size, GridPoint start, GridPoint end, Set<GridPoint> walls) {
  final gScore = <GridPoint, double>{start: 0};
  final fScore = <GridPoint, double>{
    start: manhattanDistance(start, end).toDouble()
  };
  final open = <GridPoint>{start};
  final visited = <GridPoint>{};
  final cameFrom = <GridPoint, GridPoint>{};

  while (open.isNotEmpty) {
    final current = open.reduce((a, b) =>
        (fScore[a] ?? double.infinity) <= (fScore[b] ?? double.infinity)
            ? a
            : b);
    open.remove(current);
    if (visited.contains(current)) continue;
    visited.add(current);
    if (current == end) break;

    final gCur = gScore[current] ?? double.infinity;
    for (final n in getNeighbors(current, size, walls)) {
      final gNew = gCur + 1;
      if (gNew >= (gScore[n] ?? double.infinity)) continue;
      gScore[n] = gNew;
      fScore[n] = gNew + manhattanDistance(n, end).toDouble();
      cameFrom[n] = current;
      open.add(n);
    }
  }

  final found = visited.contains(end);
  final pathLen = _reconstructPathLen(cameFrom, start, end);
  return PathSearchResult(
      expanded: visited.length, pathLen: pathLen, found: found);
}

/// Weighted A*: f = g + w * h. w = 1.0 is optimal A*; w > 1 trades optimality for fewer expansions.
/// Same structure as A*; [w] is the heuristic weight (e.g. 1.2, 1.5, 2.0). w → ∞ is GBFS-like.
PathSearchResult runWeightedAStar(
  int size,
  GridPoint start,
  GridPoint end,
  Set<GridPoint> walls, {
  double w = 1.0,
}) {
  final gScore = <GridPoint, double>{start: 0};
  final fScore = <GridPoint, double>{
    start: w * manhattanDistance(start, end).toDouble()
  };
  final open = <GridPoint>{start};
  final visited = <GridPoint>{};
  final cameFrom = <GridPoint, GridPoint>{};

  while (open.isNotEmpty) {
    final current = open.reduce((a, b) =>
        (fScore[a] ?? double.infinity) <= (fScore[b] ?? double.infinity)
            ? a
            : b);
    open.remove(current);
    if (visited.contains(current)) continue;
    visited.add(current);
    if (current == end) break;

    final gCur = gScore[current] ?? double.infinity;
    for (final n in getNeighbors(current, size, walls)) {
      final gNew = gCur + 1;
      if (gNew >= (gScore[n] ?? double.infinity)) continue;
      gScore[n] = gNew;
      fScore[n] = gNew + w * manhattanDistance(n, end).toDouble();
      cameFrom[n] = current;
      open.add(n);
    }
  }

  final found = visited.contains(end);
  final pathLen = _reconstructPathLen(cameFrom, start, end);
  return PathSearchResult(
      expanded: visited.length, pathLen: pathLen, found: found);
}

/// Livnium Flow = polarity-driven Greedy Best-First Search (GBFS).
/// Expands the node that looks closest to goal (A5 polarity), no g-cost. Not optimal; can beat A* on expansions.
/// Returns expanded count, path length, and found. Path may be longer than optimal (gap ≥ 0).
PathSearchResult runLivniumFlow(
    int size, GridPoint start, GridPoint end, Set<GridPoint> walls) {
  final openSet = <GridPoint>{start};
  final visited = <GridPoint>{};
  final cameFrom = <GridPoint, GridPoint>{};

  while (openSet.isNotEmpty) {
    final current = getBestGeometricCandidate(openSet, end);
    openSet.remove(current);
    if (visited.contains(current)) continue;
    visited.add(current);
    if (current == end) break;

    for (final n in getNeighbors(current, size, walls)) {
      if (visited.contains(n)) continue;
      if (!cameFrom.containsKey(n)) cameFrom[n] = current; // first discovery
      openSet.add(n);
    }
  }

  final found = visited.contains(end);
  final pathLen = _reconstructPathLen(cameFrom, start, end);
  return PathSearchResult(
      expanded: visited.length, pathLen: pathLen, found: found);
}

/// Path length = number of steps (edges), so comparable to [optimalPathLength].
int _reconstructPathLen(
    Map<GridPoint, GridPoint> cameFrom, GridPoint start, GridPoint end) {
  if (!cameFrom.containsKey(end) && end != start) return -1;
  var nodes = 0;
  var cur = end;
  while (true) {
    nodes++;
    if (cur == start) break;
    final prev = cameFrom[cur];
    if (prev == null) return -1;
    cur = prev;
  }
  return nodes > 0 ? nodes - 1 : 0; // steps = edges = nodes - 1
}

/// A5: pick the open node with highest polarity (closest direction) toward target.
GridPoint getBestGeometricCandidate(
    Set<GridPoint> candidates, GridPoint target) {
  return candidates.reduce((a, b) {
    final polA = polarityTowardTarget(a, target);
    final polB = polarityTowardTarget(b, target);
    return polA >= polB ? a : b;
  });
}

/// Runs search solvers; returns (dijkstra expanded, A* expanded, Livnium expanded).
(int, int, int) runPathRace(
    int size, GridPoint start, GridPoint end, Set<GridPoint> walls) {
  final d = runDijkstra(size, start, end, walls);
  final a = runAStar(size, start, end, walls);
  final l = runLivniumFlow(size, start, end, walls);
  return (d, a.expanded, l.expanded);
}

/// Quality-aware race: optimal path length + expanded and path quality for each solver.
PathRaceQualityResult runPathRaceWithQuality(
    int size, GridPoint start, GridPoint end, Set<GridPoint> walls) {
  final optimalLen = optimalPathLength(size, start, end, walls);
  final dExp = runDijkstra(size, start, end, walls);
  final aResult = runAStar(size, start, end, walls);
  final lResult = runLivniumFlow(size, start, end, walls);
  return PathRaceQualityResult(
    optimalLen: optimalLen,
    dijkstraExpanded: dExp,
    aStar: aResult,
    livniumFlow: lResult,
  );
}

/// Result of [runPathRaceWithQuality]: optimal path length and per-solver expanded + path quality.
class PathRaceQualityResult {
  final int optimalLen;
  final int dijkstraExpanded;
  final PathSearchResult aStar;
  final PathSearchResult livniumFlow;

  const PathRaceQualityResult({
    required this.optimalLen,
    required this.dijkstraExpanded,
    required this.aStar,
    required this.livniumFlow,
  });

  int get aStarGap => aStar.gapVsOptimal(optimalLen);
  int get livniumGap => livniumFlow.gapVsOptimal(optimalLen);
}

/// Optimal path length (Dijkstra cost to end). Use to check A*/Livnium path quality.
int optimalPathLength(
    int size, GridPoint start, GridPoint end, Set<GridPoint> walls) {
  final dist = <GridPoint, double>{start: 0};
  final open = <GridPoint>{start};
  final visited = <GridPoint>{};

  while (open.isNotEmpty) {
    final current = open.reduce((a, b) =>
        (dist[a] ?? double.infinity) <= (dist[b] ?? double.infinity) ? a : b);
    open.remove(current);
    if (visited.contains(current)) continue;
    visited.add(current);
    if (current == end) return dist[end]!.round();
    final dCurrent = dist[current] ?? double.infinity;
    for (final n in getNeighbors(current, size, walls)) {
      final dNew = dCurrent + 1;
      if (dNew < (dist[n] ?? double.infinity)) {
        dist[n] = dNew;
        open.add(n);
      }
    }
  }
  return -1; // no path
}
