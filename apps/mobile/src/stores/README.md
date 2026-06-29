# Stores

Zustand stores for client-side state.

## Shell Stores

- `authStore` — authentication token and session
- `playerStore` — player display data
- `settingsStore` — user preferences
- `uiStore` — loading overlay and modal state
- `notificationStore` — toast and notification queue

## Rules

- Shell stores contain no gameplay business logic
- Persist auth/settings/player via MMKV where needed
- UI side effects (overlays, toasts) read from stores in provider hosts
