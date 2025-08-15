import 'dart:io';

void main() {
  final root = Directory('visualizer/src');
  if (!root.existsSync()) {
    stderr.writeln('visualizer/src not found. Please run from project root.');
    exit(1);
  }

  final storeJs = File('visualizer/src/app/store.js');
  final storeJsx = File('visualizer/src/app/store.jsx');
  if (storeJs.existsSync() && !storeJsx.existsSync()) {
    stdout.writeln('Renaming app/store.js → app/store.jsx');
    try {
      storeJs.renameSync(storeJsx.path);
    } catch (_) {
      final tmp = File('visualizer/src/app/store.tmp.__rename__');
      storeJs.copySync(tmp.path);
      storeJs.deleteSync();
      tmp.renameSync(storeJsx.path);
    }
  }

  // The robust regex
  final importSpecifierRe = RegExp(r'''(['"])([^'"]*/)?store\.js\1''');

  final exts = {'.js', '.jsx', '.ts', '.tsx'};
  final changed = <String>[];

  for (final entity in root.listSync(recursive: true)) {
    if (entity is! File) continue;
    if (!exts.any((e) => entity.path.endsWith(e))) continue;

    final content = entity.readAsStringSync();
    final updated = content.replaceAllMapped(importSpecifierRe, (m) {
      final quote = m.group(1)!;
      final prefix = m.group(2) ?? '';
      return "$quote${prefix}store.jsx$quote";
    });

    if (updated != content) {
      entity.writeAsStringSync(updated);
      changed.add(entity.path);
    }
  }

  if (changed.isEmpty) {
    stdout.writeln('No imports needed updating.');
  } else {
    stdout.writeln('Updated imports in ${changed.length} file(s):');
    changed.forEach((f) => stdout.writeln('  • $f'));
  }

  stdout.writeln('Done.');
}
