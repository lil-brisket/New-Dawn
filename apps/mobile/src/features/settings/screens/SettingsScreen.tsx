import { View, Text, Pressable } from 'react-native';
import { Card, Button, useTheme } from '@dawn/ui';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAuthStore } from '@/stores/authStore';
import { MainLayout } from '@/layouts/MainLayout';
import { NavigationService } from '@/navigation/NavigationService';
import { ROUTES } from '@/navigation/routes';
import { FeatureFlags } from '@/constants/FeatureFlags';

export function SettingsScreen() {
  const { colors, spacing, typography } = useTheme();
  const musicVolume = useSettingsStore((s) => s.musicVolume);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    NavigationService.replace(ROUTES.LOGIN);
  };

  return (
    <MainLayout title="Settings">
      <Card title="Audio">
        <Text style={{ color: colors.textSecondary, fontSize: typography.fontSize.sm }}>
          Music: {Math.round(musicVolume * 100)}%
        </Text>
      </Card>
      <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
        <Button
          title="Log Out"
          variant="danger"
          onPress={handleLogout}
          accessibilityLabel="Log out"
        />
        {FeatureFlags.developerTools ? (
          <Pressable
            onPress={() => NavigationService.navigate(ROUTES.DEVELOPER)}
            accessibilityRole="button"
            accessibilityLabel="Open developer menu"
          >
            <Text
              style={{
                color: colors.textMuted,
                fontSize: typography.fontSize.sm,
                textAlign: 'center',
              }}
            >
              Developer Menu
            </Text>
          </Pressable>
        ) : null}
      </View>
    </MainLayout>
  );
}
