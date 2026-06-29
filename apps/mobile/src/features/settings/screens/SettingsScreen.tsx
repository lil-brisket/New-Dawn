import { View, Text, Pressable } from 'react-native';
import { Card, Button, useTheme, type ThemePreference } from '@dawn/ui';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAuthStore } from '@/stores/authStore';
import { MainLayout } from '@/layouts/MainLayout';
import { NavigationService } from '@/navigation/NavigationService';
import { ROUTES } from '@/navigation/routes';
import { FeatureFlags } from '@/constants/FeatureFlags';

const APPEARANCE_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function SettingsScreen() {
  const { theme, mode, setMode } = useTheme();
  const { colors, spacing, typography, radius } = theme;
  const musicVolume = useSettingsStore((s) => s.musicVolume);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    NavigationService.replace(ROUTES.LOGIN);
  };

  return (
    <MainLayout title="Settings">
      <Card title="Appearance">
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          {APPEARANCE_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setMode(option.value)}
              accessibilityRole="button"
              accessibilityLabel={`${option.label} theme`}
              accessibilityState={{ selected: mode === option.value }}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: radius.md,
                backgroundColor: mode === option.value ? colors.primary : colors.surfacePressed,
              }}
            >
              <Text style={{ color: colors.text, fontSize: typography.fontSize.sm }}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>
      <Card title="Audio" style={{ marginTop: spacing.lg }}>
        <Text style={{ color: colors.textMuted, fontSize: typography.fontSize.sm }}>
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
