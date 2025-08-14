import 'package:livnium_core/livnium_core.dart';

void main() {
  final cube = MicroCube();
  final core = CoreBit(cube);
  print('Initial center: ' + valueToSymbol(cube.symbols[13])!);
  final g = symbolToValue('g')!;
  core.configureCenter(g, 1.0);
  core.relax(maxIters: 5);
  print('Biased center: ' + valueToSymbol(cube.symbols[13])!);
}
