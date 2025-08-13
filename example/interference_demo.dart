import 'package:livnium_core/livnium_core.dart';

void main() {
  final top = rankTopCouplers(CouplerParams(tau0: 1, alpha: 1), 2);
  final c1 = top[0].C;
  final c2 = top[1].C;
  for (var deg = 0; deg <= 360; deg += 15) {
    final mag = complexSumMagnitude([(c1, 0.0), (c2, deg.toDouble())]);
    print('$deg,$mag');
  }
}
