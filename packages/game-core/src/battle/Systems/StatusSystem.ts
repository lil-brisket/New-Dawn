import type { BattleState } from '@dawn/types';
import type { SystemContext } from './System';

/** Processes status effects at turn start. TODO: implement tick damage, expiry. */
export class StatusSystem {
  readonly name = 'StatusSystem';

  tickTurn(state: BattleState, _ctx: SystemContext): void {
    for (const entity of Object.values(state.entities)) {
      if (!entity.isAlive) continue;
      // TODO: Apply DoT, check expiry, remove expired statuses
      void entity.statusEffectIds;
    }
    void state;
  }
}
