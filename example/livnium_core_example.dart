import 'package:livnium_core/livnium_core.dart';
import 'package:livnium_core/src/codec.dart' as codec; // for fixed-int demo

void main() {
  final core = LivniumCore.instance;

  const word = '0liv';

  print('=== Livnium Core Example ===');
  print('Word: $word');

  // --- Encode three different ways ---
  final csv   = core.encode(word, as: LivniumCodec.csv);
  final fixed = core.encode(word, as: LivniumCodec.fixed);
  final big   = core.encode(word, as: LivniumCodec.bigintTail);

  print('\nEncoded forms:');
  print('CSV:        $csv');        // e.g. "0,12,9,22"
  print('Fixed:      $fixed');      // e.g. "0000120922"
  print('BigIntTail: $big');        // BigInt

  // --- Decode back to original ---
  final fromCsv   = core.decode(csv!, from: LivniumCodec.csv);
  final fromFixed = core.decode(fixed!, from: LivniumCodec.fixed);
  final fromBig   = core.decode(big!, from: LivniumCodec.bigintTail);

  print('\nDecoded back:');
  print('From CSV:   $fromCsv');
  print('From Fixed: $fromFixed');
  print('From Big:   $fromBig');

  // --- Decimal ↔ Livnium base-27 conversion ---
  const decimalValue = 27;
  final livniumFromDecimal = codec.decodeFixedInt(decimalValue);
  final decimalFromLivnium = codec.encodeFixedInt(word);

  print('\nDecimal ↔ Livnium conversions (FixedInt codec):');
  print('$decimalValue (decimal)  →  "$livniumFromDecimal" (Livnium base-27)');
  print('"$word" (Livnium base-27) →  $decimalFromLivnium (decimal)');

  // --- Symbolic energy ---
  final energy = core.symbolicEnergy(word);
  print('\nSymbolic energy of "$word": $energy');

  // --- Rotation demo ---
  final pos = Vec3(1, 1, -1);
  final rotated = core.rotateZ(pos); // 90° clockwise around Z-axis
  print('\nRotation demo:');
  print('Original: $pos');
  print('Rotated (Z quarter-turn): $rotated');
}
