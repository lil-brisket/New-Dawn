# Asset Pipeline

```
raw/         Source art and audio (gitignored in production)
optimized/   Compressed runtime assets
generated/   Atlas manifests from scripts/
```

Run pipeline scripts from repo root (stubs):

```bash
npx tsx scripts/optimize-images.ts
npx tsx scripts/sprite-atlas.ts
npx tsx scripts/compress-audio.ts
```
