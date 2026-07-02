import { describe, expect, it } from 'vitest';
import { createHex } from '../../grid/HexCoord';
import { createCombatant } from '../../entities/Combatant';
import { defaultRegistry } from '@dawn/game-data';
import { createEffectContext } from './EffectContext';
import { evaluateFormula, getEffectiveStat } from './getEffectiveStat';
import {
  calculateFinalDamage,
  calculateMitigation,
  calculateOffense,
  resolveDamage,
  resolveHealing,
} from './formulaPipeline';
import { calculateApplicationChance, calculateDuration } from './statusFormulas';
import { formulaModifierRegistry, type FormulaModifier } from './modifierRegistry';
import { createSeededRandom } from '@dawn/utils';
import { resolveTagApplication } from '../tag/resolveTagApplication';
import { createBattle } from '../../battle/createBattle';
import { createGrid } from '../../grid/Grid';

function makeCtx(overrides?: {
  sourceAttack?: number;
  sourceWillpower?: number;
  targetDefense?: number;
  targetResistance?: number;
}) {
  const source = createCombatant({
    id: 'src',
    name: 'Src',
    team: 'player',
    position: createHex(0, 0),
    hp: 100,
    maxHp: 100,
    sp: 50,
    maxSp: 50,
    attack: overrides?.sourceAttack ?? 20,
    defense: 10,
    willpower: overrides?.sourceWillpower ?? 15,
    resistance: 10,
    movement: 3,
    ap: 30,
    maxAp: 30,
  });
  const target = createCombatant({
    id: 'tgt',
    name: 'Tgt',
    team: 'enemy',
    position: createHex(1, -1),
    hp: 100,
    maxHp: 100,
    sp: 20,
    maxSp: 20,
    attack: 10,
    defense: overrides?.targetDefense ?? 5,
    willpower: 10,
    resistance: overrides?.targetResistance ?? 10,
    movement: 3,
    ap: 30,
    maxAp: 30,
  });
  const battle = createBattle({
    party: [source],
    enemies: [target],
    grid: createGrid({ width: 8, height: 8 }),
    seed: 1,
  });
  if (!battle.ok) throw new Error('battle setup failed');

  return createEffectContext({
    source,
    target,
    battle: battle.state,
    registry: defaultRegistry,
    combatStats: defaultRegistry.getCombatStatsConfig(),
    rng: createSeededRandom(42),
  });
}

describe('evaluateFormula', () => {
  it('returns base when terms empty', () => {
    const ctx = makeCtx();
    expect(evaluateFormula({ base: 15, terms: [] }, ctx)).toBe(15);
  });

  it('scales from attack stat', () => {
    const ctx = makeCtx({ sourceAttack: 20 });
    const result = evaluateFormula(
      { base: 0, terms: [{ source: 'stat', key: 'attack', ratio: 1.4 }] },
      ctx,
    );
    expect(result).toBe(28);
  });

  it('sums multiple stat terms', () => {
    const ctx = makeCtx({ sourceAttack: 20 });
    const result = evaluateFormula(
      {
        base: 10,
        terms: [
          { source: 'stat', key: 'attack', ratio: 0.6 },
          { source: 'stat', key: 'defense', ratio: 0.8 },
        ],
      },
      ctx,
    );
    expect(result).toBe(10 + 12 + 8);
  });

  it('returns 0 for unsupported term sources', () => {
    const ctx = makeCtx();
    expect(
      evaluateFormula({ base: 5, terms: [{ source: 'level', key: 'level', ratio: 2 }] }, ctx),
    ).toBe(5);
  });
});

describe('damage pipeline', () => {
  it('stages offense mitigation and final damage', () => {
    const ctx = makeCtx({ sourceAttack: 20, targetDefense: 5 });
    const formula = { base: 0, terms: [{ source: 'stat' as const, key: 'attack', ratio: 1.0 }] };
    const offense = calculateOffense(formula, ctx);
    const mitigation = calculateMitigation(offense, ctx);
    const final = calculateFinalDamage(offense, mitigation, ctx);
    expect(offense).toBe(20);
    expect(mitigation).toBe(5);
    expect(final).toBe(15);
  });

  it('floors final damage at 1', () => {
    const ctx = makeCtx({ sourceAttack: 5, targetDefense: 20 });
    const damage = resolveDamage(
      { base: 0, terms: [{ source: 'stat', key: 'attack', ratio: 1 }] },
      ctx,
    );
    expect(damage).toBe(1);
  });
});

describe('formula modifiers', () => {
  it('modifies offense without changing mitigation base', () => {
    const modifier: FormulaModifier = {
      phase: 'offense',
      modify: (v) => v * 2,
    };
    formulaModifierRegistry.register(modifier);
    const ctx = makeCtx({ sourceAttack: 10, targetDefense: 3 });
    const formula = { base: 0, terms: [{ source: 'stat' as const, key: 'attack', ratio: 1 }] };
    const offense = calculateOffense(formula, ctx);
    expect(offense).toBe(20);
  });
});

describe('status formulas', () => {
  it('calculates application chance from willpower vs resistance', () => {
    const ctx = makeCtx({ sourceWillpower: 20, targetResistance: 10 });
    const chance = calculateApplicationChance(0.3, ctx);
    expect(chance).toBeCloseTo(0.35, 5);
  });

  it('clamps application chance to 0-1', () => {
    const ctx = makeCtx({ sourceWillpower: 0, targetResistance: 100 });
    expect(calculateApplicationChance(0.1, ctx)).toBe(0);
  });

  it('applies duration reduction from resistance', () => {
    const ctx = makeCtx({ targetResistance: 10 });
    const duration = calculateDuration(3, ctx);
    expect(duration).toBe(3);
  });
});

describe('resolveTagApplication', () => {
  it('writes source snapshots on apply', () => {
    const ctx = makeCtx({ sourceAttack: 25 });
    const result = resolveTagApplication({
      ctx,
      tagId: 'tag_burn',
      baseChance: 1,
    });
    expect(result.applied).toBe(true);
    const instance = result.state.combatants.get('tgt')!.tags[0]!;
    expect(instance.sourceSnapshots?.attack).toBe(25);
  });
});

describe('legacy migration equivalence', () => {
  it('multiplier 1.4 on attack 20 equals stat formula', () => {
    const ctx = makeCtx({ sourceAttack: 20 });
    const legacy = evaluateFormula(
      { base: 0, terms: [{ source: 'stat', key: 'attack', ratio: 1.4 }] },
      ctx,
    );
    expect(legacy).toBe(28);
  });
});

describe('resolveHealing', () => {
  it('heals from willpower scaling', () => {
    const ctx = makeCtx({ sourceWillpower: 20 });
    const amount = resolveHealing(
      { base: 15, terms: [{ source: 'stat', key: 'willpower', ratio: 1.4 }] },
      ctx,
    );
    expect(amount).toBe(15 + 28);
  });
});

describe('getEffectiveStat', () => {
  it('returns base stat when no buffs', () => {
    const ctx = makeCtx({ sourceAttack: 22 });
    expect(getEffectiveStat(ctx, 'attack', ctx.source)).toBe(22);
  });
});
