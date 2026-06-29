import { Text } from 'react-native';
import { Card, Avatar, useTheme } from '@dawn/ui';
import { usePlayerStore } from '@/stores/playerStore';
import { MainLayout } from '@/layouts/MainLayout';

export function ProfileScreen() {
  const { colors, spacing } = useTheme();
  const displayName = usePlayerStore((s) => s.displayName);

  return (
    <MainLayout title="Profile">
      <Card>
        <Avatar label={displayName} size="xl" />
        <Text
          style={{ color: colors.text, fontSize: 20, fontWeight: '700', marginTop: spacing.md }}
        >
          {displayName}
        </Text>
        <Text style={{ color: colors.textSecondary }}>Adventurer</Text>
      </Card>
    </MainLayout>
  );
}
