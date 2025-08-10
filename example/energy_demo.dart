import 'package:livnium_core/livnium_core.dart';

void main() {
  final glyphs = ['0', 'a', 'f', 'g', 'r', 's', 'z'];
  for (final ch in glyphs) {
    final f = facesForGlyph(ch);
    final e = symbolEnergy(ch);
    print('$ch  faces=$f  SE=$e');
  }
  final words = ['a', 'gr', 'sz', 'livnium'];
  for (final w in words) {
    print('$w  wordEnergy=${wordEnergy(w)}');
  }
  print('K = ${equilibriumConstant()}');
  print(
    'perFace: f1=${perFaceUnitEnergy(1)} f2=${perFaceUnitEnergy(2)} f3=${perFaceUnitEnergy(3)}',
  );
}
