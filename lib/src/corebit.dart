library;

import 'alphabet.dart';
import 'potts.dart';
import 'tree.dart';

/// Wrapper for biasing the center (slot 13) of a [MicroCube].
class CoreBit {
  final MicroCube cube;
  CoreBit(this.cube);

  /// Bias the center toward [digit] with strength [beta].
  void configureCenter(int digit, double beta) {
    if (digit < 0 || digit >= Potts27.q) {
      throw RangeError.range(digit, 0, Potts27.q - 1, 'digit');
    }
    final vec = List<double>.filled(Potts27.q, 0.0);
    vec[digit] = beta;
    cube.potts.setBias({13: vec});
  }

  /// Perform a local relaxation to observe the bias effect.
  void relax({int maxIters = 10}) => cube.stepLocal(maxIters: maxIters);

  /// Current symbol at the center slot.
  int get centerSymbol => cube.symbols[13];

  /// Convenience: center symbol as a single-character word.
  String get centerSymbolString => valueToSymbol(centerSymbol) ?? '?';
}
