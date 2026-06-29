import { Text } from 'react-native';
import { Card, useTheme } from '@dawn/ui';
import { MainLayout } from '@/layouts/MainLayout';

export function QuestsScreen() {
  const { colors } = useTheme();

  return (
    <MainLayout title="Quests">
      <Card title="Main Story" subtitle="Chapter 1 — The Awakening">
        <Text style={{ color: colors.textMuted, marginTop: 8 }}>Story quests — coming soon.</Text>
      </Card>
    </MainLayout>
  );
}
