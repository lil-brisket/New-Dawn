import type { BattleCommand, BattleState, BattleLogEntry, CommandResult } from '@dawn/types';

export interface StartBattleRequest {
  playerCharacterIds: string[];
  enemyDefinitionIds: string[];
}

export interface BattleRepository {
  startBattle(
    request: StartBattleRequest,
  ): Promise<{ snapshot: BattleState; log: BattleLogEntry[] }>;
  submitCommand(
    battleId: string,
    command: BattleCommand,
  ): Promise<CommandResult & { snapshot?: BattleState }>;
}
