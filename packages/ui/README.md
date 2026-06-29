# @dawn/ui

Shared React Native design system and UI primitives for Dawn.

## Usage

```tsx
import { ThemeProvider, Button, Panel, useTheme } from '@dawn/ui';

function App() {
  const { theme, mode, setMode } = useTheme();
  return (
    <Panel>
      <Button title="Begin" onPress={...} />
    </Panel>
  );
}

<ThemeProvider>
  <App />
</ThemeProvider>
```

All components use theme tokens — never hardcode colors in app code.

See [THEME_CONTRACT.md](src/theme/THEME_CONTRACT.md) for allowed token files and design system rules.

## Tailwind sync

```bash
pnpm --filter @dawn/ui generate:tailwind
```

Regenerates `tailwind-theme.cjs` from token source.
