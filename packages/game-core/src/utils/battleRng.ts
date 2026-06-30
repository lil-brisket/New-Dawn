import type { BattleState } from '@dawn/types';
import { createSeededRandom } from '@dawn/utils';

export function getBattleRng(state: BattleState) {
  return createSeededRandom(state.seed + state.history.length);
}
