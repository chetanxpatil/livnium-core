// web/bridge_static.dart
import 'dart:js_interop';
import 'dart:js_util' as jsu;
import 'package:livnium_core/livnium_core.dart' as core;

// globalThis for both browsers and workers
@JS('globalThis')
external JSObject get _global;

// Small helpers
T _getProp<T>(JSObject o, String name) => jsu.getProperty(o, name) as T;
num _getNum(JSObject o, String name) => (jsu.getProperty(o, name) as num);
String _getStr(JSObject o, String name) => (jsu.getProperty(o, name) as String);

// Build a plain JS object { ... } from a Dart map of simple values/lists/maps.
JSObject _obj(Map<String, Object?> m) => jsu.jsify(m) as JSObject;

// Convert a JS array-like to Dart list of maps
List<Map<String, Object?>> _jsArrayToMapList(JSObject jsArray) {
  final len = (_getProp<num>(jsArray, 'length')).toInt();
  final out = <Map<String, Object?>>[];
  for (var i = 0; i < len; i++) {
    final item = jsu.getProperty(jsArray, i);
    out.add((item as Map).cast<String, Object?>());
  }
  return out;
}

void main() {
  final api = jsu.newObject();

  // ───────── arithmetic ─────────
  jsu.setProperty(api, 'add27',
      ((JSString a, JSString b) => core.add27(a.toDart, b.toDart)?.toJS).toJS);
  jsu.setProperty(
      api,
      'add27Balanced',
      ((JSString a, JSString b) =>
      core.add27Balanced(a.toDart, b.toDart)?.toJS)
          .toJS);
  jsu.setProperty(
      api,
      'add27Cyclic',
      ((JSString a, JSString b) =>
      core.add27Cyclic(a.toDart, b.toDart)?.toJS)
          .toJS);
  jsu.setProperty(
      api,
      'add27CarrySave3',
      ((JSString a, JSString b, JSString c) {
        final r = core.add27CarrySave3(a.toDart, b.toDart, c.toDart)!;
        return _obj({'sum': r.sum, 'carry': r.carry});
      }).toJS);
  jsu.setProperty(
      api,
      'csFinish',
      ((JSString s, JSString c) =>
      core.csFinish(s.toDart, c.toDart)?.toJS)
          .toJS);
  jsu.setProperty(api, 'toDecimal',
      ((JSString w) => core.toDecimal(w.toDart)?.toString().toJS).toJS);
  jsu.setProperty(api, 'fromDecimal',
      ((JSString d) => core.fromDecimal(BigInt.parse(d.toDart))?.toJS).toJS);

  // ───────── energy / glyphs ─────────
  jsu.setProperty(api, 'symbolEnergy9',
      ((JSString ch) => (core.symbolEnergy9(ch.toDart) as num?)?.toJS).toJS);
  jsu.setProperty(api, 'symbolEnergyK',
      ((JSString ch) => (core.symbolEnergyK(ch.toDart) as num?)?.toJS).toJS);
  jsu.setProperty(api, 'wordEnergy9',
      ((JSString w) => (core.wordEnergy9(w.toDart) as num?)?.toJS).toJS);
  jsu.setProperty(api, 'wordEnergyK',
      ((JSString w) => (core.wordEnergyK(w.toDart) as num?)?.toJS).toJS);
  jsu.setProperty(api, 'perFaceUnitEnergy',
      ((JSNumber faces) => core.perFaceUnitEnergy(faces.toDartInt).toJS).toJS);
  jsu.setProperty(
      api, 'equilibriumConstant', (() => core.equilibriumConstant.toJS).toJS);
  jsu.setProperty(api, 'facesForGlyph',
      ((JSString ch) => (core.facesForGlyph(ch.toDart) as int?)?.toJS).toJS);

  // ───────── moves / permutations ─────────
  // permutationFor({ face: 'U'|'D'|'L'|'R'|'F'|'B', quarterTurns: int }) -> int[]
  jsu.setProperty(
      api,
      'permutationFor',
      ((JSObject m) {
        final faceStr = _getStr(m, 'face');
        final q = _getNum(m, 'quarterTurns').toInt();
        final face = core.Face.values.firstWhere((f) => f.name == faceStr);
        final perm = core.permutationFor(core.FaceMove(face, q));
        return jsu.jsify(perm);
      }).toJS);

  // applyPerm(symbolsArray, permArray) — in-place
  jsu.setProperty(
      api,
      'applyPerm',
      ((JSObject symbols, JSObject perm) {
        final n = (_getProp<num>(perm, 'length')).toInt();
        final tmp = List<JSAny?>.filled(n, null);
        for (var i = 0; i < n; i++) {
          tmp[i] = jsu.getProperty(symbols, i);
        }
        for (var i = 0; i < n; i++) {
          final j = (_getProp<num>(perm, i.toString())).toInt();
          jsu.setProperty(symbols, j, tmp[i]);
        }
      }).toJS);

  // ───────── couplers / phasors ─────────
  jsu.setProperty(
      api,
      'makeCouplerParams',
      ((JSNumber tau0, JSNumber alpha) =>
          _obj({'tau0': tau0.toDartDouble, 'alpha': alpha.toDartDouble}))
          .toJS);

  jsu.setProperty(
      api,
      'couplingAt',
      ((JSNumber x, JSNumber y, JSNumber z, JSObject p) {
        final tau0 = _getNum(p, 'tau0').toDouble();
        final alpha = _getNum(p, 'alpha').toDouble();
        final params = core.CouplerParams(tau0: tau0, alpha: alpha);
        return core.couplingAt(core.Vec3(x.toDartInt, y.toDartInt, z.toDartInt), params)
            .toJS;
      }).toJS);

  jsu.setProperty(
      api,
      'rankTopCouplers',
      ((JSObject p, JSNumber topN) {
        final tau0 = _getNum(p, 'tau0').toDouble();
        final alpha = _getNum(p, 'alpha').toDouble();
        final params = core.CouplerParams(tau0: tau0, alpha: alpha);
        final rows = core.rankTopCouplers(params, topN.toDartInt).map((t) {
          return {
            'x': t.pos.x,
            'y': t.pos.y,
            'z': t.pos.z,
            'C': t.C,
            'L': t.L,
            'faces': t.faces,
          };
        }).toList(growable: false);
        return jsu.jsify(rows);
      }).toJS);

  jsu.setProperty(
      api,
      'complexSumMagnitude',
      ((JSObject terms) {
        final len = (_getProp<num>(terms, 'length')).toInt();
        final list = <(double, double)>[];
        for (var i = 0; i < len; i++) {
          final t = jsu.getProperty(terms, i) as JSObject;
          final mag = _getNum(t, 'mag').toDouble();
          final phase = _getNum(t, 'phaseDeg').toDouble();
          list.add((mag, phase));
        }
        return core.complexSumMagnitude(list).toJS;
      }).toJS);

  // expose as globalThis.livnium
  jsu.setProperty(_global, 'livnium', api);
}
