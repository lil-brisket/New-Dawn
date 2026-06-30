# @dawn/mobile

Expo React Native app for Dawn.

**Expo SDK 54** · React Native 0.81 · React 19.1

Compatible with **Expo Go on iOS** (App Store build ships SDK 54). SDK 55+ requires a dev build or TestFlight on physical iOS devices.

## Run

```bash
pnpm dev
# or from repo root:
pnpm --filter @dawn/mobile dev
```

Scan the QR code with Expo Go on your iPhone. Ensure your Expo Go app is the SDK 54 version from the App Store.

## Developer Menu

Available only in development builds (`__DEV__`). Hidden from the tab bar.

**Open the developer menu**

1. **Home screen**
   - **Mobile** — long-press **Welcome, Adventurer** at the top of the Home tab.
   - **Web** — click **Welcome, Adventurer** (long-press is not supported in the browser).
2. **Settings** — Profile tab → **Settings** → **Developer Menu** at the bottom.

From the developer menu you can open **Dawn Studio** (content editor), **Battle Sandbox**, **Component Playground**, **UI Showcase**, **Theme Preview**, clear storage, mock login, and inspect feature flags.

### Dawn Studio (in-app)

Embeds the web editor at `/(main)/developer/dawn-studio`. Requires the editor dev server:

```bash
pnpm --filter @dawn/editor dev
```

See the root [README](../../README.md#dawn-studio-content-editor) for URLs per platform (`EXPO_PUBLIC_EDITOR_URL` on physical devices).

## Environment

Optional variables (validated via Zod in `src/config/env.ts`):

- `EXPO_PUBLIC_API_URL` — API base URL
- `EXPO_PUBLIC_EDITOR_URL` — Dawn Studio URL (default: localhost; Android emulator uses `10.0.2.2`)

## MMKV

Uses `react-native-mmkv` for Zustand persistence. May require a dev build (not Expo Go) for full MMKV support.

## Asset Pipeline

```
assets/raw/         Source assets (gitignored)
assets/optimized/   Runtime assets
assets/generated/   Atlas manifests from scripts/
```
