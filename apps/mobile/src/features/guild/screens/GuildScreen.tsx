import { Text } from 'react-native';
import { Card, useTheme } from '@dawn/ui';
import { MainLayout } from '@/layouts/MainLayout';

export function GuildScreen() {
  const { colors } = useTheme();

  return (
    <MainLayout title="Guild">
      <Card title="No Guild" subtitle="Join or create a guild">
        <Text style={{ color: colors.textMuted, marginTop: 8 }}>
          Guild wars, raids, and shared rewards — coming soon.
        </Text>
      </Card>
    </MainLayout>
  );
}
