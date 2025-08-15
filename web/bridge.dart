// web/bridge.dart
@JS()
library livnium_bridge;

import 'package:js/js.dart';
import 'package:livnium_core/livnium_core.dart' as core;

// Expose a single object on window: window.livnium = {...}
@JS('livnium')
external set _livniumExport(Object? o);

@JS()
@anonymous
class _Api {
  external factory _Api({
    // arithmetic
    String? Function(String, String)? add27,
    String? Function(String, String)? add27Balanced,
    String? Function(String, String)? add27Cyclic,
    Object? Function(String, String, String)? add27CarrySave3,
    String? Function(String, String)? csFinish,
    String? Function(String)? toDecimal,
    String? Function(String)? fromDecimal,

    // energy / glyphs
    num? Function(String)? symbolEnergy9,
    num? Function(String)? symbolEnergyK,
    num? Function(String)? wordEnergy9,
    num? Function(String)? wordEnergyK,
    num? Function(int)? perFaceUnitEnergy,
    num Function()? equilibriumConstant,

    // grid / moves / couplers
    List<int> Function(core.FaceMove)? permutationFor,
    void Function(List<int>, List<int>)? applyPerm,
    Object Function(num tau0, num alpha)? makeCouplerParams,
    num Function(int x, int y, int z, Object p)? couplingAt,
    List<Object> Function(Object p, int topN)? rankTopCouplers,
    num Function(List<Object> terms)? complexSumMagnitude,

    // utils
    int? Function(String)? facesForGlyph,
  });
}

// Small JS-friendly wrappers
String? _toDec(String w) => core.toDecimal(w)?.toString();
String? _fromDec(String dec) => core.fromDecimal(BigInt.parse(dec));

Object _cs3(String a, String b, String c) {
  final r = core.add27CarrySave3(a, b, c)!;
  return {'sum': r.sum, 'carry': r.carry};
}

Object _makeCouplerParams(num tau0, num alpha) => {'tau0': tau0, 'alpha': alpha};

num _couplingAt(int x, int y, int z, Object p) {
  final m = p as Map;
  final params = core.CouplerParams(
    tau0: (m['tau0'] as num).toDouble(),
    alpha: (m['alpha'] as num).toDouble(),
  );
  return core.couplingAt(core.Vec3(x, y, z), params);
}

List<Object> _rank(Object p, int topN) {
  final m = p as Map;
  final params = core.CouplerParams(
    tau0: (m['tau0'] as num).toDouble(),
    alpha: (m['alpha'] as num).toDouble(),
  );
  return core
      .rankTopCouplers(params, topN)
      .map((t) => {
            'x': t.pos.x,
            'y': t.pos.y,
            'z': t.pos.z,
            'C': t.C,
            'L': t.L,
            'faces': t.faces
          })
      .toList(growable: false);
}

num _phasor(List<Object> terms) {
  final typed = terms
      .map((e) {
        final m = e as Map;
        return ((m['mag'] as num).toDouble(),
            (m['phaseDeg'] as num).toDouble());
      })
      .toList();
  return core.complexSumMagnitude(typed);
}

List<int> _perm(Object js) {
  final m = js as Map;
  final faceStr = m['face'] as String;
  final face = core.Face.values.firstWhere((f) => f.name == faceStr);
  final q = (m['quarterTurns'] as num).toInt();
  return core.permutationFor(core.FaceMove(face, q));
}

void main() {
  _livniumExport = _Api(
    add27: allowInterop(core.add27),
    add27Balanced: allowInterop(core.add27Balanced),
    add27Cyclic: allowInterop(core.add27Cyclic),
    add27CarrySave3: allowInterop(_cs3),
    csFinish: allowInterop(core.csFinish),
    toDecimal: allowInterop(_toDec),
    fromDecimal: allowInterop(_fromDec),

    symbolEnergy9: allowInterop(core.symbolEnergy9),
    symbolEnergyK: allowInterop(core.symbolEnergyK),
    wordEnergy9: allowInterop(core.wordEnergy9),
    wordEnergyK: allowInterop(core.wordEnergyK),
    perFaceUnitEnergy: allowInterop(core.perFaceUnitEnergy),
    equilibriumConstant: allowInterop(() => core.equilibriumConstant),

    permutationFor: allowInterop(_perm),
    applyPerm: allowInterop(core.applyPerm<int>),
    makeCouplerParams: allowInterop(_makeCouplerParams),
    couplingAt: allowInterop(_couplingAt),
    rankTopCouplers: allowInterop(_rank),
    complexSumMagnitude: allowInterop(_phasor),

    facesForGlyph: allowInterop(core.facesForGlyph),
  );
}

