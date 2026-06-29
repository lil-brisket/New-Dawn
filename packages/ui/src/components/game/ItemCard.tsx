import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import type { ItemRarity } from '@dawn/types';

export interface ItemCardProps {
  name: string;
  rarity: ItemRarity;
  quantity?: number;
  testID?: string;
}

function ItemCardComponent({ name, rarity, quantity, testID }: ItemCardProps) {
  const { colors, radius, spacing, typography } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: colors.surfacePressed,
          borderRadius: radius.md,
          padding: spacing.sm,
          borderColor: colors.rarity[rarity],
          borderWidth: 1,
        },
      ]}
    >
      <Text
        style={{ color: colors.textPrimary, fontSize: typography.fontSize.sm }}
        numberOfLines={1}
      >
        {name}
      </Text>
      {quantity !== undefined ? (
        <Text style={{ color: colors.textMuted, fontSize: typography.fontSize.xs }}>
          x{quantity}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { minWidth: 80 },
});

export const ItemCard = memo(ItemCardComponent);
