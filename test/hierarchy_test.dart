import 'package:test/test.dart';
import 'package:livnium_core/livnium_core.dart';

void main() {
  group('hierarchical tree', () {
    test('27 per system invariant', () {
      final cube = MicroCube();
      expect(cube.symbols.length, 27);
      final c0 = cube.ensureChild(0);
      final c1 = cube.ensureChild(1);
      expect(cube.symbols.length, 27);
      expect(c0.symbols.length, 27);
      expect(c1.symbols.length, 27);
    });

    test('pooling takes child majority', () {
      final parent = MicroCube();
      final child = parent.ensureChild(3);
      for (var i = 0; i < 27; i++) {
        child.symbols[i] = 4;
      }
      child.symbols[0] = 2; // slight minority
      parent.pullFromChildren();
      expect(parent.symbols[3], 4);
    });

    test('enforces max 27 children and validates indices', () {
      final cube = MicroCube();
      for (var i = 0; i < 27; i++) {
        cube.ensureChild(i);
      }
      expect(cube.children.length, 27);
      expect(() => cube.ensureChild(27), throwsRangeError);
      expect(() => cube.ensureChild(-1), throwsRangeError);
      // Reusing existing child does not increase count
      final c1 = cube.ensureChild(5);
      final c2 = cube.ensureChild(5);
      expect(identical(c1, c2), isTrue);
      expect(cube.children.length, 27);
    });

    test('bias flows from parent to child center', () {
      final parent = MicroCube();
      final child = parent.ensureChild(5);
      parent.symbols[5] = 6; // digit to bias toward
      // child ambiguous zeros
      for (var i = 0; i < 27; i++) {
        child.symbols[i] = 0;
      }
      parent.pushBiasToChildren(0.3);
      child.stepLocal(maxIters: 1);
      expect(child.symbols[13], 6);
    });

    test('evolve aligns parent with child majority', () {
      final tree = LivniumTree();
      final root = CubePath.parse('');
      final slotS = symbolToValue('s')!;
      final ds = stringToDigits('unity')!;
      for (var i = 0; i < 27; i++) {
        tree.setSymbol(root, i, ds[i % ds.length]);
      }
      final childPath = CubePath.parse('s');
      final sub = stringToDigits('love')!;
      for (var i = 0; i < 27; i++) {
        tree.setSymbol(childPath, i, sub[i % sub.length]);
      }
      final before = tree.getSymbol(root, slotS);
      tree.evolve(maxDepth: 2, biasStrength: 0.2, localIters: 10);
      tree.evolve(maxDepth: 2, biasStrength: 0.2, localIters: 10);
      final after = tree.getSymbol(root, slotS);
      final child = tree.getOrCreate(childPath);
      final counts = List<int>.filled(27, 0);
      for (final d in child.symbols) counts[d]++;
      var arg = 0;
      var best = -1;
      for (var k = 0; k < 27; k++) {
        if (counts[k] > best) {
          best = counts[k];
          arg = k;
        }
      }
      expect(before, isNot(equals(arg)));
      expect(after, equals(arg));
    });
  });
}
