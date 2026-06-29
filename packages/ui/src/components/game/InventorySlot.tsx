import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export interface InventorySlotProps {
  onPress?: () => void;
  selected?: boolean;
  empty?: boolean;
  children?: React.ReactNode;
  testID?: string;
}

function InventorySlotComponent({
  onPress,
  selected,
  empty,
  children,
  testID,
}: InventorySlotProps) {
  const { theme } = useTheme();
  const { colors, radius, border, game } = theme;

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      style={[
        styles.base,
        {
          width: game.inventory.slotSize,
          height: game.inventory.slotSize,
          borderRadius: radius.md,
          backgroundColor: empty ? colors.surfaceElevated : colors.surfacePressed,
          borderColor: selected ? colors.gold : colors.border,
          borderWidth: selected ? border.normal : border.thin,
        },
      ]}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
});

export const InventorySlot = memo(InventorySlotComponent);
