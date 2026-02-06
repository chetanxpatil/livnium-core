import 'coordinates.dart';
import 'lattice.dart';
import 'derived.dart';
import 'conservation.dart';

/// Thermodynamic Policy: Tunneling Operator (Rubik's Parity fix).
/// Swap two adjacent cells without rotation — breaks parity traps. "Expensive" (cost factor).

/// True iff two coords share a face (6-neighborhood).
bool areAdjacent(LatticeCoord a, LatticeCoord b) {
  if (a.n != b.n) return false;
  final dx = (a.x - b.x).abs();
  final dy = (a.y - b.y).abs();
  final dz = (a.z - b.z).abs();
  return (dx + dy + dz) == 1;
}

/// True iff two cells are face-adjacent (convenience for Cell arguments).
bool areAdjacentCells(Cell a, Cell b) => areAdjacent(a.coord, b.coord);

/// Swap effective weight, stability, and active flag between two adjacent cells;
/// then apply [costFactor] to both (energy cost). Renormalizes to satisfy D3.
/// Returns true if swap was performed. Accepts either LatticeCoord or Cell.
bool tunnelingSwap(
  LatticeState state,
  LatticeCoord c1,
  LatticeCoord c2, {
  double costFactor = 0.95,
}) {
  if (!areAdjacent(c1, c2)) return false;
  final cell1 = state.cellAtCoord(c1);
  final cell2 = state.cellAtCoord(c2);
  final sw1 = cell1.swEffective;
  final sw2 = cell2.swEffective;
  final st1 = cell1.stabilityIndex;
  final st2 = cell2.stabilityIndex;
  final ac1 = cell1.active;
  final ac2 = cell2.active;
  cell1.swEffective = sw2;
  cell2.swEffective = sw1;
  cell1.stabilityIndex = st2;
  cell2.stabilityIndex = st1;
  cell1.active = ac2;
  cell2.active = ac1;
  cell1.swEffective *= costFactor;
  cell2.swEffective *= costFactor;
  normalizeGlobalLedger(state);
  return true;
}

/// Same as [tunnelingSwap] but accepts [Cell] arguments (convenience).
bool tunnelingSwapCells(
  LatticeState state,
  Cell cellA,
  Cell cellB, {
  double costFactor = 0.95,
}) =>
    tunnelingSwap(state, cellA.coord, cellB.coord, costFactor: costFactor);
