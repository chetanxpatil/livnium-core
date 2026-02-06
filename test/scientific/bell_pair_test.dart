import 'package:livnium_core/livnium_core.dart';
import 'package:test/test.dart';

/// Scientific tests for BellPair: non-local coupling, D2 conservation, anti-sync.
///
/// **Hypothesis:** BellPair coupling is a D2-preserving permutation induced by an
/// equal-and-opposite rotation on the partner cell.
void main() {
  group('LatticeState.applyRotationAt (D2-preserving permutation)', () {
    test('preserves total effective weight', () {
      for (final n in [3, 5]) {
        final state = LatticeState(n);
        final before = state.totalEffectiveWeight;
        final c = LatticeCoord(n, 0, 0, 0);
        state.applyRotationAt(c, 0, 1);
        expect(state.totalEffectiveWeight, before);
        state.applyRotationAt(c, 1, 2);
        expect(state.totalEffectiveWeight, before);
      }
    });

    test('auditConservation still passes after rotation at one cell', () {
      final state = LatticeState(3);
      state.applyRotationAt(LatticeCoord(3, 0, 0, 0), 2, 1);
      expect(auditConservation(state), isTrue);
    });

    test('four quarter-turns about same axis return content to original', () {
      final state = LatticeState(3);
      final c = LatticeCoord(3, 0, 1, 2);
      final cell = state.cellAtCoord(c);
      final sw0 = cell.swEffective;
      final active0 = cell.active;
      for (var i = 0; i < 4; i++) {
        state.applyRotationAt(c, 2, 1);
      }
      expect(state.cellAtCoord(c).swEffective, sw0);
      expect(state.cellAtCoord(c).active, active0);
    });
  });

  group('BellPair constructor', () {
    test('accepts valid (cellA, cellB) on same lattice', () {
      final a = LatticeCoord(3, 0, 0, 0);
      final b = LatticeCoord(3, 2, 2, 2);
      expect(() => BellPair(a, b), returnsNormally);
      expect(() => BellPair(a, b, couplingStrength: 0.5), returnsNormally);
    });

    test('throws if cells have different n', () {
      expect(
        () => BellPair(LatticeCoord(3, 0, 0, 0), LatticeCoord(5, 0, 0, 0)),
        throwsArgumentError,
      );
    });

    test('throws if cellA == cellB', () {
      final c = LatticeCoord(3, 1, 1, 1);
      expect(() => BellPair(c, c), throwsArgumentError);
    });

    test('accepts couplingStrength 0 (isolation); throws if < 0 or > 1', () {
      final a = LatticeCoord(3, 0, 0, 0);
      final b = LatticeCoord(3, 1, 1, 1);
      expect(() => BellPair(a, b, couplingStrength: 0), returnsNormally);
      expect(() => BellPair(a, b, couplingStrength: -0.1), throwsArgumentError);
      expect(() => BellPair(a, b, couplingStrength: 1.1), throwsArgumentError);
    });
  });

  group('BellPair anti-synchronization (conservation of spin)', () {
    test(
        'synchronize applies exact anti-rotation at partner (B gets value from rotateQuarter(B, axis, -1))',
        () {
      final state = LatticeState(3);
      final cellA = LatticeCoord(3, 0, 0, 0);
      final cellB = LatticeCoord(3, 2, 2, 2);
      final pair = BellPair(cellA, cellB);
      final otherB = rotateQuarter(cellB, 2, -1);
      final valueAtOtherB = state.cellAtCoord(otherB).swEffective;
      state.applyRotationAt(cellA, 2, 1);
      pair.synchronize(state, cellA, 2, 1);
      expect(state.cellAtCoord(cellB).swEffective, valueAtOtherB);
    });

    test('D2 ledger preserved after trigger rotation + synchronize', () {
      final state = LatticeState(3);
      final cellA = LatticeCoord(3, 0, 0, 0);
      final cellB = LatticeCoord(3, 2, 2, 2);
      final pair = BellPair(cellA, cellB);
      final target = state.totalEffectiveWeight;

      state.applyRotationAt(cellA, 0, 1);
      pair.synchronize(state, cellA, 0, 1);

      expect(state.totalEffectiveWeight, target);
      expect(auditConservation(state), isTrue);
    });

    test('auditConservation passes after multiple BellPair syncs', () {
      final state = LatticeState(3);
      final pair1 = BellPair(
        LatticeCoord(3, 0, 0, 0),
        LatticeCoord(3, 2, 2, 2),
      );
      final pair2 = BellPair(
        LatticeCoord(3, 1, 0, 0),
        LatticeCoord(3, 1, 2, 2),
      );
      state.applyRotationAt(LatticeCoord(3, 0, 0, 0), 1, 1);
      pair1.synchronize(state, LatticeCoord(3, 0, 0, 0), 1, 1);
      state.applyRotationAt(LatticeCoord(3, 1, 0, 0), 2, -1);
      pair2.synchronize(state, LatticeCoord(3, 1, 0, 0), 2, -1);
      expect(auditConservation(state), isTrue);
    });
  });

  group('BellPair trigger validation', () {
    test('synchronize is no-op when trigger is not cellA or cellB', () {
      final state = LatticeState(3);
      final cellA = LatticeCoord(3, 0, 0, 0);
      final cellB = LatticeCoord(3, 2, 2, 2);
      final other = LatticeCoord(3, 1, 1, 1);
      state.cellAtCoord(cellB).swEffective = 99.0;
      final before = state.cellAtCoord(cellB).swEffective;

      final pair = BellPair(cellA, cellB);
      pair.synchronize(state, other, 0, 1);

      expect(state.cellAtCoord(cellB).swEffective, before,
          reason: 'Partner must be unchanged when trigger is not in pair');
    });

    test('synchronize with trigger cellA updates cellB', () {
      final state = LatticeState(3);
      final a = LatticeCoord(3, 0, 0, 0);
      final b = LatticeCoord(3, 2, 2, 2);
      final pair = BellPair(a, b);
      final otherB = rotateQuarter(b, 2, -1);
      final valueAtB = state.cellAtCoord(b).swEffective;
      final valueAtOtherB = state.cellAtCoord(otherB).swEffective;
      state.applyRotationAt(a, 2, 1);
      pair.synchronize(state, a, 2, 1);
      expect(state.cellAtCoord(b).swEffective, valueAtOtherB,
          reason: 'Anti-rotation swaps B with rotateQuarter(B, axis, -1)');
    });

    test('synchronize with trigger cellB updates cellA', () {
      final state = LatticeState(3);
      final a = LatticeCoord(3, 0, 0, 0);
      final b = LatticeCoord(3, 2, 2, 2);
      final pair = BellPair(a, b);
      final otherA = rotateQuarter(a, 0, 1);
      final valueAtOtherA = state.cellAtCoord(otherA).swEffective;
      state.applyRotationAt(b, 0, -1);
      pair.synchronize(state, b, 0, -1);
      expect(state.cellAtCoord(a).swEffective, valueAtOtherA,
          reason: 'Anti-rotation swaps A with rotateQuarter(A, axis, 1)');
    });
  });

  group('BellPair zero-sum (anti-direction)', () {
    test('A +1 and B -1 on same axis: net permutation, D2 unchanged', () {
      final state = LatticeState(3);
      final a = LatticeCoord(3, 0, 0, 0);
      final b = LatticeCoord(3, 2, 2, 2);
      final totalBefore = state.totalEffectiveWeight;

      state.applyRotationAt(a, 1, 1);
      BellPair(a, b).synchronize(state, a, 1, 1);

      expect(state.totalEffectiveWeight, totalBefore);
      expect(auditConservation(state), isTrue);
    });
  });

  group('BellPair couplingStrength (currently a gate)', () {
    test('couplingStrength 1.0 applies full anti-rotation (deterministic)', () {
      final state = LatticeState(3);
      final a = LatticeCoord(3, 0, 0, 0);
      final b = LatticeCoord(3, 2, 2, 2);
      final otherB = rotateQuarter(b, 2, -1);
      final valueAtOtherB = state.cellAtCoord(otherB).swEffective;
      state.applyRotationAt(a, 2, 1);
      BellPair(a, b, couplingStrength: 1.0).synchronize(state, a, 2, 1);
      expect(state.cellAtCoord(b).swEffective, valueAtOtherB);
    });

    test('couplingStrength 0: synchronize is no-op (isolation)', () {
      final state = LatticeState(3);
      final a = LatticeCoord(3, 0, 0, 0);
      final b = LatticeCoord(3, 2, 2, 2);
      final valBefore = state.cellAtCoord(b).swEffective;
      state.applyRotationAt(a, 2, 1);
      BellPair(a, b, couplingStrength: 0).synchronize(state, a, 2, 1);
      expect(state.cellAtCoord(b).swEffective, valBefore);
    });
  });

  group('BellPair composition / order-invariance', () {
    test(
        'two pairs sharing trigger: sync order pair1 then pair2 vs pair2 then pair1 yields same final state',
        () {
      final a = LatticeCoord(3, 0, 0, 0);
      final b = LatticeCoord(3, 2, 2, 2);
      final c = LatticeCoord(3, 1, 1, 2);
      final pair1 = BellPair(a, b);
      final pair2 = BellPair(a, c);

      final state1 = LatticeState(3);
      state1.applyRotationAt(a, 1, 1);
      pair1.synchronize(state1, a, 1, 1);
      pair2.synchronize(state1, a, 1, 1);

      final state2 = LatticeState(3);
      state2.applyRotationAt(a, 1, 1);
      pair2.synchronize(state2, a, 1, 1);
      pair1.synchronize(state2, a, 1, 1);

      for (var i = 0; i < state1.length; i++) {
        final cell1 = state1.cells[i];
        final cell2 = state2.cells[i];
        expect(cell2.coord, cell1.coord);
        expect(cell2.swEffective, cell1.swEffective,
            reason:
                'Sync order (pair1 then pair2) vs (pair2 then pair1) must be commutative');
        expect(cell2.active, cell1.active);
      }
      expect(auditConservation(state1), isTrue);
      expect(auditConservation(state2), isTrue);
    });

    test(
        'two pairs sharing trigger: ledger and audit pass regardless of sync order',
        () {
      final a = LatticeCoord(3, 0, 0, 0);
      final b = LatticeCoord(3, 2, 0, 0);
      final c = LatticeCoord(3, 0, 2, 2);
      final pair1 = BellPair(a, b);
      final pair2 = BellPair(a, c);
      final target = totalEnergySymbolic(3);

      final state = LatticeState(3);
      state.applyRotationAt(a, 2, -1);
      pair1.synchronize(state, a, 2, -1);
      pair2.synchronize(state, a, 2, -1);

      expect(state.totalEffectiveWeight, target);
      expect(auditConservation(state), isTrue);
    });
  });
}
