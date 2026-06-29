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
  const { colors, sizes, radius } = useTheme();

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      style={[
        styles.base,
        {
          width: sizes.inventorySlot,
          height: sizes.inventorySlot,
          borderRadius: radius.md,
          backgroundColor: empty ? colors.surfaceElevated : colors.surfacePressed,
          borderColor: selected ? colors.accent : colors.border,
          borderWidth: selected ? 2 : 1,
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
