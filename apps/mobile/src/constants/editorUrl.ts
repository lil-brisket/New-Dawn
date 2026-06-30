import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { env } from '@/config/env';

const DEFAULT_PORT = 5174;

/** Dawn Studio dev server URL — override with EXPO_PUBLIC_EDITOR_URL. */
export function getEditorUrl(): string {
  if (env.EXPO_PUBLIC_EDITOR_URL) {
    return env.EXPO_PUBLIC_EDITOR_URL;
  }

  // Android emulator maps host machine localhost to 10.0.2.2
  if (Platform.OS === 'android' && !Constants.isDevice) {
    return `http://10.0.2.2:${DEFAULT_PORT}`;
  }

  return `http://localhost:${DEFAULT_PORT}`;
}

export const EDITOR_START_HINT = 'Run: pnpm --filter @dawn/editor dev';
