/// lib/src/energy.dart
/// -------------------
/// Livnium Core – Symbolic energy calculations
///
/// Each symbol has an "exposure" = how many faces are visible on a solved cube.
/// Energy is exposure × `unitE` (unit energy per face).
///
/// Face exposure mapping:
///   • Core centre (0 faces)   → energy 0
///   • Face centres (1 face)   → energy 9
///   • Edges (2 faces)         → energy 18
///   • Corners (3 faces)       → energy 27
///
/// Totals (solved state):
///   • 6 face centres  → 6 × 9  = 54
///   • 12 edges        → 12 × 18 = 216
///   • 8 corners       → 8 × 27 = 216
///   • Sum = 486 total cube energy (invariant under legal rotations)

library;

/// ---------- constants ----------
const int _base = 27;
const double _unitE = _base / 3; // 27 / 3 = 9.0 per visible face

/// Face exposure table: symbol → number of visible faces
///
/// Adjust this to match your canonical cube mapping.
/// All non-core symbols must be assigned 1, 2, or 3.
const Map<String, int> _exposure = {
  // Core centre
  '0': 0,

  // Corners (3 faces) – 8 total
  'a': 3, 'e': 3, 'i': 3, 'l': 3,
  'o': 3, 'r': 3, 'v': 3, 'y': 3,

  // Edges (2 faces) – 12 total
  'b': 2, 'd': 2, 'f': 2, 'h': 2,
  'j': 2, 'm': 2, 'n': 2, 'q': 2,
  's': 2, 'u': 2, 'w': 2, 'z': 2,

  // Face centres (1 face) – 6 total
  'c': 1, 'g': 1, 'k': 1,
  'p': 1, 't': 1, 'x': 1,
};

/// ---------- helpers ----------

/// Convert visible face count → symbolic energy.
double _facesToEnergy(int faces) => faces * _unitE;

/// Energy of one symbol. Returns 0 if symbol unknown.
double symbolEnergy(String glyph) =>
    _facesToEnergy(_exposure[glyph] ?? 0);

/// Total symbolic energy of a Livnium word.
/// If any glyph is invalid, returns 0.
double symbolicEnergy(String word) {
  double total = 0;
  for (final ch in word.split('')) {
    final e = symbolEnergy(ch);
    if (e == 0 && !_exposure.containsKey(ch)) {
      return 0; // invalid symbol
    }
    total += e;
  }
  return total;
}

/// ---------- cube-wide constants ----------

const double centreE = _unitE;      // 9
const double edgeE   = 2 * _unitE;  // 18
const double cornerE = 3 * _unitE;  // 27

const double totalCubeEnergy =
    6 * centreE + 12 * edgeE + 8 * cornerE; // 486

/// Equilibrium constant = Σ(total cubelets / count by type)
const double equilibriumConstant =
    27 / 8 + 27 / 12 + 27 / 6; // 10.125
