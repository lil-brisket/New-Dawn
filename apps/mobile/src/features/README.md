# Features

Feature modules organized by domain. Each feature contains screens, hooks, and presentation components.

## Dependency Rule

```
feature → services → @dawn/* packages
```

**Never:** `feature A → feature B`

Use services, stores, or shared packages to share data across features. ESLint enforces this via `no-restricted-imports` on `@/features/*/**` paths.

## Structure

```
features/
  home/
    screens/
  battle/
    screens/
    presentation/
```

Prefer relative imports within a feature (e.g. `../presentation/BattleHeader`).
