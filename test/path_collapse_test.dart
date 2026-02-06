import 'package:livnium_core/livnium_core.dart';
import 'package:test/test.dart';

void main() {
  group('Path Collapse (relaxation / geodesic)', () {
    test('collapse finds path from start to end on empty grid', () {
      const size = 10;
      final start = GridPoint(0, 0);
      final end = GridPoint(9, 9);
      final path = runPathCollapse(size, start, end, <GridPoint>{});
      expect(path.first, start);
      expect(path.last, end);
      expect(path.length, greaterThanOrEqualTo(2));
    });

    test('path does not cross walls', () {
      const size = 8;
      final start = GridPoint(0, 0);
      final end = GridPoint(7, 7);
      final walls = {
        GridPoint(3, 3),
        GridPoint(3, 4),
        GridPoint(4, 3),
        GridPoint(4, 4)
      };
      final path = runPathCollapse(size, start, end, walls, iterations: 150);
      for (final p in path) {
        expect(walls.contains(p), isFalse);
      }
      expect(path.first, start);
      expect(path.last, end);
    });

    test('potential field relaxes: end stays 0, start stays high', () {
      const size = 5;
      final start = GridPoint(0, 0);
      final end = GridPoint(4, 4);
      final grid = runPotentialCollapse(size, start, end, <GridPoint>{},
          iterations: 100);
      expect(grid[end.y * size + end.x], 0.0);
      expect(grid[start.y * size + start.x], 100.0);
    });

    test('extractPathFromPotentials returns steepest descent', () {
      const size = 4;
      final start = GridPoint(0, 0);
      final end = GridPoint(3, 3);
      final grid =
          runPotentialCollapse(size, start, end, <GridPoint>{}, iterations: 80);
      final path =
          extractPathFromPotentials(size, start, end, <GridPoint>{}, grid);
      expect(path.first, start);
      expect(path.last, end);
      for (var i = 1; i < path.length; i++) {
        final prev = path[i - 1];
        final cur = path[i];
        final dx = (cur.x - prev.x).abs() + (cur.y - prev.y).abs();
        expect(dx, 1, reason: 'consecutive path points must be neighbors');
      }
    });

    test('runPathCollapseWithStats returns cellUpdates and iterationsUsed', () {
      const size = 6;
      final start = GridPoint(0, 0);
      final end = GridPoint(5, 5);
      final result = runPathCollapseWithStats(
        size,
        start,
        end,
        <GridPoint>{},
        maxIterations: 100,
        epsilon: 1e-4,
      );
      expect(result.path.first, start);
      expect(result.path.last, end);
      expect(result.cellUpdates, greaterThan(0));
      expect(result.iterationsUsed, greaterThan(0));
      expect(result.pathLength, result.path.length);
    });
  });
}
