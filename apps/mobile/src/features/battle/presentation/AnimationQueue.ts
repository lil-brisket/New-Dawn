import type { AnimationStep } from './AnimationStep';

/** Presentation-layer queue: Engine events → sequential animation steps → React/Reanimated */
export class AnimationQueue {
  private queue: AnimationStep[] = [];
  private processing = false;
  private onStep?: (step: AnimationStep) => Promise<void>;

  setStepHandler(handler: (step: AnimationStep) => Promise<void>) {
    this.onStep = handler;
  }

  enqueue(steps: AnimationStep[]): void {
    this.queue.push(...steps);
    void this.process();
  }

  private async process(): Promise<void> {
    if (this.processing || !this.onStep) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const step = this.queue.shift()!;
      await this.onStep(step);
    }

    this.processing = false;
  }

  clear(): void {
    this.queue = [];
  }

  get length(): number {
    return this.queue.length;
  }
}
