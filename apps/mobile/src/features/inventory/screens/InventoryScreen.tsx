import { View } from 'react-native';
import { InventorySlot, ItemCard, useTheme } from '@dawn/ui';
import { defaultRegistry } from '@dawn/game-data';
import { MainLayout } from '@/layouts/MainLayout';

export function InventoryScreen() {
  const { spacing } = useTheme();
  const potion = defaultRegistry.getItem('item_health_potion');

  return (
    <MainLayout title="Inventory">
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <InventorySlot key={i} empty={i > 0}>
            {i === 0 && potion ? (
              <ItemCard name={potion.name} rarity={potion.rarity} quantity={5} />
            ) : null}
          </InventorySlot>
        ))}
      </View>
    </MainLayout>
  );
}
