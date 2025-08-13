import 'package:test/test.dart';
import 'package:livnium_core/livnium_core.dart';

void main() {
  test('Potts network recovers stored pattern', () {
    final net = Potts27.cube();
    final pattern = List<int>.filled(net.n, 1);
    net.store([pattern]);

    final noisy = List<int>.from(pattern);
    noisy[0] = 2;
    noisy[5] = 3;
    for (var i = 0; i < net.n; i++) {
      net.s[i] = noisy[i];
    }

    net.relax();

    expect(net.s, equals(pattern));
  });
}
