import 'package:livnium_core/src/alphabet.dart';

/// Converts a base-10 double to base-27 string using Livnium symbols.
String decimalToBase27(double value, {int fracDigits = 5}) {
  final symbols = kSymbols;

  // Separate integer and fractional parts
  int intPart = value.floor();
  double fracPart = value - intPart;

  // Convert integer part
  String intStr = '';
  if (intPart == 0) {
    intStr = symbols[0];
  } else {
    while (intPart > 0) {
      final rem = intPart % kRadix;
      intPart ~/= kRadix;
      intStr = symbols[rem] + intStr;
    }
  }

  // Convert fractional part
  String fracStr = '';
  for (int i = 0; i < fracDigits; i++) {
    fracPart *= kRadix;
    final digit = fracPart.floor();
    fracPart -= digit;
    fracStr += symbols[digit];
    if (fracPart == 0) break; // exact finish
  }

  return fracStr.isEmpty ? intStr : '$intStr.$fracStr';
}

/// Converts a base-27 string (Livnium symbols) back to base-10 double.
double base27ToDecimal(String base27) {
  final symbols = kSymbols;
  final parts = base27.split('.');
  double result = 0.0;

  // Integer part
  final intPart = parts[0];
  for (int i = 0; i < intPart.length; i++) {
    final digit = symbols.indexOf(intPart[i]);
    result = result * kRadix + digit;
  }

  // Fractional part
  if (parts.length > 1) {
    double frac = 0.0;
    double divisor = kRadix.toDouble();
    for (final ch in parts[1].split('')) {
      final digit = symbols.indexOf(ch);
      frac += digit / divisor;
      divisor *= kRadix;
    }
    result += frac;
  }

  return result;
}

void main() {
  final int scaled = (89.33 * 1000000).round(); // work as integer µ-units
  final base27Value = decimalToBase27(scaled.toDouble(), fracDigits: 0);
  final roundTripInt = base27ToDecimal(base27Value).round();

  print('Scaled int: $scaled');
  print('Base-27: $base27Value');
  print('Back to int: $roundTripInt');
  print('Exact match: ${scaled == roundTripInt}');
}


// void main() {
//   final decimalValue = 89.33;
//   final base27Value = decimalToBase27(decimalValue, fracDigits: 5);
//   final roundTrip = base27ToDecimal(base27Value);
//
//   print('Decimal: $decimalValue');
//   print('Base-27: $base27Value');
//   print('Back to Decimal: $roundTrip');
// }
