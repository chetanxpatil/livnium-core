// Livnium tunnels: radial paths to zero + resonance math.
library;

import 'dart:math' as math;

class LivniumTunnel {
  final int x, y, z; // cubelet coord in {-1,0,1}
  LivniumTunnel(this.x, this.y, this.z) {
    assert(!(x == 0 && y == 0 && z == 0), 'core has no tunnel');
  }

  // Manhattan distance to core (steps).
  int get L => x.abs() + y.abs() + z.abs(); // 1,2,3

  // Visible faces (centers=1, edges=2, corners=3).
  int get faces => [x, y, z].where((v) => v != 0).length;

  // Per your concentration law.
  static const double K = 10.125; // capacity per cubelet
  double get eFace => K / faces;

  // Two amplitude models: per-face vs path-loss. Pick what you need.
  double ampPerFace() => eFace;
  double ampPathLoss() => K / L;

  // Harmonic ladder on this tunnel for timestep tau0.
  double freq(int k, double tau0) => k / (L * tau0);
}

// sinc helper: sin(pi*x)/(pi*x)
double _sinc(double x) {
  final px = math.pi * x;
  if (px.abs() < 1e-12) return 1.0;
  return math.sin(px) / px;
}

/// Coupling strength from a single tunnel into a core mode.
/// - fTunnel: k/(L*tau0)
/// - fCore: chosen core resonance
/// - amp: amplitude budget (e.g., K/L or K/f)
double coupling(double fTunnel, double fCore, double amp) {
  final delta = (fTunnel - fCore) / (fCore == 0 ? 1.0 : fCore);
  return amp * _sinc(delta);
}

/// Sum multiple tunnels at the core, with optional phases for interference.
double sumAtCore(List<double> couplings, {List<double>? phases}) {
  if (phases == null) {
    // incoherent sum (magnitudes)
    return couplings.fold(0.0, (a, b) => a + b);
  }
  // coherent vector sum
  double re = 0, im = 0;
  for (var i = 0; i < couplings.length; i++) {
    final a = couplings[i];
    final phi = phases[i];
    re += a * math.cos(phi);
    im += a * math.sin(phi);
  }
  return math.sqrt(re * re + im * im);
}

/// Generate all non-core cubelets in {-1,0,1}^3.
Iterable<LivniumTunnel> allTunnels() sync* {
  for (final x in const [-1, 0, 1]) {
    for (final y in const [-1, 0, 1]) {
      for (final z in const [-1, 0, 1]) {
        if (x == 0 && y == 0 && z == 0) continue;
        yield LivniumTunnel(x, y, z);
      }
    }
  }
}
