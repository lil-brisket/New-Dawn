import type { BattleCommand, BattleState } from '@dawn/types';
import { scoreAttack, scoreHeal, scoreMove, scoreEscape } from './Scorers/AttackScore';

/** TODO: Implement behavior tree nodes for complex AI. */
export interface BehaviorNode {
  evaluate(state: BattleState, entityId: string): BattleCommand | null;
}

/** Picks highest-scoring action for an AI entity. */
export class DecisionPipeline {
  decide(state: BattleState, entityId: string): BattleCommand | null {
    const ctx = { state, entityId };
    const scores = [scoreAttack(ctx), scoreHeal(ctx), scoreMove(ctx), scoreEscape(ctx)];
    scores.sort((a, b) => b.score - a.score);

    const best = scores[0];
    if (!best || best.score <= 0) {
      return { type: 'end_turn', actorId: entityId };
    }

    if (best.action === 'attack') {
      const entity = state.entities[entityId];
      const target = Object.values(state.entities).find(
        (e) => e.isAlive && e.faction !== entity?.faction,
      );
      if (target) {
        return { type: 'attack', actorId: entityId, targetId: target.id };
      }
    }

    return { type: 'end_turn', actorId: entityId };
  }
}
