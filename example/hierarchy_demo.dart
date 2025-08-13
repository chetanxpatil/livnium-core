import 'package:livnium_core/livnium_core.dart';

void main() {
  final tree = LivniumTree(energyPerNode: 10.125);
  final root = CubePath.parse('');
  final slotS = symbolToValue('s')!;

  // Seed root with a repeating word pattern.
  final ds = stringToDigits('unity')!;
  for (var i = 0; i < 27; i++) {
    tree.setSymbol(root, i, ds[i % ds.length]);
  }

  // Create child under slot 's' and set a sharper sub-pattern.
  final childPath = CubePath.parse('s');
  final sub = stringToDigits('love')!;
  for (var i = 0; i < 27; i++) {
    tree.setSymbol(childPath, i, sub[i % sub.length]);
  }

  // Evolve two rounds to propagate information.
  tree.evolve(maxDepth: 2, biasStrength: 0.2, localIters: 10);
  tree.evolve(maxDepth: 2, biasStrength: 0.2, localIters: 10);

  final rootS = tree.getSymbol(root, slotS);
  print('Root slot "s" now = ${valueToSymbol(rootS)}');
}

