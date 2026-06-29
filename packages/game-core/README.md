# @dawn/game-core

UI-agnostic ECS-lite battle and world engine for Dawn.

## Architecture

- **Mutable state** inside `BattleEngine`; use `getSnapshot()` for React
- **Commands** in, **events** out
- **Systems** each handle one concern; add tests alongside

## Adding a System

1. Implement `System` interface in `battle/Systems/`
2. Register in `BattleEngine` systems array
3. Add `*.test.ts` with at least one test

## Banned imports

No `Date.now()`, `Math.random()`, `fetch`, React, or React Native.
