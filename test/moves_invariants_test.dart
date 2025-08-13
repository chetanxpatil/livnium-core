import 'dart:math';
import 'package:test/test.dart';
import 'package:livnium_core/livnium_core.dart';

void main() {
  test('permutation invertibility & energy invariants', () {
    final coords = cube3Coords().toList();
    final symbols = List<int>.generate(coords.length, (i) => i);
    final origSymbols = List<int>.from(symbols);
    final origCoords = List<Vec3>.from(coords);

    final rng = Random(1234);
    final faces = Face.values;
    final seq = List.generate(100, (_) {
      final f = faces[rng.nextInt(faces.length)];
      final q = rng.nextInt(3) + 1; // 1..3
      final sign = rng.nextBool() ? 1 : -1;
      return FaceMove(f, q * sign);
    });

    for (final m in seq) {
      final perm = permutationFor(m);
      applyPerm<int>(symbols, perm);
      // also permute coordinates to track geometry
      final tmp = List<Vec3>.from(coords);
      for (var i = 0; i < perm.length; i++) {
        coords[perm[i]] = tmp[i];
      }
    }

    double energy(List<int> arr) => arr
        .map((d) => symbolEnergy9(valueToSymbol(d)!)!)
        .reduce((a, b) => a + b);
    expect(energy(symbols), equals(energy(origSymbols)));

    final coreCount = coords.where(isCore).length;
    final centerCount = coords.where(isCenter).length;
    final edgeCount = coords.where(isEdge).length;
    final cornerCount = coords.where(isCorner).length;
    expect([
      coreCount,
      centerCount,
      edgeCount,
      cornerCount,
    ], equals([1, 6, 12, 8]));

    final inv = seq.reversed
        .map((m) => FaceMove(m.face, -m.quarterTurns))
        .toList(growable: false);
    applyMoves(symbols, inv);
    for (final m in inv) {
      final perm = permutationFor(m);
      final tmp = List<Vec3>.from(coords);
      for (var i = 0; i < perm.length; i++) {
        coords[perm[i]] = tmp[i];
      }
    }
    expect(symbols, equals(origSymbols));
    expect(coords, equals(origCoords));
  });
}
