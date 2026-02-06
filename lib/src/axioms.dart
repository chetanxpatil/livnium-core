import 'coordinates.dart';

/// A2: Observer Anchor — global observer at center (N-1)/2 for each axis.
int globalObserverCenter(int n) => (n - 1) >> 1;

/// A3: Symbolic Weight — base weight = 3^exposure. Exposure = count of components == (N-1)/2.
/// Core (0), Center (9), Edge (18), Corner (27).
int symbolicWeightBase(LatticeCoord c) {
  final e = c.exposure(c.n);
  return _pow3(e);
}

int _pow3(int e) {
  if (e <= 0) return 1;
  var r = 1;
  for (var i = 0; i < e; i++) r *= 3;
  return r;
}

/// Cell structural class by exposure: 0=Core, 1=Center, 2=Edge, 3=Corner.
int structuralClass(LatticeCoord c) => c.exposure(c.n);
