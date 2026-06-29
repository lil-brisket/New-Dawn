# Services

External integrations and cross-cutting infrastructure.

## Structure

- `api/` — repository interfaces and mock implementations
- `analytics/` — Analytics interface (NoOp default)
- `logger/` — Logger (use instead of console)
- `storage/` — MMKV persistence adapter

## Dependency Rule

```
feature → services → @dawn/* packages
```

Screens and features call repositories, never `fetch` directly.

## Swapping Mocks

Replace mock repository classes with real API implementations. Repository interfaces stay stable.
