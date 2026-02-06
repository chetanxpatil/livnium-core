import 'package:livnium_core/livnium_core.dart';
import 'package:test/test.dart';

/// Scientific tests for D4: Basin Selection Rule — conservation after reinforce/diffuse.
void main() {
  group('D4 Basin Selection Rule', () {
    test('after reinforcement (correct=true), total weight equals D2', () {
      final state = LatticeState(3);
      state.cells.first.active = true;
      updateBasinGeometry(state, true);
      expect(
        state.totalEffectiveWeight,
        closeTo(totalEnergySymbolic(3), 1e-8),
        reason: 'Renormalization must restore D2',
      );
      expect(auditConservation(state), isTrue);
    });

    test('after diffusion (correct=false), total weight equals D2', () {
      final state = LatticeState(3);
      for (var i = 0; i < 5; i++) state.cells[i].active = true;
      updateBasinGeometry(state, false);
      expect(
        state.totalEffectiveWeight,
        closeTo(totalEnergySymbolic(3), 1e-6),
        reason: 'Renormalization must restore D2 after diffusion',
      );
      expect(auditConservation(state), isTrue);
    });

    test('reinforcement increases stability index of active cells', () {
      final state = LatticeState(3);
      state.cells[0].active = true;
      final before = state.cells[0].stabilityIndex;
      updateBasinGeometry(state, true);
      expect(state.cells[0].stabilityIndex, greaterThan(before));
    });

    test('diffusion decreases stability index of active cells', () {
      final state = LatticeState(3);
      state.cells[0].active = true;
      state.cells[0].stabilityIndex = 5;
      updateBasinGeometry(state, false);
      expect(state.cells[0].stabilityIndex, lessThan(5));
    });

    test('multiple reinforce then diffuse still conserves', () {
      final state = LatticeState(3);
      state.cells[0].active = true;
      state.cells[1].active = true;
      for (var i = 0; i < 10; i++) {
        updateBasinGeometry(state, i.isEven);
      }
      expect(state.totalEffectiveWeight, closeTo(totalEnergySymbolic(3), 1e-5));
      expect(auditConservation(state), isTrue);
    });
  });
}
