# Dawn Theme Contract

This document defines the allowed design token files and rules for `@dawn/ui`.

## Rule

**No component or screen may introduce new design constants** unless they belong in an approved token file below.

If a constant appears in more than one place, or represents a design decision (not layout math), it belongs in a token file.

## Allowed token files (`theme/tokens/`)

| File            | Responsibility                                               |
| --------------- | ------------------------------------------------------------ |
| `colors.ts`     | Semantic palettes (light/dark)                               |
| `spacing.ts`    | 8pt spacing scale                                            |
| `typography.ts` | Fonts, sizes, weights, text styles                           |
| `radius.ts`     | Border radii                                                 |
| `sizes.ts`      | Component dimensions                                         |
| `icons.ts`      | Icon size scale                                              |
| `border.ts`     | Border widths                                                |
| `opacity.ts`    | Interaction/state opacities                                  |
| `layout.ts`     | Screen-level layout constants                                |
| `elevation.ts`  | Platform-agnostic elevation levels                           |
| `shadows.ts`    | Resolves elevation to RN shadow props                        |
| `animation.ts`  | Duration, easing, spring primitives                          |
| `zIndex.ts`     | Stacking order                                               |
| `game.ts`       | RPG domain tokens (battle, inventory, guild, world, effects) |

## Optional component tokens (`theme/components/`)

Only when a component's appearance cannot be expressed cleanly from primitives:

- `chip.ts` — shared badge/chip pattern
- `toast.ts` — toast variant accents
- `button.ts` — variant factory helpers (not part of Theme object)

## Deprecation policy

Compatibility shims at `theme/` root are tagged `@deprecated Remove after Phase 7`.

No new shims after Phase 4.

## Enforcement

- Visual catalog: `ThemePreviewScreen` in the mobile developer tools
- Future: ESLint rule to warn on hex literals and raw opacity numbers in component code
