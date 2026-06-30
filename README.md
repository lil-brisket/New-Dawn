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
pnpm content:codegen   # Regenerate game-data from content/*.json
```

## Dawn Studio (content editor)

Dawn Studio is a **local dev tool** for editing game content (skills, statuses, enemies). It is **not bundled in production** — it reads/writes JSON under `content/` and runs codegen into `@dawn/game-data`.

### Run the editor (browser)

```bash
pnpm --filter @dawn/editor dev
```

Open **http://localhost:5174**

### Open from the game (dev only)

In `__DEV__` builds:

1. Open **Developer Menu** (long-press “Welcome, Adventurer” on Home, or Settings → Developer Menu)
2. Tap **Dawn Studio**

The app embeds the editor in a WebView/iframe. **The editor dev server must be running** on your machine.

```bash
# Terminal 1 — editor
pnpm --filter @dawn/editor dev

# Terminal 2 — mobile
pnpm --filter @dawn/mobile dev
```

### Editor URL by platform

| Platform            | Default URL             |
| ------------------- | ----------------------- |
| Web / iOS simulator | `http://localhost:5174` |
| Android emulator    | `http://10.0.2.2:5174`  |
| Physical device     | Your PC’s LAN IP        |

Override with `.env` in `apps/mobile/`:

```env
EXPO_PUBLIC_EDITOR_URL=http://192.168.x.x:5174
```

### Content workflow

```
Edit in Dawn Studio → Save → content:codegen → game loads via DefinitionRegistry
```

- **Source of truth:** `content/**/*.json` (designer-friendly; defaults filled by pipeline)
- **Pipeline:** `packages/content-pipeline` (validate → normalize → inheritance)
- **Generated:** `packages/game-data/src/generated/` (do not edit by hand)

After editing JSON manually or in the editor:

```bash
pnpm content:codegen
```

Codegen also runs automatically when saving from the editor and before `game-data` typecheck.

## Monorepo Structure

```
apps/mobile/          Expo React Native app
content/              Game content JSON (skills, statuses, enemies, …)
tools/editor/         Dawn Studio — local Vite CMS
packages/
  content-pipeline/   Validate, normalize, inherit content JSON
  game-core/          ECS-lite battle engine (no RN)
  game-data/          Definitions loaded from generated content
  types/              Shared TypeScript interfaces
  utils/              Clock, RNG, hex math
  ui/                 Design system + components
  config/             ESLint, Prettier, TS configs
assets/               Icons, VFX, audio (referenced by content IDs)
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for design decisions.
