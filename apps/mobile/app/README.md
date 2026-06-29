# App Routes

Expo Router file-based routes live here. Each file should be a thin re-export of a screen from `src/features/`.

## Structure

- `_layout.tsx` — root Stack with providers
- `index.tsx` — splash and auth redirect
- `(auth)/` — login stack
- `(main)/` — tab navigator and feature screens
- `battle/[id].tsx` — full-screen battle modal
- `+not-found.tsx` — 404 handler

## Rules

- No business logic in route files
- No styling in route files
- Import screens from `@/features/*/screens/*`
