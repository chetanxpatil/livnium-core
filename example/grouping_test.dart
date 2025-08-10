import 'package:livnium_core/livnium_core.dart';

void main() {
  print('=== Drop Axis X ===');
  final dropX = dropAxis('x');
  for (final entry in dropX.entries) {
    print('${entry.key}: ${entry.value}');
  }

  print('\n=== Drop Axis Y ===');
  final dropY = dropAxis('y');
  for (final entry in dropY.entries) {
    print('${entry.key}: ${entry.value}');
  }

  print('\n=== Drop Axis Z ===');
  final dropZ = dropAxis('z');
  for (final entry in dropZ.entries) {
    print('${entry.key}: ${entry.value}');
  }

  print('\n=== Radial Bins (L1 distance) ===');
  final radial = radialBins();
  for (final entry in radial.entries) {
    print('L1=${entry.key}: ${entry.value}');
  }

  print('\n=== Coarse Grain: Faces count ===');
  final coarse = coarseGrain((v) =>
  ((v.x != 0) ? 1 : 0) + ((v.y != 0) ? 1 : 0) + ((v.z != 0) ? 1 : 0));
  for (final entry in coarse.entries) {
    print('Faces=${entry.key}: ${entry.value}');
  }
}
