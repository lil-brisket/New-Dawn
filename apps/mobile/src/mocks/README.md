# Mocks

Centralized fake data for the application shell phase.

## Files

- `characters.ts`, `inventory.ts`, `battle.ts`, `guild.ts`, `shop.ts`

## Usage

Mock repositories in `src/services/api/` import from here. Screens should **not** import mocks directly — use repositories instead.

## Migration

When real APIs are connected, delete or replace mock data as repositories switch to network responses. Screens remain unchanged.
