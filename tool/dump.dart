import 'dart:io';

/// Generates a combined dump of all Dart source files found in the `lib`,
/// `test`, and `example` directories. The content is written to `dump.txt`
/// in the project root. Existing files are overwritten.
void main() {
  final directories = ['lib', 'test', 'example', 'bin'];
  final buffer = StringBuffer();

  for (final dirPath in directories) {
    final dir = Directory(dirPath);
    if (!dir.existsSync()) {
      // Skip missing directories.
      continue;
    }

    for (final entity in dir.listSync(recursive: true)) {
      if (entity is! File) continue;
      if (!entity.path.endsWith('.dart')) continue;

      buffer
        ..writeln('//// BEGIN FILE: ${entity.path}')
        ..writeln(entity.readAsStringSync())
        ..writeln('//// END FILE: ${entity.path}')
        ..writeln();
    }
  }

  File('dump-livnium-core.txt').writeAsStringSync(buffer.toString());
}
