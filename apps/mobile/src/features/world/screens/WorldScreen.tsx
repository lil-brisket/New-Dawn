import { Text } from 'react-native';
import { Card, useTheme } from '@dawn/ui';
import { MainLayout } from '@/layouts/MainLayout';

export function WorldScreen() {
  const { colors } = useTheme();

  return (
    <MainLayout title="World">
      <Card title="Forest Clearing" subtitle="Top-down exploration — coming soon">
        <Text style={{ color: colors.textMuted, marginTop: 8 }}>
          Grid maps, NPCs, interactables, and fog of war will live here.
        </Text>
      </Card>
    </MainLayout>
  );
}
