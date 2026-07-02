# Stat Scaling

Dawn uses a data-driven **StatFormula** pipeline for skills, tags, and combat resolution. No skill-specific code paths — all scaling comes from content JSON.

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

## Tag application

Skills apply effects exclusively through `apply_tag`. `resolveTagApplication()` runs a full pipeline:

1. Immunity check (stub)
2. Calculate chance — `willpower` vs `resistance` from config (or per-tag override)
3. RNG roll
4. Calculate duration — optional `durationFormula` + resistance reduction
5. `onBeforeApply` hooks
6. Execute tag behaviors (instant) or apply `TagInstance` with **source stat snapshots** (persistent)
7. `onApply` hooks + events

### Source snapshots

When a persistent tag is applied, all combat stats from the source are frozen on the instance:

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
  tag?: TagDefinition;
  tagInstance?: TagInstance;
  battle: BattleState;
  registry: DefinitionRegistry;
  combatStats: CombatStatsConfig;
  rng: RandomSource;
}
```

## Formula modifiers (passives)

`FormulaModifierRegistry` dispatches hooks by phase (`offense`, `mitigation`, `final`, `heal`, `duration`, `application_chance`). Empty by default — passive traits register modifiers later without rewriting damage math.

## Schema versioning

Content files support `"schemaVersion": 3`. The pipeline migrates older content automatically:

| Legacy                          | Migrated                                                                     |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `multiplier: 1.4, flatBonus: 5` | `value: { base: 5, terms: [{ source: "stat", key: "attack", ratio: 1.4 }] }` |
| `damagePerStack: 5`             | `damagePerTurn: { base: 5, terms: [] }`                                      |
| `amountPerStack: 10`            | `value: { base: 10, terms: [] }`                                             |
| `type: "damage"` skill effect   | `apply_tag` → `tag_damage` with overrides                                    |
| `statuses/` content domain      | `tags/` with `tag_*` IDs                                                     |
| metadata `tags`                 | `labels`                                                                     |

## Example skills

### Fireball (attack scaling via tag override)

```json
{
  "type": "apply_tag",
  "tagId": "tag_damage",
  "chance": 1,
  "overrides": {
    "instant_damage": {
      "element": "fire",
      "value": {
        "base": 20,
        "terms": [{ "source": "stat", "key": "attack", "ratio": 1.2 }]
      }
    }
  }
}
```

### Shield Bash (tank — attack + defense)

```json
{
  "type": "apply_tag",
  "tagId": "tag_damage",
  "chance": 1,
  "overrides": {
    "instant_damage": {
      "element": "physical",
      "value": {
        "base": 10,
        "terms": [
          { "source": "stat", "key": "attack", "ratio": 0.6 },
          { "source": "stat", "key": "defense", "ratio": 0.8 }
        ]
      }
    }
  }
}
```

### Mend (willpower heal)

```json
{
  "type": "apply_tag",
  "tagId": "tag_instant_heal",
  "chance": 1,
  "overrides": {
    "instant_heal": {
      "value": {
        "base": 15,
        "terms": [{ "source": "stat", "key": "willpower", "ratio": 1.4 }]
      }
    }
  }
}
```

## Example tags

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

- **FormulaEditor** — configure base + terms on tag behaviors and skill tag overrides
- **Combat Stats** page — edit `combat_stats.json` and global formula bindings (`tagApplication`, `durationReduction`)

After saving content, run `pnpm content:codegen` (automatic in Dawn Studio).
