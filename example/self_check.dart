import 'package:livnium_core/livnium_core.dart';

void main() {
  final ok = runAllSelfChecks();
  if (!ok) throw 'Self checks failed';
  print('✅ runAllSelfChecks passed');
}
