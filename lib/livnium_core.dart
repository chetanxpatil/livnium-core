/// Livnium Core
/// ============
/// The spatial alphabet, codecs, energy math and rotation utilities that power
/// **Livnium** — a base-27, reversible symbol engine inspired by cube geometry.
///
/// ## Quick-start
/// ```dart
/// import 'package:livnium_core/livnium_core.dart';
///
/// void main() {
///   final core = LivniumCore.instance;
///
///   // ⇢ Encode a word three different ways
///   final csv   = core.encode('0liv', as: LivniumCodec.csv);          // "0,12,9,22"
///   final fixed = core.encode('0liv', as: LivniumCodec.fixed);        // "0000120922"
///   final big   = core.encode('0liv', as: LivniumCodec.bigintTail);   // BigInt
///
///   // ⇢ Round-trip
///   assert(core.decode(csv,   from: LivniumCodec.csv)        == '0liv');
///   assert(core.decode(fixed, from: LivniumCodec.fixed)      == '0liv');
///   assert(core.decode(big,   from: LivniumCodec.bigintTail) == '0liv');
///
///   // ⇢ Extras
///   print('SE("0liv") = ${core.symbolicEnergy('0liv')}');
///   print(core.rotateZ(const Vec3(1,1,-1)));          // quarter-turn demo
/// }
/// ```
///
/// All implementation details live in `lib/src/`; this file only re-exports
/// the public surface so your downstream apps stay isolated from refactors.
library;

// ───────────────────────────────── Alphabet helpers ─────────────────────────
export 'src/alphabet.dart'           show symbolToValue, valueToSymbol;

// ───────────────────────────────── Encoding / façade ────────────────────────
export 'src/codec.dart';             // low-level CsvCodec, FixedCodec, etc.
export 'src/core.dart' show LivniumCore;

// ───────────────────────────────── Math & motion ────────────────────────────
export 'src/rotation.dart';
export 'src/energy.dart';
