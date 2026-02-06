import 'package:livnium_core/livnium_core.dart';
import 'package:test/test.dart';

/// Scientific tests for D3: Audit Principle and normalization.
void main() {
  group('D3 Conservation Ledger', () {
    test('fresh state passes audit', () {
      for (final n in [1, 3, 5]) {
        final state = LatticeState(n);
        expect(auditConservation(state), isTrue);
      }
    });

    test('after normalizeGlobalLedger, audit passes', () {
      final state = LatticeState(3);
      for (final c in state.cells) {
        c.swEffective = 1.0;
      }
      expect(auditConservation(state), isFalse);
      normalizeGlobalLedger(state);
      expect(auditConservation(state), isTrue);
      expect(state.totalEffectiveWeight, closeTo(totalEnergySymbolic(3), 1e-9));
    });

    test('normalization preserves class counts (no cell merge)', () {
      final state = LatticeState(3);
      for (final c in state.cells) {
        c.swEffective = c.swBase * (1 + (c.coord.x % 2) * 0.1);
      }
      final countsBefore = Map<int, int>.from(state.classCounts);
      normalizeGlobalLedger(state);
      final countsAfter = state.classCounts;
      expect(countsAfter[0], countsBefore[0]);
      expect(countsAfter[1], countsBefore[1]);
      expect(countsAfter[2], countsBefore[2]);
      expect(countsAfter[3], countsBefore[3]);
    });
  });
}
