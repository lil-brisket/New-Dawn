export {
  getActiveCombatant,
  getCombatant,
  getReachableTiles,
  isCombatantAlive,
  canMoveTo,
  isPlayerTurn,
} from './queries';

export type {
  BattleState,
  BattleAction,
  BattleEvent,
  BattleError,
  ActionResult,
  BattleConfig,
  Combatant,
  Team,
  Grid,
  Tile,
  HexCoord,
  TurnActionState,
} from '@dawn/types';

export { createBattle } from './battle/createBattle';
export type { CreateBattleInput, CreateBattleResult } from './battle/createBattle';
export { dispatchAction } from './battle/dispatchAction';
