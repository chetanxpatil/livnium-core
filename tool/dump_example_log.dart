import 'dart:io';

/// Runs all Dart example scripts in the `example` directory and writes their
/// combined stdout/stderr to `dump-example-log.dart` in the project root.
/// Existing files are overwritten.
void main() {
  final exampleDir = Directory('example');
  if (!exampleDir.existsSync()) {
    stderr.writeln('example directory not found');
    exit(1);
  }

  final buffer = StringBuffer();

  for (final entity in exampleDir.listSync(recursive: true)) {
    if (entity is! File) continue;
    if (!entity.path.endsWith('.dart')) continue;

    buffer.writeln('//// BEGIN EXAMPLE: ${entity.path}');

    final result = Process.runSync('dart', ['run', entity.path]);
    final out = result.stdout.toString();
    final err = result.stderr.toString();
    if (out.isNotEmpty) buffer.writeln(out.trimRight());
    if (err.isNotEmpty) buffer.writeln(err.trimRight());

    buffer.writeln('//// END EXAMPLE: ${entity.path}');
    buffer.writeln();
  }

  File('dump-example-log.txt').writeAsStringSync(buffer.toString());
}
