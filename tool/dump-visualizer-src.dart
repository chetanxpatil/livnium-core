import 'dart:io';

/// Generates a combined dump of all Visualizer source files found in the
/// `visualizer/src` directory. The content is written to
/// `dump-visualizer-src.txt` in the project root. Existing files are
/// overwritten.
void main() {
  final dir = Directory('visualizer/src');
  if (!dir.existsSync()) {
    stderr.writeln('visualizer/src directory not found');
    exit(1);
  }

  final buffer = StringBuffer();

  for (final entity in dir.listSync(recursive: true)) {
    if (entity is! File) continue;
    final path = entity.path;
    if (!path.endsWith('.js') &&
        !path.endsWith('.jsx') &&
        !path.endsWith('.ts') &&
        !path.endsWith('.tsx')) {
      continue;
    }

    buffer
      ..writeln('//// BEGIN FILE: $path')
      ..writeln(entity.readAsStringSync())
      ..writeln('//// END FILE: $path')
      ..writeln();
  }

  File('dump-visualizer-src.txt').writeAsStringSync(buffer.toString());
}
