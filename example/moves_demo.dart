import 'package:livnium_core/livnium_core.dart';

void main() {
  final symbols = List<int>.generate(27, (i) => i);
  final orig = List<int>.from(symbols);

  final seq = [FaceMove(Face.U, 1), FaceMove(Face.R, 1), FaceMove(Face.F, -1)];

  print('start     : $orig');
  applyMoves(symbols, seq);
  print('scrambled : $symbols');

  double energy(List<int> arr) =>
      arr.map((d) => symbolEnergy9(valueToSymbol(d)!)!).reduce((a, b) => a + b);
  print('energy orig=${energy(orig)} after=${energy(symbols)}');

  final inv =
      seq.reversed.map((m) => FaceMove(m.face, -m.quarterTurns)).toList();
  applyMoves(symbols, inv);
  print('restored  : $symbols');
}
