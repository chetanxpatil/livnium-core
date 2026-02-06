/// A1: Generalized Spatial Alphabet — coordinates on cubic lattice of dimension N (N odd).
/// The set Z_N^3 = { (x,y,z) : 0 <= x,y,z < N }.
class LatticeCoord {
  final int x;
  final int y;
  final int z;
  final int n;

  LatticeCoord(this.n, this.x, this.y, this.z) {
    if (n <= 0 || n % 2 != 1) throw ArgumentError('N must be odd');
    if (x < 0 || x >= n || y < 0 || y >= n || z < 0 || z >= n) {
      throw ArgumentError('Coordinates must be in [0, N)');
    }
  }

  int get dimension => n;

  /// A3: Exposure — number of components equal to (N-1)/2 (the "center" index).
  int exposure(int n) {
    final c = (n - 1) >> 1;
    var e = 0;
    if (x == c) e++;
    if (y == c) e++;
    if (z == c) e++;
    return e;
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is LatticeCoord &&
          n == other.n &&
          x == other.x &&
          y == other.y &&
          z == other.z;

  @override
  int get hashCode => Object.hash(n, x, y, z);

  @override
  String toString() => '($x,$y,$z)_$n';
}
