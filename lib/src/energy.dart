/// livnium_core – energy.dart  (patched)
library;

import 'alphabet.dart' as alpha show symbolToValue;

/// ---------- constants ----------
const int _base = 27;
const double _unitE = _base / 3;               // 9.0 per face

/* face-exposure table (adjust to your canonical mapping) */
const Map<String, int> _exposure = {
  '0': 0,                               // core

  // centres (example band)
  'x': 1, 'y': 1, 'z': 1, 'i': 1, 'r': 1, 'w': 1,

  // edges
  'g': 2, 'h': 2, 'j': 2, 'k': 2, 'l': 2,
  'm': 2, 'n': 2, 'o': 2, 'p': 2, 'q': 2,

  // corners
  'a': 3, 'b': 3, 'c': 3, 'd': 3, 'e': 3, 'f': 3,
  's': 3, 't': 3, 'u': 3, 'v': 3,
};

/* ---------- helpers ---------- */

double _facesToEnergy(int faces) => faces * _unitE;

/// Energy of one glyph (0 → invalid / unknown).
double symbolEnergy(String glyph) =>
    _facesToEnergy(_exposure[glyph] ?? 0);

/// Total symbolic energy for a Livnium word.
/// Returns 0 ·E if **any** glyph is invalid.
double symbolicEnergy(String word) {
  double total = 0;
  for (final ch in word.split('')) {
    total += symbolEnergy(ch);
  }
  return total;
}

/* ---------- cube-wide constants ---------- */

const double centreE = _unitE;           // 9
const double edgeE   = 2 * _unitE;       // 18
const double cornerE = 3 * _unitE;       // 27

const double totalCubeEnergy =
    6 * centreE + 12 * edgeE + 8 * cornerE;          // 486

const double equilibriumConstant = 27 / 8 + 27 / 12 + 27 / 6; // 10.125
