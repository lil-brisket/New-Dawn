import type { TurnActionState } from '@dawn/types';

export const INITIAL_TURN_ACTION_STATE: TurnActionState = {
  movesUsed: 0,
  hasUsedPrimaryAction: false,
  apSpent: 0,
};
