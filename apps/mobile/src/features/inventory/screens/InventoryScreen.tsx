import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useTheme } from '@dawn/ui';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';
import { inventoryRepository } from '@/services/api/inventory';

export function InventoryScreen() {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;
  const [items, setItems] = useState<{ id: string; name: string; quantity: number }[]>([]);

  useEffect(() => {
    inventoryRepository.getInventory().then(({ items: data }) => setItems(data));
  }, []);

  return (
    <PlaceholderScreen
      title="Bag"
      icon="inventory"
      description="Manage items, equipment, and consumables."
    >
      {items.map((item) => (
        <Text
          key={item.id}
          style={{
            color: colors.textMuted,
            fontSize: typography.fontSize.sm,
            marginTop: spacing.xs,
          }}
        >
          {item.name} x{item.quantity}
        </Text>
      ))}
    </PlaceholderScreen>
  );
}
