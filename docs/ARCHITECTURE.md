# Dawn Architecture

## Two-App Split

| Package              | Role                                                  |
| -------------------- | ----------------------------------------------------- |
| `apps/mobile`        | UI, networking, persistence, animation queue          |
| `packages/game-core` | Battle/world logic — runs in RN, Node, Edge Functions |
| `packages/game-data` | Static content definitions                            |
| `packages/types`     | Shared interfaces                                     |
| `packages/ui`        | Design system                                         |

## ECS-Lite Battle Engine

`BattleEngine` orchestrates **Systems** that mutate `BattleState`:

```
submitCommand → CommandValidator → Systems → EventBus + BattleLog
```

Systems: `TurnSystem`, `MovementSystem`, `AttackSystem`, `SkillSystem`, `StatusSystem`, `DeathSystem`, `VictorySystem`

## Commands & Events

- **Input**: `MoveCommand`, `AttackCommand`, `SkillCommand`, `EndTurnCommand`
- **Output**: `PlayerMoved`, `DamageTaken`, `SkillUsed`, `EnemyDied`, etc.
- UI subscribes to events — never polls engine internals

## Mutable State + Snapshots

Engine mutates state in-place for performance. React reads `getSnapshot()` copies only.

## Definition vs Player Data

| Static (`game-data`)  | Instance (`playerStore`)  |
| --------------------- | ------------------------- |
| `CharacterDefinition` | `PlayerCharacter`         |
| `SkillDefinition`     | learned skills, cooldowns |
| `EquipmentDefinition` | equipped gear             |

## Presentation Pipeline

```
game-core → EventBus → AnimationQueue → Reanimated (mobile only)
```

Never import Reanimated in `game-core`.

## Server Portability

Inject `Clock` and `RandomSource`. Banned in engine: `Date.now()`, `Math.random()`, `fetch`.

## Swapping Backend

Replace mock repositories in `apps/mobile/src/services/api/` with Supabase implementations. UI and stores stay unchanged.

## Adding a System

1. Create `packages/game-core/src/battle/Systems/MySystem.ts`
2. Implement `System` interface
3. Register in `BattleEngine`
4. Add `MySystem.test.ts`
