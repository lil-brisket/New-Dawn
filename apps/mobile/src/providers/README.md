# Providers

React context and global app wiring.

## Files

- `AppProviders.tsx` — composes QueryProvider, ThemeProvider, overlay hosts
- `QueryProvider.tsx` — React Query client
- `OverlayHosts.tsx` — LoadingOverlay and Toast connected to Zustand stores

## Order

GestureHandlerRootView and SafeAreaProvider wrap the tree in `app/_layout.tsx`. ErrorBoundary sits outside AppProviders.
