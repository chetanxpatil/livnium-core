import 'package:test/test.dart';
import 'package:livnium_core/livnium_core.dart';

void main() {
  test('coupler magnitudes match K splits (tau0=1, alpha=1)', () {
    const K = 10.125;
    final p = CouplerParams(tau0: 1, alpha: 1);
    // L1=1 center
    expect(couplingAt(const Vec3(1, 0, 0), p), closeTo(K, 1e-12));
    // L1=2 edge
    expect(
      couplingAt(const Vec3(1, 1, 0), p),
      closeTo(K / 2 / 2, 1e-12),
    ); // 2.53125
    // L1=3 corner
    expect(
      couplingAt(const Vec3(1, 1, 1), p),
      closeTo(K / 3 / 3, 1e-12),
    ); // 1.125
  });
}
