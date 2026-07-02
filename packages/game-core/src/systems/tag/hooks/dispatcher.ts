import type { BattleEvent, TagInstance } from '@dawn/types';
import type { EffectContext } from '../../scaling/EffectContext';

export type TagHookEvent =
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

export interface TagHookContext extends EffectContext {
  readonly instance?: TagInstance;
  events: BattleEvent[];
}

export interface TagHookHandler {
  readonly event: TagHookEvent;
  handle(ctx: TagHookContext): void;
}

class TagHookDispatcherImpl {
  private readonly handlers: TagHookHandler[] = [];

  register(handler: TagHookHandler): void {
    this.handlers.push(handler);
  }

  dispatch(event: TagHookEvent, ctx: TagHookContext): void {
    for (const handler of this.handlers) {
      if (handler.event === event) {
        handler.handle(ctx);
      }
    }
  }
}

export const tagHookDispatcher = new TagHookDispatcherImpl();

/** @deprecated Use tagHookDispatcher */
export const statusHookDispatcher = tagHookDispatcher;
