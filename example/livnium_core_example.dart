import 'package:livnium_core/livnium_core.dart';

void main() {
  print(symbolicEnergy('0xyz'));   // 27.0
  print(symbolicEnergy('az'));     // 36.0
  print(symbolicEnergy('bad?'));   // 0.0  (invalid '?')
}

