import type { MoveEffect } from '@dawn/types';
import type { AbilityContext } from '../AbilityContext';
import { withPosition } from '../../../entities/Combatant';
import { getCombatant } from '../../../queries/getActiveCombatant';
import { updateMap } from '../../../utils/immutable';
import { equals } from '../../../grid/HexMath';

export function resolveMoveEffect(effect: MoveEffect, ctx: AbilityContext): void {
  if (!ctx.targetTile) return;

  const source = getCombatant(ctx.battle, ctx.source.id);
  if (!source) return;

  const from = source.position;
  const to = ctx.targetTile;

  if (!equals(from, to)) {
    const updated = withPosition(source, to);
    ctx.battle = {
      ...ctx.battle,
      combatants: updateMap(ctx.battle.combatants, source.id, updated),
    };

    ctx.events.push({
      type: 'combatant_moved',
      combatantId: source.id,
      from,
      to,
    });
  }

  void effect.range;
}
