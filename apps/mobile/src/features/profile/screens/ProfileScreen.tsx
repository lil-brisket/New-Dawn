import { Text, View } from 'react-native';
import { Button, Card, Avatar, useTheme } from '@dawn/ui';
import { usePlayerStore } from '@/stores/playerStore';
import { MainLayout } from '@/layouts/MainLayout';
import { ComingSoonPanel } from '@/components/ComingSoonPanel';
import { NavigationService } from '@/navigation/NavigationService';
import { ROUTES } from '@/navigation/routes';

export function ProfileScreen() {
  const { colors, spacing, typography } = useTheme();
  const displayName = usePlayerStore((s) => s.displayName);

  return (
    <MainLayout title="Profile">
      <Card>
        <Avatar label={displayName} size="xl" />
        <Text
          style={{
            color: colors.text,
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
            marginTop: spacing.md,
          }}
          maxFontSizeMultiplier={1.5}
        >
          {displayName}
        </Text>
        <Text style={{ color: colors.textSecondary }} maxFontSizeMultiplier={1.5}>
          Adventurer
        </Text>
      </Card>
      <ComingSoonPanel
        title="Profile"
        icon="profile"
        description="Stats, achievements, and customization coming soon."
      />
      <View style={{ marginTop: spacing.lg }}>
        <Button
          title="Settings"
          variant="secondary"
          onPress={() => NavigationService.navigate(ROUTES.SETTINGS)}
          accessibilityLabel="Open settings"
        />
      </View>
    </MainLayout>
  );
}
