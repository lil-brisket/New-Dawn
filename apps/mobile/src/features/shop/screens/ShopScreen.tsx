import { Text } from 'react-native';
import { Card, useTheme } from '@dawn/ui';
import { MainLayout } from '@/layouts/MainLayout';

export function ShopScreen() {
  const { colors } = useTheme();

  return (
    <MainLayout title="Shop">
      <Card title="General Store" subtitle="Equipment & consumables">
        <Text style={{ color: colors.textMuted, marginTop: 8 }}>Shop rotation — coming soon.</Text>
      </Card>
    </MainLayout>
  );
}
