import 'package:livnium_core/livnium_core.dart';
import 'package:livnium_core/src/alphabet.dart';

void main() {
  print(symbolicEnergy('love'));   // 27.0
  print(symbolicEnergy('az'));     // 36.0
  print(symbolicEnergy('bad?'));   // 0.0  (invalid '?')

  selfTestCodec();
}

