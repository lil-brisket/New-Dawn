import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Button, useTheme } from '@dawn/ui';
import { MainLayout } from '@/layouts/MainLayout';
import { NavigationService } from '@/navigation/NavigationService';
import { ROUTES } from '@/navigation/routes';
import { FeatureFlags } from '@/constants/FeatureFlags';
import { env } from '@/config/env';
import { storage } from '@/services/storage';
import { useAuthStore } from '@/stores/authStore';
import { authRepository } from '@/services/api/auth';
import { Redirect } from 'expo-router';

export function DeveloperScreen() {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  if (!FeatureFlags.developerTools) {
    return <Redirect href={ROUTES.HOME} />;
  }

  const clearStorage = () => {
    storage.clearAll();
  };

  const resetApp = () => {
    storage.clearAll();
    logout();
    NavigationService.replace(ROUTES.LOGIN);
  };

  const mockLogin = async () => {
    const { token } = await authRepository.login('dev@dawn.game', 'dev');
    login(token);
    NavigationService.replace(ROUTES.HOME);
  };

  return (
    <MainLayout title="Developer">
      <ScrollView contentContainerStyle={{ gap: spacing.md }}>
        <Text style={{ color: colors.textSecondary, fontSize: typography.fontSize.sm }}>
          Version: {Constants.expoConfig?.version ?? '0.0.0'}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: typography.fontSize.sm }}>
          Environment: {env.EXPO_PUBLIC_ENVIRONMENT}
        </Text>

        <View style={styles.section}>
          <Text style={{ color: colors.text, fontWeight: typography.fontWeight.bold }}>
            Feature Flags
          </Text>
          {Object.entries(FeatureFlags).map(([key, value]) => (
            <Text key={key} style={{ color: colors.textMuted, fontSize: typography.fontSize.sm }}>
              {key}: {String(value)}
            </Text>
          ))}
        </View>

        <Button
          title="Dawn Studio"
          onPress={() => NavigationService.navigate(ROUTES.DEVELOPER_DAWN_STUDIO)}
          accessibilityLabel="Open Dawn Studio content editor"
        />
        <Button
          title="Battle Sandbox"
          onPress={() => NavigationService.navigate(ROUTES.DEVELOPER_BATTLE_SANDBOX)}
          accessibilityLabel="Open battle sandbox"
        />
        <Button
          title="Component Playground"
          onPress={() => NavigationService.navigate(ROUTES.DEVELOPER_COMPONENT_PLAYGROUND)}
          accessibilityLabel="Open component playground"
        />
        <Button
          title="UI Showcase (legacy)"
          variant="secondary"
          onPress={() => NavigationService.navigate(ROUTES.DEVELOPER_UI_SHOWCASE)}
          accessibilityLabel="Open UI showcase"
        />
        <Button
          title="Theme Preview"
          variant="secondary"
          onPress={() => NavigationService.navigate(ROUTES.DEVELOPER_THEME_PREVIEW)}
          accessibilityLabel="Open theme preview"
        />
        <Button
          title="Mock Login"
          variant="secondary"
          onPress={mockLogin}
          accessibilityLabel="Mock login"
        />
        <Button
          title="Clear Storage"
          variant="ghost"
          onPress={clearStorage}
          accessibilityLabel="Clear storage"
        />
        <Button
          title="Reset App"
          variant="danger"
          onPress={resetApp}
          accessibilityLabel="Reset app"
        />
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  section: { gap: 4 },
});
