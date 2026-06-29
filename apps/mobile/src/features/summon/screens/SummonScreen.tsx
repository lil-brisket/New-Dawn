import { Text } from 'react-native';
import { Card, Button, useTheme } from '@dawn/ui';
import { MainLayout } from '@/layouts/MainLayout';

export function SummonScreen() {
  const { colors, spacing } = useTheme();

  return (
    <MainLayout title="Summon">
      <Card title="Hero Summon" subtitle="Gacha banner">
        <Text style={{ color: colors.textMuted, marginTop: spacing.sm }}>
          Rate-up banners and pity system — coming soon.
        </Text>
        <Button title="Summon x1" style={{ marginTop: spacing.lg }} onPress={() => {}} />
      </Card>
    </MainLayout>
  );
}
