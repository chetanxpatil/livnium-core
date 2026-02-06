import 'coordinates.dart';
import 'axioms.dart';
import 'derived.dart';
import 'rotation.dart';

/// Single cell: coordinate, base weight (A3), effective weight (for basin dynamics), stability, active.
class Cell {
  final LatticeCoord coord;
  final int swBase;
  double swEffective;
  int stabilityIndex;
  bool active;

  Cell({
    required this.coord,
    required this.swBase,
    double? swEffective,
    this.stabilityIndex = 0,
    this.active = false,
  }) : swEffective = swEffective ?? swBase.toDouble();

  Cell copyWith({
    double? swEffective,
    int? stabilityIndex,
    bool? active,
  }) {
    return Cell(
      coord: coord,
      swBase: swBase,
      swEffective: swEffective ?? this.swEffective,
      stabilityIndex: stabilityIndex ?? this.stabilityIndex,
      active: active ?? this.active,
    );
  }
}

/// Full lattice state for dimension N (odd). Cells indexed by linear index or (x,y,z).
class LatticeState {
  final int n;
  late final List<Cell> _cells;
  final Map<LatticeCoord, int> _indexByCoord = {};

  LatticeState(this.n) {
    assert(n > 0 && n % 2 == 1);
    final list = <Cell>[];
    for (var x = 0; x < n; x++) {
      for (var y = 0; y < n; y++) {
        for (var z = 0; z < n; z++) {
          final c = LatticeCoord(n, x, y, z);
          final sw = symbolicWeightBase(c);
          list.add(Cell(coord: c, swBase: sw, swEffective: sw.toDouble()));
          _indexByCoord[c] = list.length - 1;
        }
      }
    }
    _cells = list;
    // D2: Ledger must equal 9*N^2. Normalize initial effective weights.
    final target = totalEnergySymbolic(n);
    final current = list.fold<double>(0.0, (s, c) => s + c.swEffective);
    if (current > 0) {
      final scale = target / current;
      for (final cell in list) cell.swEffective *= scale;
    }
  }

  int get dimension => n;
  List<Cell> get cells => List.unmodifiable(_cells);
  int get length => _cells.length;

  Cell cellAt(int x, int y, int z) {
    final c = LatticeCoord(n, x, y, z);
    return _cells[_indexByCoord[c]!];
  }

  Cell cellAtCoord(LatticeCoord c) => _cells[_indexByCoord[c]!];

  /// Alias for [cellAtCoord] for cognition/API symmetry (e.g. GrowthMind).
  Cell getCellAt(LatticeCoord c) => cellAtCoord(c);

  /// Applies a quarter-turn rotation at coordinate [c]: swaps mutable content
  /// (swEffective, active, stabilityIndex) with the cell at the rotated coordinate.
  /// Preserves D2: total effective weight unchanged (permutation).
  void applyRotationAt(LatticeCoord c, int axis, int turns) {
    final other = rotateQuarter(c, axis, turns);
    if (other == c) return;
    final i = _indexByCoord[c]!;
    final j = _indexByCoord[other]!;
    final a = _cells[i];
    final b = _cells[j];
    final sw = a.swEffective;
    a.swEffective = b.swEffective;
    b.swEffective = sw;
    final st = a.stabilityIndex;
    a.stabilityIndex = b.stabilityIndex;
    b.stabilityIndex = st;
    final ac = a.active;
    a.active = b.active;
    b.active = ac;
  }

  /// Active cells (A6): designated active or participating in non-neutral rotation.
  List<Cell> get active_cells => _cells.where((c) => c.active).toList();

  /// Total effective weight (must be renormalized to D2 after basin updates).
  double get totalEffectiveWeight =>
      _cells.fold<double>(0.0, (s, c) => s + c.swEffective);

  /// D2 target total (ledger) = 9*N^2.
  double get totalBaseWeight => totalEnergySymbolic(n);

  /// Class counts from current geometry (for D3 audit).
  Map<int, int> get classCounts {
    final counts = <int, int>{0: 0, 1: 0, 2: 0, 3: 0};
    for (final c in _cells) {
      final k = structuralClass(c.coord);
      counts[k] = (counts[k] ?? 0) + 1;
    }
    return counts;
  }
}
