// example/symbolic_energy_demo.dart
//
// Demonstrates symbolic energy calculations in the Livnium system.

import 'package:livnium_core/livnium_core.dart';

void main() {
  print('=== Symbolic Energy of Single Glyphs ===');
  for (final glyph in ['0', 'a', 'x', 's']) {
    print('$glyph → ${symbolEnergy(glyph)} E');
  }

  print('\n=== Symbolic Energy of Short Word ===');
  const word = '0liv';
  print('"$word" → ${symbolicEnergy(word)} E');

  print('\n=== Cube-Wide Constants ===');
  print('Total Cube Energy = $totalCubeEnergy E');
  print('Equilibrium Constant = $equilibriumConstant');
}