import 'package:livnium_core/livnium_core.dart';
import 'package:test/test.dart';

void main() {
  test('core bit biases center cell', () {
    final cube = MicroCube();
    for (var i = 0; i < 27; i++) cube.symbols[i] = 0;
    final core = CoreBit(cube);
    final digit = symbolToValue('g')!;
    core.configureCenter(digit, 1.0);
    core.relax(maxIters: 1);
    expect(cube.symbols[13], equals(digit));
  });
}
