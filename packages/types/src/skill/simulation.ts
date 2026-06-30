import type { BattleEvent } from '../events/battle';
import type { HexCoord } from '../battle/grid';

export interface SkillSimulation {
  readonly ok: true;
  readonly damage: ReadonlyMap<string, number>;
  readonly healing: ReadonlyMap<string, number>;
  readonly statuses: ReadonlyArray<{ targetId: string; statusId: string }>;
  readonly movement?: { from: HexCoord; to: HexCoord };
  readonly events: readonly BattleEvent[];
}
