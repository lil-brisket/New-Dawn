# Stat Scaling

Dawn uses a data-driven **StatFormula** pipeline for skills, statuses, and combat resolution. No skill-specific code paths — all scaling comes from content JSON.

## Core types

### StatFormula

```json
{
  "base": 20,
  "terms": [{ "source": "stat", "key": "attack", "ratio": 1.2 }]
}
```

- `base` — flat constant added to the result
- `terms` — list of scaling contributions (empty array is valid)
- Each term: `source` (how to resolve), `key` (stat id when source is `stat`), `ratio` (multiplier)

### Formula term sources

| Source                                                    | Status                                   |
| --------------------------------------------------------- | ---------------------------------------- |
| `stat`                                                    | Implemented — uses effective combat stat |
| `stacks`, `level`, `missing_hp`, `hp_percent`, `distance` | Scaffolded — return 0 until implemented  |

### CombatStatId

Stat IDs are defined in [`content/config/combat_stats.json`](../content/config/combat_stats.json). The content pipeline codegen emits a TypeScript union:

```typescript
export type CombatStatId = 'attack' | 'defense' | 'speed' | 'willpower' | 'resistance';
```

Invalid stat names are rejected at pipeline validation time.

## Damage pipeline

```
evaluateFormula (raw offense)
  → calculateOffense (+ attacker modifiers)
  → calculateMitigation (defender defense)
  → calculateFinalDamage (max 1)
```

Mitigation is **not** baked into offense — future systems (shields, armor break, pierce) plug into the mitigation stage.

## Healing pipeline

```
evaluateFormula
  → heal phase modifiers
  → final heal amount
```

## Status application

`resolveStatusApplication()` runs a full pipeline:

1. Immunity check (stub)
2. Calculate chance — `willpower` vs `resistance` from config (or per-status override)
3. RNG roll
4. Calculate duration — optional `durationFormula` + resistance reduction
5. `onBeforeApply` hooks
6. Apply `StatusInstance` with **source stat snapshots**
7. `onApply` hooks + events

### Source snapshots

When a status is applied, all combat stats from the source are frozen on the instance:

```typescript
sourceSnapshots?: Partial<Record<CombatStatId, number>>
```

DoT ticks use snapshots so damage stays consistent if the source dies or despawns.

## EffectContext

All formula helpers share one context:

```typescript
interface EffectContext {
  source: Combatant;
  target: Combatant;
  skill?: SkillDefinition;
  status?: StatusDefinition;
  statusInstance?: StatusInstance;
  battle: BattleState;
  registry: DefinitionRegistry;
  combatStats: CombatStatsConfig;
  rng: RandomSource;
}
```

## Formula modifiers (passives)

`FormulaModifierRegistry` dispatches hooks by phase (`offense`, `mitigation`, `final`, `heal`, `duration`, `application_chance`). Empty by default — passive traits register modifiers later without rewriting damage math.

## Schema versioning

Content files support `"schemaVersion": 2`. The pipeline migrates v1 content automatically:

| Legacy                          | Migrated                                                                     |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `multiplier: 1.4, flatBonus: 5` | `value: { base: 5, terms: [{ source: "stat", key: "attack", ratio: 1.4 }] }` |
| `damagePerStack: 5`             | `damagePerTurn: { base: 5, terms: [] }`                                      |
| `amountPerStack: 10`            | `value: { base: 10, terms: [] }`                                             |

## Example skills

### Fireball (attack scaling)

```json
{
  "type": "damage",
  "element": "fire",
  "value": {
    "base": 20,
    "terms": [{ "source": "stat", "key": "attack", "ratio": 1.2 }]
  }
}
```

### Shield Bash (tank — attack + defense)

```json
{
  "type": "damage",
  "element": "physical",
  "value": {
    "base": 10,
    "terms": [
      { "source": "stat", "key": "attack", "ratio": 0.6 },
      { "source": "stat", "key": "defense", "ratio": 0.8 }
    ]
  }
}
```

### Mend (willpower heal)

```json
{
  "type": "heal",
  "value": {
    "base": 15,
    "terms": [{ "source": "stat", "key": "willpower", "ratio": 1.4 }]
  }
}
```

## Example statuses

### Burn (scaled DoT)

```json
{
  "type": "dot",
  "element": "fire",
  "damagePerTurn": {
    "base": 5,
    "terms": [{ "source": "stat", "key": "attack", "ratio": 0.2 }]
  }
}
```

### Attack Up (willpower-scaled buff)

```json
{
  "type": "stat_mod",
  "stat": "attack",
  "mode": "percent",
  "value": {
    "base": 20,
    "terms": [{ "source": "stat", "key": "willpower", "ratio": 0.15 }]
  }
}
```

## AP is a resource

AP, SP, and HP are **not** combat stats. They do not appear in `combat_stats.json` or `CombatStatId`.

## Dawn Studio

- **FormulaEditor** — configure base + terms on skill effects and status behaviors
- **Combat Stats** page — edit `combat_stats.json` and global formula bindings

After saving content, run `pnpm content:codegen` (automatic in Dawn Studio).
