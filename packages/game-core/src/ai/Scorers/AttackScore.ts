import type { BattleState } from '@dawn/types';

export interface ScoreContext {
  state: BattleState;
  entityId: string;
}

export interface ActionScore {
  action: string;
  score: number;
}

export function scoreAttack(ctx: ScoreContext): ActionScore {
  const entity = ctx.state.entities[ctx.entityId];
  const enemies = Object.values(ctx.state.entities).filter(
    (e) => e.isAlive && e.faction !== entity?.faction,
  );
  return { action: 'attack', score: enemies.length > 0 ? 0.7 : 0 };
}

export function scoreHeal(_ctx: ScoreContext): ActionScore {
  return { action: 'heal', score: 0.3 };
}

export function scoreMove(_ctx: ScoreContext): ActionScore {
  return { action: 'move', score: 0.4 };
}

export function scoreEscape(_ctx: ScoreContext): ActionScore {
  return { action: 'escape', score: 0.1 };
}
