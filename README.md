# Dawn

Production-grade tactical fantasy RPG built with React Native, Expo, and a UI-agnostic ECS-lite game engine.

## Prerequisites

- Node.js 20+
- pnpm 10+
- **Expo Go (iOS App Store)** — project targets **Expo SDK 54** (last SDK widely available on physical iOS devices via Expo Go)

## Setup

```bash
pnpm install
```

## Commands

```bash
pnpm dev          # Start mobile app (Expo)
pnpm test         # Run Vitest (game-core, utils)
pnpm typecheck    # TypeScript across packages
pnpm lint         # ESLint across packages
```

## Monorepo Structure

```
apps/mobile/          Expo React Native app
packages/
  game-core/          ECS-lite battle engine (no RN)
  game-data/          Static definitions (skills, items, enemies)
  types/              Shared TypeScript interfaces
  utils/              Clock, RNG, hex math
  ui/                 Design system + components
  config/             ESLint, Prettier, TS configs
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for design decisions.
