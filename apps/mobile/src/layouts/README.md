# Layouts

Reusable screen shells. Screens should stay thin and delegate layout to these components.

## Layouts

- `ScreenLayout` — safe area + background
- `MainLayout` — ScreenLayout + TopBar + content padding
- `AuthLayout` — centered auth content on gradient background
- `BattleLayout` — battle column shell (header / viewport / bottom)

## Rules

- Use theme tokens only — no hardcoded colors or spacing
- Layouts must not import from `@/features/`
