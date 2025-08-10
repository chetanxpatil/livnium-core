library;

/// Livnium alphabet (clean base-27, no composite digits).
/// '0' → 0, 'a'..'z' → 1..26
const int kRadix = 27;

const Map<String, int> _symbolToValue = {
  '0': 0,
  'a': 1,
  'b': 2,
  'c': 3,
  'd': 4,
  'e': 5,
  'f': 6,
  'g': 7,
  'h': 8,
  'i': 9,
  'j': 10,
  'k': 11,
  'l': 12,
  'm': 13,
  'n': 14,
  'o': 15,
  'p': 16,
  'q': 17,
  'r': 18,
  's': 19,
  't': 20,
  'u': 21,
  'v': 22,
  'w': 23,
  'x': 24,
  'y': 25,
  'z': 26,
};

final Map<int, String> _valueToSymbol = {
  for (final e in _symbolToValue.entries) e.value: e.key,
};

int? symbolToValue(String ch) => _symbolToValue[ch];
String? valueToSymbol(int v) => _valueToSymbol[v];

List<int>? stringToDigits(String text) {
  final out = <int>[];
  for (final ch in text.split('')) {
    final v = symbolToValue(ch);
    if (v == null) return null;
    out.add(v);
  }
  return out;
}

String? digitsToString(List<int> digits) {
  final buf = StringBuffer();
  for (final d in digits) {
    final s = valueToSymbol(d);
    if (s == null) return null;
    buf.write(s);
  }
  return buf.toString();
}

bool isValidWord(String text) => stringToDigits(text) != null;
