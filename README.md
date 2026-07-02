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
pnpm dev          # Start game (Expo) + Dawn Studio editor (Turbo)
pnpm test         # Run Vitest (game-core, utils)
pnpm typecheck    # TypeScript across packages
pnpm lint         # ESLint across packages
pnpm content:codegen   # Regenerate game-data from content/*.json
```

## Run the game

`pnpm dev` starts **two** dev servers:

| URL                       | What it is                             |
| ------------------------- | -------------------------------------- |
| **http://localhost:8081** | **The game** — Expo mobile app (Metro) |
| **http://localhost:5174** | **Dawn Studio** — content editor only  |

If you open port **5174**, you are in the editor, not the game.

### Browser (easiest on desktop)

1. Run `pnpm dev` (or game-only: `pnpm --filter @dawn/mobile dev`)
2. Open **http://localhost:8081**
3. In the Expo terminal, press **`w`** to open the web build

Or start web directly:

```bash
pnpm --filter @dawn/mobile web
```

### Phone

1. Install **Expo Go** (SDK 54) on your device
2. Scan the QR code shown in the `@dawn/mobile` terminal output

### Game-only dev (skip the editor)

```bash
pnpm --filter @dawn/mobile dev
```

### Developer menu (in-game tools)

Once you reach the Home screen in a dev build:

- **Web** — click **Welcome, Adventurer**
- **Mobile** — long-press **Welcome, Adventurer**

Or use **Settings → Developer Menu**. From there you can open Battle Sandbox, UI Showcase, and Dawn Studio (the same editor at port 5174).

## Dawn Studio (content editor)

Dawn Studio is a **local dev tool** for editing game content (skills, tags, enemies). It is **not bundled in production** — it reads/writes JSON under `content/` and runs codegen into `@dawn/game-data`.

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
content/              Game content JSON (skills, tags, enemies, …)
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
