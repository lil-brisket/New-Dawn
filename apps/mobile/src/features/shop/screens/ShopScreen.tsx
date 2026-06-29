import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useTheme } from '@dawn/ui';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';
import { shopRepository } from '@/services/api/shop';

export function ShopScreen() {
  const { colors, spacing, typography } = useTheme();
  const [items, setItems] = useState<
    { id: string; name: string; price: number; currency: string }[]
  >([]);

  useEffect(() => {
    shopRepository.getItems().then(setItems);
  }, []);

  return (
    <PlaceholderScreen
      title="Shop"
      icon="shop"
      description="Purchase equipment, consumables, and summon tickets."
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
          {item.name} — {item.price} {item.currency}
        </Text>
      ))}
    </PlaceholderScreen>
  );
}
