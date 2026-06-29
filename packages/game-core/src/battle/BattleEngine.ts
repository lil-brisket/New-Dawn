import type {
  BattleCommand,
  BattleEvent,
  BattleLogEntry,
  BattleState,
  CommandResult,
} from '@dawn/types';
import { createSnapshot } from '@dawn/utils';
import type { EngineContext } from '../context/EngineContext';
import { EventBus } from '../events/EventBus';
import { BattleLog } from './BattleLog';
import { validateCommand } from './CommandValidator';
import { AttackSystem } from './Systems/AttackSystem';
import { DeathSystem } from './Systems/DeathSystem';
import { MovementSystem } from './Systems/MovementSystem';
import { SkillSystem } from './Systems/SkillSystem';
import type { System, SystemContext } from './Systems/System';
import { TurnSystem } from './Systems/TurnSystem';
import { VictorySystem } from './Systems/VictorySystem';

export class BattleEngine {
  private state: BattleState;
  private eventBus: EventBus<BattleEvent>;
  private battleLog: BattleLog;
  private systems: System[];
  private deathSystem: DeathSystem;
  private victorySystem: VictorySystem;
  private ctx: EngineContext;

  constructor(initialState: BattleState, ctx: EngineContext) {
    this.state = initialState;
    this.ctx = ctx;
    this.eventBus = new EventBus<BattleEvent>();
    this.battleLog = new BattleLog(ctx.clock);
    this.systems = [new MovementSystem(), new AttackSystem(), new SkillSystem(), new TurnSystem()];
    this.deathSystem = new DeathSystem();
    this.victorySystem = new VictorySystem();
  }

  submitCommand(command: BattleCommand): CommandResult {
    const validation = validateCommand(this.state, command);
    if (!validation.ok) {
      return { success: false, error: validation.error, command };
    }

    const systemCtx: SystemContext = {
      engine: this.ctx,
      eventBus: this.eventBus,
      battleLog: this.battleLog,
    };

    for (const system of this.systems) {
      if (system.canHandle(command)) {
        system.execute(this.state, command, systemCtx);
      }
    }

    this.deathSystem.checkDeaths(this.state, systemCtx);
    this.victorySystem.checkOutcome(this.state, systemCtx);

    return { success: true, command };
  }

  getSnapshot(): Readonly<BattleState> {
    return createSnapshot(this.state);
  }

  getBattleLog(): readonly BattleLogEntry[] {
    return this.battleLog.getEntries();
  }

  getEventBus(): EventBus<BattleEvent> {
    return this.eventBus;
  }

  getState(): BattleState {
    return this.state;
  }
}
