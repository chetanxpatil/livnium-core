/// D1: Structural Census — for odd N, closed-form class counts by exposure.
/// Exposure 0 (core): no coord = (N-1)/2 → (N-1)^3 cells.
/// Exposure 1 (centers): 3*(N-1)^2. Exposure 2 (edges): 3*(N-1). Exposure 3 (corner): 1 center cell.

int coreCount(int n) => (n - 1) * (n - 1) * (n - 1);

int centerCount(int n) => 3 * (n - 1) * (n - 1);

int edgeCount(int n) => 3 * (n - 1);

int cornerCount(int n) => 1;

/// Total cells = N^3 (validated for N=3: 27).
int totalCells(int n) => n * n * n;

/// D2: Total Energy — sum of base symbolic weights over all cells = 9 * N^2.
/// (Validation: N=3 -> 9*9=81; N=1 -> 9.)
double totalEnergySymbolic(int n) {
  return 9.0 * n * n;
}

/// Compute total energy from explicit sum (for verification).
double totalEnergyFromWeights(Iterable<int> weights) {
  return weights.fold<double>(0.0, (s, w) => s + w);
}
