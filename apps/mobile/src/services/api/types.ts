import type { ActionResult, BattleAction, BattleEvent, BattleState } from '@dawn/types';

export interface StartBattleRequest {
  playerCharacterIds: string[];
  enemyDefinitionIds: string[];
}

export interface BattleRepository {
  startBattle(
    request: StartBattleRequest,
  ): Promise<{ snapshot: BattleState; events: BattleEvent[] }>;
  submitCommand(battleId: string, command: BattleAction): Promise<ActionResult>;
}
