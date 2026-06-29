import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export interface SkillCardProps {
  name: string;
  mpCost: number;
  cooldown: number;
  selected?: boolean;
  testID?: string;
}

function SkillCardComponent({ name, mpCost, cooldown, selected, testID }: SkillCardProps) {
  const { colors, radius, spacing, typography } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: selected ? colors.primaryDark : colors.surfacePressed,
          borderRadius: radius.md,
          padding: spacing.md,
          borderColor: selected ? colors.accent : colors.border,
          borderWidth: 1,
        },
      ]}
    >
      <Text style={{ color: colors.textPrimary, fontWeight: typography.fontWeight.semibold }}>
        {name}
      </Text>
      <Text style={{ color: colors.mana, fontSize: typography.fontSize.xs, marginTop: spacing[4] }}>
        MP {mpCost}
      </Text>
      {cooldown > 0 ? (
        <Text style={{ color: colors.textMuted, fontSize: typography.fontSize.xs }}>
          CD {cooldown}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { minWidth: 100 },
});

export const SkillCard = memo(SkillCardComponent);
