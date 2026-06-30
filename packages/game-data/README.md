# @dawn/game-data

Static game content definitions loaded from repo-root `content/` JSON via the content pipeline.

## Workflow

1. Edit JSON in `content/` (or use Dawn Studio at `tools/editor`)
2. Run `pnpm content:codegen` (auto-runs before `game-data` typecheck)
3. Generated output lands in `src/generated/`

## Adding content

1. Add a JSON file under `content/{domain}/**/` (e.g. `content/skills/magic/skill_my_skill.json`)
2. Run `pnpm content:codegen`
3. `DefinitionRegistry` picks it up automatically

Characters, items, equipment, and other domains still live as TypeScript until migrated.
