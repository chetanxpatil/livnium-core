library;

import 'codec.dart' as codec;
import 'energy.dart' as energy;
import 'rotation.dart';

/// Which codec to use for encoding/decoding.
enum LivniumCodec { csv, fixed, bigintTail }

/// Public façade for Livnium Core functionality.
class LivniumCore {
  LivniumCore._internal();
  static final LivniumCore instance = LivniumCore._internal();

  /// Encode a Livnium word using the chosen codec.
  Object? encode(String text, {required LivniumCodec as}) {
    switch (as) {
      case LivniumCodec.csv:
        return codec.encodeCsv(text);
      case LivniumCodec.fixed:
        return codec.encodeFixed(text);
      case LivniumCodec.bigintTail:
        return codec.encodeBigIntTail(text);
    }
  }

  /// Decode an encoded form back to a Livnium word.
  String? decode(Object encoded, {required LivniumCodec from}) {
    switch (from) {
      case LivniumCodec.csv:
        return codec.decodeCsv(encoded as String);
      case LivniumCodec.fixed:
        return codec.decodeFixed(encoded as String);
      case LivniumCodec.bigintTail:
        return codec.decodeBigIntTail(encoded as BigInt);
    }
  }

  /// Compute total symbolic energy for a Livnium word.
  double symbolicEnergy(String word) => energy.symbolicEnergy(word);

  /// Example helper to rotate a coordinate around the Z axis.
  Vec3 rotateZ(Vec3 v, [int quarterTurns = 1]) =>
      rotateZQuarter(v, quarterTurns);
}
