import type { BattleCommand, BattleEvent, BattleState } from '@dawn/types';
import type { EngineContext } from '../../context/EngineContext';
import type { EventBus } from '../../events/EventBus';
import type { BattleLog } from '../BattleLog';

export interface SystemContext {
  engine: EngineContext;
  eventBus: EventBus<BattleEvent>;
  battleLog: BattleLog;
}

export interface System {
  readonly name: string;
  canHandle(command: BattleCommand): boolean;
  execute(state: BattleState, command: BattleCommand, ctx: SystemContext): void;
}
