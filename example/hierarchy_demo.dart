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

  // Compute child's majority and assert root reflects it.
  final child = tree.getOrCreate(childPath);
  final counts = List<int>.filled(27, 0);
  for (final d in child.symbols) counts[d]++;
  var arg = 0, best = -1;
  for (var k = 0; k < 27; k++) {
    if (counts[k] > best) {
      best = counts[k];
      arg = k;
    }
  }
  final after = valueToSymbol(tree.getSymbol(root, slotS));
  final maj = valueToSymbol(arg);
  print('Root slot "s": majority(child)="$maj", after="$after"');
  assert(after == maj);
}
