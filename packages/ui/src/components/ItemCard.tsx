import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import type { ItemRarity } from '@dawn/types';

export interface ItemCardProps {
  name: string;
  rarity: ItemRarity;
  quantity?: number;
  testID?: string;
}

function ItemCardComponent({ name, rarity, quantity, testID }: ItemCardProps) {
  const { colors, radius, spacing } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.sm,
          borderColor: colors.rarity[rarity],
          borderWidth: 1,
        },
      ]}
    >
      <Text style={{ color: colors.text, fontSize: 13 }} numberOfLines={1}>
        {name}
      </Text>
      {quantity !== undefined ? (
        <Text style={{ color: colors.textMuted, fontSize: 11 }}>x{quantity}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { minWidth: 80 },
});

export const ItemCard = memo(ItemCardComponent);
