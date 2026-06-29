import { describe, expect, it } from 'vitest';
import { createTestClock } from '@dawn/utils';
import { BattleLog } from './BattleLog';

describe('BattleLog', () => {
  it('appends entries with timestamp', () => {
    const clock = createTestClock(1000);
    const log = new BattleLog(clock);
    const entry = log.append({
      actorId: 'a1',
      targetIds: ['t1'],
      command: { type: 'attack', actorId: 'a1', targetId: 't1' },
    });
    expect(entry.timestamp).toBe(1000);
    expect(log.getEntries()).toHaveLength(1);
  });
});
