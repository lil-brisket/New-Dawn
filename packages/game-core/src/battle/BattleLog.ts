import type { BattleLogEntry } from '@dawn/types';
import type { Clock } from '@dawn/utils';

export class BattleLog {
  private entries: BattleLogEntry[] = [];
  private clock: Clock;

  constructor(clock: Clock) {
    this.clock = clock;
  }

  append(entry: Omit<BattleLogEntry, 'timestamp'>): BattleLogEntry {
    const full: BattleLogEntry = { ...entry, timestamp: this.clock.now() };
    this.entries.push(full);
    return full;
  }

  getEntries(): readonly BattleLogEntry[] {
    return this.entries;
  }

  clear(): void {
    this.entries = [];
  }
}
