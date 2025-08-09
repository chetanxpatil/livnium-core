// lib/src/projector.dart
// ----------------------
// Livnium frequency projection in 3D space.
//
// Field model (scalar):
//   F(x,t) = Σ_j  A_j * cos(ω_j t - k_j |x - p_j| + φ_j) * K(|x - p_j|)
// where
//   A_j  ∝ symbolicEnergy(glyph_j) / 27
//   ω_j  = 2π f0 (1 + beta * SE/27)
//   k_j  = ω_j / c
//   K(r) = 1 / (1 + r^2)     // stable near-field falloff
//
// Notes:
// - Uses single-glyph alphabet only ('0'..'z'); no composite 'a0' digit.
// - You can inject your own positions map to match your physical layout.

library;

import 'dart:math' as math;
import 'rotation.dart' show Vec3;   // Vec3(x,y,z)
import 'energy.dart'  show symbolEnergy;
import 'alphabet.dart' show symbolToValue;

/// Default canonical positions on the 3×3×3 lattice (z+ faces the observer).
/// You can replace this with your canonical map if you already have one.
/// Here’s a simple, deterministic layout:
///
///   - Core '0' at (0,0,0)
///   - Corners (a,b,c,d,e,f,s,t,u,v,w,x,y,z) → the 8 coords with 3 nonzeros
///   - Edges g..r → 12 coords with 2 nonzeros
///   - Centers (x y z i r w) → 6 coords with 1 nonzero
///
/// Feel free to swap symbols to match your whitepaper’s specific bands.
final Map<String, Vec3> _defaultPositions = {
  // core
  '0': const Vec3(0, 0, 0),

  // corners (3-face exposure) — choose a fixed order
  'a': const Vec3( 1,  1,  1),
  'b': const Vec3(-1,  1,  1),
  'c': const Vec3(-1, -1,  1),
  'd': const Vec3( 1, -1,  1),
  'e': const Vec3( 1,  1, -1),
  'f': const Vec3(-1,  1, -1),
  's': const Vec3(-1, -1, -1),
  't': const Vec3( 1, -1, -1),

  // edges (2-face exposure)
  'g': const Vec3( 0,  1,  1),
  'h': const Vec3(-1,  0,  1),
  'i': const Vec3( 0, -1,  1),
  'j': const Vec3( 1,  0,  1),
  'k': const Vec3( 0,  1, -1),
  'l': const Vec3(-1,  0, -1),
  'm': const Vec3( 0, -1, -1),
  'n': const Vec3( 1,  0, -1),
  'o': const Vec3( 1,  1,  0),
  'p': const Vec3(-1,  1,  0),
  'q': const Vec3(-1, -1,  0),
  'r': const Vec3( 1, -1,  0),

  // centers (1-face exposure)
  'x': const Vec3( 1,  0,  0), // +X
  'y': const Vec3(-1,  0,  0), // -X
  'z': const Vec3( 0,  1,  0), // +Y
  'w': const Vec3( 0, -1,  0), // -Y
  'i': const Vec3( 0,  0,  1), // +Z (front)
  'u': const Vec3( 0,  0, -1), // -Z (back)
};

double _norm(Vec3 a) => math.sqrt((a.x*a.x + a.y*a.y + a.z*a.z).toDouble());
Vec3 _sub(Vec3 a, Vec3 b) => Vec3(a.x - b.x, a.y - b.y, a.z - b.z);

class LivniumProjector {
  LivniumProjector({
    Map<String, Vec3>? positions,
    this.f0 = 1.0,        // base frequency (arbitrary units)
    this.c = 3.0,         // propagation speed (units / second)
    this.beta = 0.5,      // how much SE modulates frequency
    this.ampScale = 1.0,  // overall amplitude scale
    double? seed,         // optional random phase seed
  }) : _positions = Map.of(positions ?? _defaultPositions) {
    // deterministic mini PRNG for per-glyph phase
    final rnd = _Lcg(seed ?? 12345);
    for (final entry in _positions.keys) {
      if (symbolToValue(entry) != null) {
        _phase[entry] = rnd.nextDouble() * 2 * math.pi; // 0..2π
      }
    }
  }

  final Map<String, Vec3> _positions;
  final Map<String, double> _phase = {};
  final double f0;
  final double c;
  final double beta;
  final double ampScale;

  /// Single-glyph projector contribution at point `x` and time `t`.
  double _glyphField(String ch, Vec3 x, double t) {
    // ignore unknown glyphs
    if (symbolToValue(ch) == null) return 0.0;

    final p = _positions[ch];
    if (p == null) return 0.0;

    final se = symbolEnergy(ch);          // 0,9,18,27
    final A  = ampScale * (se / 27.0);    // 0..1
    if (A == 0.0) return 0.0;

    final dir = _sub(x, p);
    final r   = _norm(dir);               // distance
    final f   = f0 * (1.0 + beta * se / 27.0);
    final w   = 2 * math.pi * f;
    final k   = w / c;
    final ph  = _phase[ch] ?? 0.0;

    // falloff kernel (stable near-field)
    final K = 1.0 / (1.0 + r*r);

    return A * math.cos(w * t - k * r + ph) * K;
  }

  /// Total field at point `x` and time `t` for a whole word.
  double fieldAt(Vec3 x, double t, String word) {
    double sum = 0.0;
    for (final ch in word.split('')) {
      sum += _glyphField(ch, x, t);
    }
    return sum;
  }

  /// Sample a cubic grid from [-R..R]^3 (integer coordinates).
  /// Returns a flat list of (x,y,z,value) tuples.
  List<(int,int,int,double)> sampleGrid(int R, double t, String word) {
    final out = <(int,int,int,double)>[];
    for (int xi = -R; xi <= R; xi++) {
      for (int yi = -R; yi <= R; yi++) {
        for (int zi = -R; zi <= R; zi++) {
          final v = fieldAt(Vec3(xi, yi, zi), t, word);
          out.add((xi, yi, zi, v));
        }
      }
    }
    return out;
  }
}

/// Tiny linear congruential generator for deterministic phases.
class _Lcg {
  int _state;
  _Lcg(double seed) : _state = (seed * 1e6).floor() ^ 0x9E3779B1;
  double nextDouble() {
    _state = (1664525 * _state + 1013904223) & 0x7fffffff;
    return (_state / 0x7fffffff);
  }
}
