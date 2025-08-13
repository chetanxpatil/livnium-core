import 'package:livnium_core/src/energy.dart';

void main() {
  final glyphs = ['0', 'a', 'f', 'g', 'r', 's', 'z'];
  for (final ch in glyphs) {
    final f = facesForGlyph(ch);
    final e9 = symbolEnergy9(ch);
    print('$ch  faces=$f  SE9=$e9');
  }
  final words = ['a', 'gr', 'sz', 'livnium'];
  for (final w in words) {
    print('$w  wordEnergy9=${wordEnergy9(w)}');
  }
  print('K = $equilibriumConstant');
  print(
    'perFace: f1=${perFaceUnitEnergy(1)} f2=${perFaceUnitEnergy(2)} f3=${perFaceUnitEnergy(3)}',
  );

  selfTestSymbolEnergy9();
}
