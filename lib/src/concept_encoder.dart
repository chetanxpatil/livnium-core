import 'coordinates.dart';
import 'growth_mind.dart';

/// Phase 3 (Input): Translates raw data (pixels) into geometric rotations (thoughts).
///
/// Maps a 2D grid onto the Z=0 face of the 3D lattice. Active pixels above
/// [threshold] trigger a Z-axis rotation at the corresponding (x, y, 0) cell,
/// "drilling" the pixel into the lattice depth while preserving D2.
class ConceptEncoder {
  final GrowthMind mind;

  ConceptEncoder(this.mind);

  /// Encodes a 2D grayscale image (values 0.0 to 1.0) onto the lattice surface (z=0).
  ///
  /// * [pixels]: Row-major grid of intensities (pixels[y][x]).
  /// * [threshold]: Minimum intensity to trigger a rotation (default 0.5).
  ///
  /// Image dimensions must match the lattice face size (n×n).
  /// If [mind.learner] is set, co-occurring active coords are recorded for Phase 5 learning.
  void encodeImage(List<List<double>> pixels, {double threshold = 0.5}) {
    final n = mind.state.n;

    if (pixels.length != n || pixels[0].length != n) {
      throw ArgumentError(
          'Image size ${pixels.length}x${pixels[0].length} does not match '
          'lattice face ${n}x$n');
    }

    final activeCoords = <LatticeCoord>[];
    for (int y = 0; y < n; y++) {
      for (int x = 0; x < n; x++) {
        final intensity = pixels[y][x];
        if (intensity >= threshold) {
          final coord = LatticeCoord(n, x, y, 0);
          activeCoords.add(coord);
          mind.perceive(coord, 2, 1);
        }
      }
    }
    if (activeCoords.length >= 2) mind.recordCoactivation(activeCoords);
  }
}
