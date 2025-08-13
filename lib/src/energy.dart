library;

import 'alphabet.dart';

/// Symbol exposure classes (how many faces a cubelet would expose)
/// 0 → core (0 faces), 1 → face center, 2 → edge, 3 → corner.
/// We map these to glyph ranges:
///   '0'                → core (0)
///   'a'..'f'  (1..6)   → centers (1)
///   'g'..'r'  (7..18)  → edges   (2)
///   's'..'z'  (19..26) → corners (3)
enum SymbolClass { core, center, edge, corner }

/// Internal value ranges for each class (inclusive).
const _kCenterRange = (min: 1, max: 6);
const _kEdgeRange = (min: 7, max: 18);
const _kCornerRange = (min: 19, max: 26);

/// Returns the exposure class for a single glyph.
/// - '0' → 0 faces (core)
/// - a..f → 1 face (center)
/// - g..r → 2 faces (edge)
/// - s..z → 3 faces (corner)
/// Returns -1 if glyph is invalid.
int facesForGlyph(String ch) {
  if (ch == '0') return 0;
  final v = symbolToValue(ch);
  if (v == null) return -1;
  if (v >= _kCenterRange.min && v <= _kCenterRange.max) return 1;
  if (v >= _kEdgeRange.min && v <= _kEdgeRange.max) return 2;
  if (v >= _kCornerRange.min && v <= _kCornerRange.max) return 3;
  return -1;
}

/// Enum classifier (more ergonomic for switch/case).
SymbolClass? symbolClassForGlyph(String ch) {
  final f = facesForGlyph(ch);
  return switch (f) {
    0 => SymbolClass.core,
    1 => SymbolClass.center,
    2 => SymbolClass.edge,
    3 => SymbolClass.corner,
    _ => null,
  };
}

/// Safety: is this glyph valid in our alphabet AND mapped to a class?
bool isValidGlyph(String ch) => facesForGlyph(ch) >= 0;

/// Equilibrium constant K — harmonic signature of the 3×3×3 structure.
/// Derivation:
///   K = 27 * (1/8 + 1/12 + 1/6) = 27 * (9/24) = 81/8 = 10.125
/// where 8,12,6 are the multiplicities of corners/edges/centers.
const double equilibriumConstant = 27 / 8 + 27 / 12 + 27 / 6; // 10.125

/// Per-face “unit energy” per your Concentration Law:
///   unit(faces) = 10.125 / faces   for faces ∈ {1,2,3}.
double perFaceUnitEnergy(int faces) {
  if (faces <= 0 || faces > 3) {
    throw ArgumentError('faces must be 1..3');
  }
  return equilibriumConstant / faces;
}

/// Symbol Energy on the 9/18/27 scale.
///   SE9 = (faces / 3) * 27
/// So:
///   center (1 face) →  9
///   edge   (2 face) → 18
///   corner (3 face) → 27
/// core (0 face) gets 0 by definition here.
double? symbolEnergy9(String ch) {
  final f = facesForGlyph(ch);
  if (f < 0) return null; // invalid glyph
  return (f / 3.0) * 27.0;
}

/// Sum energy across a word; returns 0 if any glyph is invalid.
double? wordEnergy9(String word) {
  double total = 0;
  for (final ch in word.split('')) {
    final e = symbolEnergy9(ch);
    if (e == null) return null;
    total += e;
  }
  return total;
}

/// Symbol energy measured in units of the equilibrium constant K.
///   core (0 faces)   → 0
///   center (1 face)  → 1K
///   edge   (2 faces) → 2K
///   corner (3 faces) → 3K
double? symbolEnergyK(String ch) {
  final f = facesForGlyph(ch);
  if (f <= 0) return (f == 0) ? 0.0 : null; // core=0, invalid=null
  return equilibriumConstant * f;
}

/// Sum energy in K-units across a word; returns null if any glyph is invalid.
double? wordEnergyK(String word) {
  double total = 0;
  for (final ch in word.split('')) {
    final e = symbolEnergyK(ch);
    if (e == null) return null;
    total += e;
  }
  return total;
}

/// Optional: quick invariants + examples. Call in a demo/test target.
void _selfTestSymbolEnergy9() {
  // Class boundaries
  assert(facesForGlyph('0') == 0);
  for (final ch in ['a', 'b', 'c', 'd', 'e', 'f']) {
    assert(facesForGlyph(ch) == 1);
  }
  for (final ch in [
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
  ]) {
    assert(facesForGlyph(ch) == 2);
  }
  for (final ch in ['s', 't', 'u', 'v', 'w', 'x', 'y', 'z']) {
    assert(facesForGlyph(ch) == 3);
  }

  // Energies match the stated rule.
  assert(symbolEnergy9('a') == 9.0);
  assert(symbolEnergy9('g') == 18.0);
  assert(symbolEnergy9('s') == 27.0);
  assert(symbolEnergy9('0') == 0.0);
  assert(symbolEnergy9('?') == null);

  // Per-face unit energy sanity
  assert(perFaceUnitEnergy(1) == 10.125);
  assert(perFaceUnitEnergy(2) == 5.0625);
  assert(perFaceUnitEnergy(3) == 3.375);

  // Word energy examples
  assert(wordEnergy9('a') == 9.0);
  assert(wordEnergy9('ag') == 27.0); // 9 + 18
  assert(wordEnergy9('as') == 36.0); // 9 + 27
  assert(wordEnergy9('a?') == null);

  // K-scale energy checks
  assert(symbolEnergyK('a') == equilibriumConstant);
  assert(symbolEnergyK('g') == equilibriumConstant * 2);
  assert(symbolEnergyK('s') == equilibriumConstant * 3);
  assert(symbolEnergyK('0') == 0.0);
  assert(symbolEnergyK('?') == null);
  assert(wordEnergyK('a') == equilibriumConstant);
  assert(wordEnergyK('ag') == equilibriumConstant * 3);
  assert(wordEnergyK('as') == equilibriumConstant * 4);
  assert(wordEnergyK('a?') == null);
}
