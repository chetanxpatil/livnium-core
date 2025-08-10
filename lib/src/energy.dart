library;

import 'alphabet.dart';

/// Symbol exposure classes for glyphs (conventional mapping)
/// 0 -> core(0 faces); a..f -> centers(1); g..r -> edges(2); s..z -> corners(3).
enum SymbolClass { core, center, edge, corner }

int facesForGlyph(String ch) {
  if (ch == '0') return 0;
  final v = symbolToValue(ch);
  if (v == null) return -1;
  if (v >= 1 && v <= 6) return 1; // a..f
  if (v >= 7 && v <= 18) return 2; // g..r
  if (v >= 19 && v <= 26) return 3; // s..z
  return -1;
}

/// SE = (faces/3) * 27 → centers 9, edges 18, corners 27
double symbolEnergy(String ch) {
  final f = facesForGlyph(ch);
  if (f < 0) return 0;
  return (f / 3.0) * 27.0;
}

double wordEnergy(String word) {
  double total = 0;
  for (final ch in word.split('')) {
    final e = symbolEnergy(ch);
    if (e == 0 && symbolToValue(ch) == null) return 0; // invalid glyph
    total += e;
  }
  return total;
}

/// Equilibrium constant (harmonic signature)
double equilibriumConstant() => 10.125;

/// Per-face unit energy (Concentration Law): 10.125 / faces
double perFaceUnitEnergy(int faces) {
  if (faces <= 0) throw ArgumentError('faces must be 1..3');
  return equilibriumConstant() / faces;
}
