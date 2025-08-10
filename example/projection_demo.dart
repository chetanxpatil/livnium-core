import 'package:livnium_core/livnium_core.dart';

void main() {
  final slices = dropAxis('z');
  print('Slices after dropping Z:');
  for (final entry in slices.entries) {
    print('key=${entry.key}  count=${entry.value.length}');
  }

  final bins = radialBins();
  print('\nRadial bins L1:');
  for (final e in bins.entries) {
    print('L=${e.key} -> ${e.value.length} points');
  }

  final byFaces = coarseGrain((v) => facesForVec3(v));
  print('\nCoarse by faces:');
  for (final e in byFaces.entries) {
    print('faces=${e.key} -> ${e.value.length}');
  }
}
