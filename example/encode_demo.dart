import 'package:livnium_core/livnium_core.dart';

void main() {
  const words = ['0', 'a', 'a0', 'xyz', '000', 'livnium', '0az'];

  print('word  csv  fixed  big  dec  raw');
  print('---------------------------------------------');

  for (final w in words) {
    final csv = encodeCsv(w)!;
    final fixed = encodeFixed(w)!;
    final big = encodeBigIntTail(w)!;
    final dec = encodeDecimal(w)!;

    final wCsv = decodeCsv(csv);
    final wFixed = decodeFixed(fixed);
    final wBig = decodeBigIntTail(big);
    final wDec = decodeDecimal(dec);

    assert(
      w == wCsv && w == wFixed && w == wBig && w == wDec,
      'Codec mismatch "$w": csv=$wCsv fixed=$wFixed big=$wBig dec=$wDec',
    );

    // RAW checks (pure base-27)
    final raw = encodeBigIntRaw(w)!;
    final wLen = stringToDigits(w)!.length;
    final wRaw = decodeBigIntRaw(raw, length: wLen);
    assert(w == wRaw, 'RAW mismatch "$w": raw=$raw wRaw=$wRaw');

    // Spot-check known values
    if (w == 'a0') {
      assert(raw == BigInt.from(27), 'Expected raw("a0")==27, got $raw');
    }
    if (w == '000') {
      assert(raw == BigInt.zero, 'Expected raw("000")==0, got $raw');
      final restored = decodeBigIntRaw(raw, length: 3);
      assert(
        restored == '000',
        'Leading zeros lost: expected "000", got $restored',
      );
    }

    print('$w   $csv   $fixed   $big   $dec   $raw');
  }

  // Tail-sentinel structural checks
  assert(encodeBigIntTail('0') == BigInt.from(1));
  assert(encodeBigIntTail('a') == BigInt.from(28));
  assert(encodeBigIntTail('a0') == BigInt.from(731));
}
