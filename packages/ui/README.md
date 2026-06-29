# @dawn/ui

Shared React Native design system and UI primitives for Dawn.

## Usage

```tsx
import { ThemeProvider, Button, Panel, useTheme } from '@dawn/ui';

<ThemeProvider>
  <Panel>
    <Button title="Begin" onPress={...} />
  </Panel>
</ThemeProvider>
```

All components use theme tokens — never hardcode colors in app code.
