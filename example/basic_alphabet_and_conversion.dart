// example/basic_alphabet_and_conversion.dart
//
// Basic alphabet inspection + decimal/Livnium conversions.

import 'package:livnium_core/src/alphabet.dart';

void main() {
  print('=== Livnium Base-27 Alphabet ===');
  for (var i = 0; i < kSymbols.length; i++) {
    print('$i → ${kSymbols[i]}');
  }

  print('\n=== Decimal → Livnium → Decimal ===');
  final decimals = [0, 1, 26, 27, 100, 728, 12345];

  for (final dec in decimals) {
    final liv = decimalToLivnium(dec);
    final back = livniumToDecimal(liv);
    print('$dec → "$liv" → $back');
  }
}

/// Convert a decimal integer to a Livnium base-27 string.
String decimalToLivnium(int value) {
  if (value == 0) return '0';
  final digits = <int>[];
  var n = value;
  while (n > 0) {
    digits.insert(0, n % kRadix);
    n ~/= kRadix;
  }
  return digitsToString(digits)!;
}

/// Convert a Livnium string to decimal integer.
int livniumToDecimal(String text) {
  final digits = stringToDigits(text)!;
  var value = 0;
  for (final d in digits) {
    value = value * kRadix + d;
  }
  return value;
}
