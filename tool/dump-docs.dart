import 'dart:io';

/// Generates a combined dump of all documentation files found in the
/// `docs-site/docs` directory. The content is written to
/// `dump-docs.txt` in the project root. Existing files are overwritten.
void main() {
  final dir = Directory('docs-site/docs');
  if (!dir.existsSync()) {
    stderr.writeln('docs-site/docs directory not found');
    exit(1);
  }

  final buffer = StringBuffer();

  for (final entity in dir.listSync(recursive: true)) {
    if (entity is! File) continue;
    final path = entity.path;
    if (!path.endsWith('.mdx') && !path.endsWith('.json')) {
      continue;
    }

    buffer
      ..writeln('//// BEGIN FILE: $path')
      ..writeln(entity.readAsStringSync())
      ..writeln('//// END FILE: $path')
      ..writeln();
  }

  File('dump-docs.txt').writeAsStringSync(buffer.toString());
}
