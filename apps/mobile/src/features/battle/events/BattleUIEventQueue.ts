import type { BattleUIEvent } from './BattleUIEvent';

const MAX_DURATION = 250;

export type UIEventStepHandler = (event: BattleUIEvent) => Promise<void>;

/** Sequential UI event processor — extends AnimationQueue pattern */
export class BattleUIEventQueue {
  private queue: BattleUIEvent[] = [];
  private processing = false;
  private onStep?: UIEventStepHandler;
  private _isProcessing = false;

  setStepHandler(handler: UIEventStepHandler): void {
    this.onStep = handler;
  }

  enqueue(events: BattleUIEvent[]): void {
    this.queue.push(...events);
    void this.process();
  }

  get isProcessing(): boolean {
    return this._isProcessing;
  }

  private async process(): Promise<void> {
    if (this.processing || !this.onStep) return;
    this.processing = true;
    this._isProcessing = true;

    while (this.queue.length > 0) {
      const event = this.queue.shift()!;
      const duration = Math.min(event.duration ?? MAX_DURATION, MAX_DURATION);
      await this.onStep(event);
      if (duration > 0) {
        await new Promise((r) => setTimeout(r, duration));
      }
    }

    this.processing = false;
    this._isProcessing = false;
  }

  clear(): void {
    this.queue = [];
    this._isProcessing = false;
    this.processing = false;
  }

  get length(): number {
    return this.queue.length;
  }
}

export function createBattleUIEventQueue(): BattleUIEventQueue {
  return new BattleUIEventQueue();
}
