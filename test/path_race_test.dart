import 'dart:math';
import 'package:livnium_core/livnium_core.dart';
import 'package:test/test.dart';

void main() {
  group('Path Race: Dijkstra vs Livnium Flow', () {
    test('both solvers find path on empty grid', () {
      const size = 10;
      final start = GridPoint(0, 0);
      final end = GridPoint(9, 9);
      final walls = <GridPoint>{};

      final (dVisits, aVisits, lVisits) = runPathRace(size, start, end, walls);

      expect(dVisits, greaterThan(0));
      expect(aVisits, greaterThan(0));
      expect(lVisits, greaterThan(0));
    });

    test(
        'Livnium expands ≤ Dijkstra on open grid (all report expanded node count)',
        () {
      const size = 20;
      final start = GridPoint(0, 0);
      final end = GridPoint(19, 19);
      final walls = <GridPoint>{};

      final (dExp, aExp, lExp) = runPathRace(size, start, end, walls);

      expect(lExp, lessThanOrEqualTo(dExp),
          reason: 'Livnium (A5 polarity) expands toward target');
      expect(aExp, lessThanOrEqualTo(dExp),
          reason: 'A* heuristic expands fewer than Dijkstra');
    });

    test('race with obstacles: expanded-node comparison (science-grade)', () {
      const size = 15;
      final start = GridPoint(0, 0);
      final end = GridPoint(14, 14);
      final walls = <GridPoint>{
        GridPoint(7, 5),
        GridPoint(7, 6),
        GridPoint(7, 7),
        GridPoint(7, 8),
        GridPoint(7, 9),
      };

      final (dExp, aExp, lExp) = runPathRace(size, start, end, walls);

      expect(dExp, greaterThan(0));
      expect(aExp, greaterThan(0));
      expect(lExp, greaterThan(0));
      print(
          'Expanded nodes — Dijkstra: $dExp | A*: $aExp | Livnium Flow: $lExp');
    });

    test('multiple random grids: expanded-node totals', () {
      final r = Random(42);
      var dTotal = 0, aTotal = 0, lTotal = 0;
      const size = 12;
      const trials = 8;

      for (var t = 0; t < trials; t++) {
        final start = GridPoint(r.nextInt(size), r.nextInt(size));
        var end = GridPoint(r.nextInt(size), r.nextInt(size));
        while (end == start) end = GridPoint(r.nextInt(size), r.nextInt(size));

        final wallCount = r.nextInt(15);
        final walls = <GridPoint>{};
        for (var w = 0; w < wallCount; w++) {
          final p = GridPoint(r.nextInt(size), r.nextInt(size));
          if (p != start && p != end) walls.add(p);
        }

        final (d, a, l) = runPathRace(size, start, end, walls);
        dTotal += d;
        aTotal += a;
        lTotal += l;
      }

      expect(lTotal, lessThanOrEqualTo(dTotal + 50));
      print(
          'Over $trials grids (expanded nodes): Dijkstra $dTotal, A* $aTotal, Livnium $lTotal');
    });

    test('path race with quality: A* path optimal, Livnium path may have gap',
        () {
      const size = 15;
      final start = GridPoint(0, 0);
      final end = GridPoint(14, 14);
      final walls = <GridPoint>{
        GridPoint(7, 5),
        GridPoint(7, 6),
        GridPoint(7, 7),
        GridPoint(7, 8),
      };

      final q = runPathRaceWithQuality(size, start, end, walls);

      expect(q.optimalLen, greaterThan(0));
      expect(q.aStar.found, isTrue);
      expect(q.aStar.pathLen, equals(q.optimalLen),
          reason: 'A* path length must equal optimal');
      expect(q.aStarGap, equals(0));

      expect(q.livniumFlow.expanded, lessThanOrEqualTo(q.dijkstraExpanded));
      // Livnium may or may not find path; if found, pathLen >= optimalLen
      if (q.livniumFlow.found && q.livniumFlow.pathLen > 0) {
        expect(q.livniumFlow.pathLen, greaterThanOrEqualTo(q.optimalLen));
      }
    });
  });

  group('A5 Polarity (getBestGeometricCandidate)', () {
    test('picks point closest to target', () {
      final target = GridPoint(10, 10);
      final candidates = {
        GridPoint(0, 0),
        GridPoint(9, 9),
        GridPoint(5, 5),
        GridPoint(10, 9),
      };
      final best = getBestGeometricCandidate(candidates, target);
      expect(best, GridPoint(10, 9));
    });
  });
}
