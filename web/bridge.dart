// web/bridge.dart
import 'dart:js_interop';
import 'package:livnium_core/livnium_core.dart' as core;

/// Attach to the global object as `window.livnium` / `globalThis.livnium`.
@JS()
external set livnium(JSObject? value);

/// ---- JS object-literal shapes we send/receive -----------------------------

/// Result for add27CarrySave3: { sum: string, carry: string }
extension type _CS3Result._(JSObject _) implements JSObject {
  external factory _CS3Result({String sum, String carry});
}

/// { tau0: number, alpha: number }
extension type _CouplerParams._(JSObject _) implements JSObject {
  external factory _CouplerParams({num tau0, num alpha});
  external num get tau0;
  external num get alpha;
}

/// { x: int, y: int, z: int, C: number, L: int, faces: int }
extension type _CouplerRow._(JSObject _) implements JSObject {
  external factory _CouplerRow({
    int x,
    int y,
    int z,
    num C,
    int L,
    int faces,
  });
}

/// { mag: number, phaseDeg: number }
extension type _PhasorTerm._(JSObject _) implements JSObject {
  external factory _PhasorTerm({num mag, num phaseDeg});
  external num get mag;
  external num get phaseDeg;
}

/// { face: 'U'|'D'|'L'|'R'|'F'|'B', quarterTurns: int }
extension type _FaceMoveIn._(JSObject _) implements JSObject {
  external String get face;
  external int get quarterTurns;
}

/// ---- The exported API -----------------------------------------------------

@JSExport()
final class _Api {
  // ── arithmetic ────────────────────────────────────────────────────────────
  String? add27(String a, String b) => core.add27(a, b);
  String? add27Balanced(String a, String b) => core.add27Balanced(a, b);
  String? add27Cyclic(String a, String b) => core.add27Cyclic(a, b);

  _CS3Result add27CarrySave3(String a, String b, String c) {
    final r = core.add27CarrySave3(a, b, c)!;
    return _CS3Result(sum: r.sum, carry: r.carry);
  }

  String? csFinish(String sum, String carry) => core.csFinish(sum, carry);

  String? toDecimal(String word) => core.toDecimal(word)?.toString();
  String? fromDecimal(String decimal) =>
      core.fromDecimal(BigInt.parse(decimal));

  // ── energy / glyphs ───────────────────────────────────────────────────────
  num? symbolEnergy9(String ch) => core.symbolEnergy9(ch);
  num? symbolEnergyK(String ch) => core.symbolEnergyK(ch);
  num? wordEnergy9(String w) => core.wordEnergy9(w);
  num? wordEnergyK(String w) => core.wordEnergyK(w);
  num perFaceUnitEnergy(int faces) => core.perFaceUnitEnergy(faces);
  num equilibriumConstant() => core.equilibriumConstant;
  int? facesForGlyph(String ch) => core.facesForGlyph(ch);

  // ── moves / permutations ──────────────────────────────────────────────────
  /// Accepts {face, quarterTurns}, returns a JS Array of indices.
  JSArray<JSNumber> permutationFor(_FaceMoveIn m) {
    final face = core.Face.values.firstWhere((f) => f.name == m.face);
    final perm = core.permutationFor(core.FaceMove(face, m.quarterTurns));
    final out = JSArray<JSNumber>.withLength(perm.length);
    for (var i = 0; i < perm.length; i++) {
      out[i] = perm[i].toJS;
    }
    return out;
  }

  /// In-place apply (mutates the passed JS arrays).
  void applyPerm(JSArray<JSNumber> symbols, JSArray<JSNumber> perm) {
    final n = perm.length;
    final tmp = JSArray<JSNumber>.withLength(n);
    for (var i = 0; i < n; i++) {
      tmp[i] = symbols[i];
    }
    for (var i = 0; i < n; i++) {
      final j = perm[i].toDartInt;
      symbols[j] = tmp[i];
    }
  }

  // ── couplers / phasors ────────────────────────────────────────────────────
  _CouplerParams makeCouplerParams(num tau0, num alpha) =>
      _CouplerParams(tau0: tau0, alpha: alpha);

  num couplingAt(int x, int y, int z, _CouplerParams p) {
    final params =
    core.CouplerParams(tau0: p.tau0.toDouble(), alpha: p.alpha.toDouble());
    return core.couplingAt(core.Vec3(x, y, z), params);
  }

  JSArray<_CouplerRow> rankTopCouplers(_CouplerParams p, int topN) {
    final params =
    core.CouplerParams(tau0: p.tau0.toDouble(), alpha: p.alpha.toDouble());
    final rows = core.rankTopCouplers(params, topN).map((t) {
      return _CouplerRow(
        x: t.pos.x,
        y: t.pos.y,
        z: t.pos.z,
        C: t.C,
        L: t.L,
        faces: t.faces,
      );
    }).toList(); // List<_CouplerRow>
    // Convert to a real JS Array
    final js = JSArray<_CouplerRow>.withLength(rows.length);
    for (var i = 0; i < rows.length; i++) {
      js[i] = rows[i];
    }
    return js;
  }

  num complexSumMagnitude(JSArray<_PhasorTerm> terms) {
    final list = <(double, double)>[];
    for (var i = 0; i < terms.length; i++) {
      final t = terms[i];
      list.add((t.mag.toDouble(), t.phaseDeg.toDouble()));
    }
    return core.complexSumMagnitude(list);
  }
}

/// ---- Wire it up on load ---------------------------------------------------

void main() {
  final api = _Api();
  // Wrap Dart instance into a real JS object with callable methods
  final jsObj = createJSInteropWrapper(api);
  // Make available as window.livnium / globalThis.livnium
  livnium = jsObj;
}
