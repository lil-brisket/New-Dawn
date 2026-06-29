# @dawn/game-data

Static game content definitions. Will become one of the largest packages over time.

## Adding content

1. Create a definition file in the appropriate folder (e.g. `skills/my_skill.ts`)
2. Export from the folder's `index.ts`
3. Registry auto-loads via `createDefinitionRegistry()`

## Migration path

Start with TypeScript files. Later migrate to JSON with the same `DefinitionRegistry` loader API.
