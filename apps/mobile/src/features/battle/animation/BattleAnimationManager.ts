import type { BattleUIEvent } from '../events/BattleUIEvent';
import type { BattleEventBus } from '../events/battleEventBus';
import type { BattleUIEventQueue } from '../events/BattleUIEventQueue';

export type AnimationCallbacks = {
  onDamage?: (event: BattleUIEvent) => void;
  onHeal?: (event: BattleUIEvent) => void;
  onTurnBanner?: (event: BattleUIEvent) => void;
  onMove?: (event: BattleUIEvent) => void;
  onDeath?: (event: BattleUIEvent) => void;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
};

/**
 * Processes battle UI events sequentially. Future queue should sort by {@link AnimationPriority}
 * so damage, movement, and celebration animations do not compete.
 */
export class BattleAnimationManager {
  private callbacks: AnimationCallbacks = {};

  constructor(
    private readonly queue: BattleUIEventQueue,
    private readonly bus: BattleEventBus,
  ) {
    this.queue.setStepHandler(async (event) => {
      this.callbacks.onAnimationStart?.();
      this.bus.emit(event);
      this.dispatchAnimation(event);
      if (this.queue.length === 0) {
        this.callbacks.onAnimationEnd?.();
      }
    });
  }

  setCallbacks(callbacks: AnimationCallbacks): void {
    this.callbacks = callbacks;
  }

  enqueue(events: BattleUIEvent[]): void {
    if (events.length === 0) return;
    this.queue.enqueue(events);
  }

  playDamage(targetId: string, amount: number): void {
    void targetId;
    void amount;
  }

  playHeal(targetId: string, amount: number): void {
    void targetId;
    void amount;
  }

  playTurnBanner(message: string): void {
    void message;
  }

  playMove(combatantId: string): void {
    void combatantId;
  }

  playDeath(combatantId: string): void {
    void combatantId;
  }

  get isProcessing(): boolean {
    return this.queue.isProcessing;
  }

  clear(): void {
    this.queue.clear();
  }

  private dispatchAnimation(event: BattleUIEvent): void {
    switch (event.type) {
      case 'damage':
        this.callbacks.onDamage?.(event);
        break;
      case 'heal':
        this.callbacks.onHeal?.(event);
        break;
      case 'turn':
        this.callbacks.onTurnBanner?.(event);
        break;
      case 'move':
        this.callbacks.onMove?.(event);
        break;
      case 'death':
        this.callbacks.onDeath?.(event);
        break;
      default:
        break;
    }
  }
}

export function createBattleAnimationManager(
  queue: BattleUIEventQueue,
  bus: BattleEventBus,
): BattleAnimationManager {
  return new BattleAnimationManager(queue, bus);
}
