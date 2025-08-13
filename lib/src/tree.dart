/// Hierarchical micro-cube tree structures.
///
/// Provides [CubePath] for addressing, [MicroCube] for 27-ary nodes,
/// and [LivniumTree] for managing the hierarchy.

import 'alphabet.dart';
import 'potts.dart';

/// A base-27 path like "s.y.a" => [19,25,1].
class CubePath {
  /// Digits 0..26 per level from root to this node.
  final List<int> digits;

  const CubePath(this.digits);

  /// Parse a dotted path. Empty string represents the root.
  factory CubePath.parse(String dotted) {
    if (dotted.isEmpty) {
      return const CubePath([]);
    }
    final parts = dotted.split('.');
    final ds = <int>[];
    for (final part in parts) {
      if (part.isEmpty || part.length != 1) {
        throw FormatException('Invalid path segment "$part"');
      }
      final d = symbolToValue(part);
      if (d == null) {
        throw FormatException('Invalid symbol "$part" in path');
      }
      ds.add(d);
    }
    return CubePath(ds);
  }

  /// Create a child path by appending digit [d].
  CubePath child(int d) => CubePath([...digits, d]);

  @override
  String toString() {
    if (digits.isEmpty) return '';
    return digits.map((d) => valueToSymbol(d) ?? '?').join('.');
  }
}

/// Represents a 3×3×3 cube with optional children per position.
class MicroCube {
  /// Exactly 27 symbols for this cube.
  final List<int> symbols;

  /// Optional child cubes by position.
  final Map<int, MicroCube> children = {};

  /// Local Potts network for this cube.
  final Potts27 potts = Potts27.cube();

  /// Energy budget (currently unused numeric placeholder).
  double energyBudget;

  MicroCube({this.energyBudget = 10.125})
      : symbols = List<int>.filled(27, 0);

  /// Whether a child exists at [pos].
  bool hasChild(int pos) => children.containsKey(pos);

  /// Ensure a child exists at [pos], returning it.
  MicroCube ensureChild(int pos) {
    return children.putIfAbsent(pos, () => MicroCube(energyBudget: energyBudget));
  }

  /// Local evolution step for this cube only.
  void stepLocal({int maxIters = 10}) {
    for (var i = 0; i < symbols.length; i++) {
      potts.s[i] = symbols[i];
    }
    potts.relax(maxIters: maxIters);
    for (var i = 0; i < symbols.length; i++) {
      symbols[i] = potts.s[i];
    }
  }

  /// Aggregate child states into parent slots via majority voting.
  void pullFromChildren() {
    for (final entry in children.entries) {
      final pos = entry.key;
      final child = entry.value;
      final counts = List<int>.filled(27, 0);
      for (final d in child.symbols) {
        counts[d]++;
      }
      var arg = 0;
      var best = -1;
      for (var k = 0; k < 27; k++) {
        final c = counts[k];
        if (c > best) {
          best = c;
          arg = k;
        }
      }
      symbols[pos] = arg;
    }
  }

  /// Push bias from parent digit to children.
  void pushBiasToChildren(double beta) {
    for (final entry in children.entries) {
      final pos = entry.key;
      final child = entry.value;
      final parentDigit = symbols[pos];
      final centerIdx = 13; // middle slot
      final vec = List<double>.filled(Potts27.q, 0.0);
      vec[parentDigit] = beta;
      child.potts.setBias({centerIdx: vec});
    }
  }
}

/// Hierarchical tree of micro-cubes.
class LivniumTree {
  final MicroCube root;

  LivniumTree({double energyPerNode = 10.125})
      : root = MicroCube(energyBudget: energyPerNode);

  /// Ensure node at [path] exists and return it.
  MicroCube getOrCreate(CubePath path) {
    var node = root;
    for (final d in path.digits) {
      node = node.ensureChild(d);
    }
    return node;
  }

  /// Set symbol at [pos] for node at [path].
  void setSymbol(CubePath path, int pos, int digit) {
    final node = getOrCreate(path);
    node.symbols[pos] = digit;
  }

  /// Get symbol at [pos] for node at [path].
  int getSymbol(CubePath path, int pos) {
    final node = getOrCreate(path);
    return node.symbols[pos];
  }

  /// One hierarchical evolution pass (post-order).
  void evolve({int maxDepth = 2, double biasStrength = 0.2, int localIters = 10}) {
    void visit(MicroCube node, int depth) {
      if (depth >= maxDepth) return;
      for (final child in node.children.values) {
        visit(child, depth + 1);
      }
      node.pullFromChildren();
      node.stepLocal(maxIters: localIters);
      node.pushBiasToChildren(biasStrength);
    }

    visit(root, 0);
  }
}

