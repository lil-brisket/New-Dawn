import type { BattleCommand } from './commands/battle';

export interface BattleLogEntry {
  timestamp: number;
  actorId: string;
  targetIds: string[];
  command: BattleCommand;
  damage?: number;
  isCritical?: boolean;
  statusApplied?: string;
  animationKey?: string;
  soundKey?: string;
  metadata?: Record<string, string | number | boolean>;
}
