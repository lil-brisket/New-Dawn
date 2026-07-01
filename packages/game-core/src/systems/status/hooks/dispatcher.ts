import type { BattleEvent } from '@dawn/types';
import type { EffectContext } from '../../scaling/EffectContext';
import type { StatusInstance } from '@dawn/types';

export type StatusHookEvent =
  | 'onBeforeApply'
  | 'onApply'
  | 'onExpire'
  | 'onTurnStart'
  | 'onTurnEnd'
  | 'onMove'
  | 'onAttack'
  | 'onHit'
  | 'onKill'
  | 'onDeath';

export interface StatusHookContext extends EffectContext {
  readonly instance?: StatusInstance;
  events: BattleEvent[];
}

export interface StatusHookHandler {
  readonly event: StatusHookEvent;
  handle(ctx: StatusHookContext): void;
}

class StatusHookDispatcherImpl {
  private readonly handlers: StatusHookHandler[] = [];

  register(handler: StatusHookHandler): void {
    this.handlers.push(handler);
  }

  dispatch(event: StatusHookEvent, ctx: StatusHookContext): void {
    for (const handler of this.handlers) {
      if (handler.event === event) {
        handler.handle(ctx);
      }
    }
  }
}

export const statusHookDispatcher = new StatusHookDispatcherImpl();
