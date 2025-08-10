import 'package:livnium_core/livnium_core.dart';

void main() {
  final words = ['0', 'a', '0az', 'xyz', '000', 'livnium'];

  for (final w in words) {
    final csv = encodeCsv(w)!;
    final fixed = encodeFixed(w)!;
    final big = encodeBigIntTail(w)!;
    final wCsv = decodeCsv(csv);
    final wFixed = decodeFixed(fixed);
    final wBig = decodeBigIntTail(big);

    print(
      'word="$w"  csv="$csv"  fixed="$fixed"  big=$big  '
      'rCsv="$wCsv" rFixed="$wFixed" rBig="$wBig"',
    );
  }
}
