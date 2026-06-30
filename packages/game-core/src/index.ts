export {
  getActiveCombatant,
  getCombatant,
  getReachableTiles,
  getReachableTileCosts,
  getAttackableTargets,
  isAttackableTarget,
  getAttackRangeTiles,
  getCombatantAt,
  isCombatantAlive,
  canMoveTo,
  getRemainingMoves,
  isPlayerTurn,
} from './queries';

export type { ReachableTileCost } from './queries';

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

export { createHex, cubeToOffset, offsetToCube, createGrid } from './grid/Grid';
export { getAllCoords } from './grid/GridOps';
export { findPath } from './systems/movement/Pathfinder';

export {
  sandboxForceKill,
  sandboxForceHeal,
  sandboxAdvanceTurns,
  sandboxSkipRound,
} from './sandbox';
export type { SandboxResult } from './sandbox';

export {
  createRecording,
  appendAction,
  serializeRecording,
  parseRecording,
  replayRecording,
} from './replay';
export type { BattleRecording, ReplayResult, ReplayStep } from './replay';

export {
  planTurn,
  getStrategy,
  nearestEnemyStrategy,
  passiveStrategy,
  doNothingStrategy,
} from './ai/planTurn';
export type { AIStrategy } from './ai/types';
