import type { BattleUIEvent, BattleUIEventHandler } from './BattleUIEvent';

type Unsubscribe = () => void;

export class BattleEventBus {
  private handlers = new Map<string, Set<BattleUIEventHandler>>();
  private globalHandlers = new Set<BattleUIEventHandler>();

  subscribe(type: string, handler: BattleUIEventHandler): Unsubscribe {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
    return () => this.handlers.get(type)?.delete(handler);
  }

  subscribeAll(handler: BattleUIEventHandler): Unsubscribe {
    this.globalHandlers.add(handler);
    return () => this.globalHandlers.delete(handler);
  }

  emit(event: BattleUIEvent): void {
    this.globalHandlers.forEach((h) => h(event));
    this.handlers.get(event.type)?.forEach((h) => h(event));
    this.handlers.get('*')?.forEach((h) => h(event));
  }

  clear(): void {
    this.handlers.clear();
    this.globalHandlers.clear();
  }
}

export function createBattleEventBus(): BattleEventBus {
  return new BattleEventBus();
}
