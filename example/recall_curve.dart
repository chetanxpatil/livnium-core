import 'dart:math';
import 'package:livnium_core/livnium_core.dart';

List<int> patternForWord(String w) {
  final d = stringToDigits(w)!;
  return List<int>.generate(27, (i) => d[i % d.length]);
}

void main() {
  final words = ['love', 'grace', 'unity'];
  final patterns = words.map(patternForWord).toList();

  final net = Potts27.cube();
  net.store(patterns, scale: 1.0, targetNorm: 0.5, blend: 1.0);

  final rng = Random(42);
  for (var p = 0.0; p <= 0.6001; p += 0.05) {
    double acc = 0;
    for (final pat in patterns) {
      for (var trial = 0; trial < 5; trial++) {
        final noisy = List<int>.from(pat);
        final count = (p * noisy.length).round();
        final idxs = List<int>.generate(noisy.length, (i) => i)..shuffle(rng);
        for (var i = 0; i < count; i++) {
          noisy[idxs[i]] = rng.nextInt(Potts27.q);
        }
        for (var i = 0; i < net.n; i++) {
          net.s[i] = noisy[i];
        }
        net.relax(maxIters: 50);
        var correct = 0;
        for (var i = 0; i < pat.length; i++) {
          if (net.s[i] == pat[i]) correct++;
        }
        acc += correct / pat.length;
      }
    }
    final avg = acc / (patterns.length * 5);
    print('${p.toStringAsFixed(2)},${avg.toStringAsFixed(3)}');
  }
}
