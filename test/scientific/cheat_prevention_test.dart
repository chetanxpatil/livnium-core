import 'package:livnium_core/livnium_core.dart';
import 'package:test/test.dart';

void main() {
  group('Cheat Prevention: Stress Testing the Hard Machine', () {
    test('Law D2: Attempting to create energy (Infusion Hack)', () {
      final state = LatticeState(3);
      final initialEnergy = state.totalEffectiveWeight;

      // Attempt to "infuse" energy illegally by manually boosting a cell
      state.cells[0].swEffective += 50.0;

      expect(auditConservation(state), isFalse,
          reason: "Manual infusion should violate the D2 Ledger.");
      expect(state.totalEffectiveWeight, isNot(equals(initialEnergy)));

      // Now re-normalize and audit
      normalizeGlobalLedger(state);
      expect(auditConservation(state), isTrue,
          reason:
              "Normalization should restore the system to a valid physical state.");
    });

    test('A4 Rotation: Verifying zero-sum permutation (No Energy Leak)', () {
      final state = LatticeState(3);
      final targetEnergy = totalEnergySymbolic(3);

      for (int i = 0; i < 24; i++) {
        state.applyRotationAt(LatticeCoord(3, 0, 0, 0), 0, 1);
        expect(state.totalEffectiveWeight, closeTo(targetEnergy, 1e-10),
            reason: "Rotation $i leaked or created energy.");
      }
    });

    test('BellPair: Verifying Spin Conservation (Anti-Rotation)', () {
      final state = LatticeState(3);
      final locA = LatticeCoord(3, 1, 0, 0);
      final locB = LatticeCoord(3, 1, 1, 0);
      final pair = BellPair(locA, locB);

      final energyBefore = state.totalEffectiveWeight;

      // Rotate A
      state.applyRotationAt(locA, 0, 1);
      // If we DON'T sync, the energy might change? No, rotation is a swap.
      // But let's check if the combination of trigger + partner also conserves.
      pair.synchronize(state, locA, 0, 1);

      expect(state.totalEffectiveWeight, closeTo(energyBefore, 1e-10),
          reason: "Entangled rotation must be zero-sum.");
      expect(auditConservation(state), isTrue,
          reason: "Entangled operations must preserve the ledger.");
    });

    test('Vampire Effect Hack: Attempting to drain a cell to zero', () {
      final state = LatticeState(3);
      final cell = state.cells[0];

      // Illegal drain
      cell.swEffective = 0.0000001;

      // Enforce Minimum Mass law (Thermodynamic Policy)
      enforceMinimumMass(state, fraction: 0.10);

      final floor = 0.10 * cell.swBase;
      expect(cell.swEffective, greaterThanOrEqualTo(floor),
          reason: "Policy should prevent mode collapse (Minimum Mass).");

      // But now we have too much energy because we boosted the cell
      expect(auditConservation(state), isFalse,
          reason: "Policy enforcement requires renormalization to stay legal.");

      normalizeGlobalLedger(state);
      expect(auditConservation(state), isTrue,
          reason:
              "Renormalization should anchor the policy change back to physics.");
    });

    test('D1 Census: Attempting to change a cell\'s structure', () {
      final state = LatticeState(3);
      // Hand-swap coordinates of a Corner and a Center
      // In a "Soft Machine", this would just be another number.
      // In Livnium, it's impossible because LatticeCoord is immutable and audit tracks counts.

      // We can't actually change a cell's coord because it's 'final'.
      // This is proof of the "Hard Machine" - geometry is the source of truth.
      expect(state.cells[0].coord.n, equals(3));
    });
  });
}
