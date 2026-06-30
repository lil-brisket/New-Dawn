import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export interface SkillCardProps {
  name: string;
  mpCost: number;
  cooldown: number;
  aoeLabel?: string;
  selected?: boolean;
  testID?: string;
}

function SkillCardComponent({
  name,
  mpCost,
  cooldown,
  aoeLabel,
  selected,
  testID,
}: SkillCardProps) {
  const { theme } = useTheme();
  const { colors, radius, spacing, typography, border } = theme;

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: selected ? colors.primaryDark : colors.surfacePressed,
          borderRadius: radius.md,
          padding: spacing.md,
          borderColor: selected ? colors.gold : colors.border,
          borderWidth: border.thin,
          minWidth: 100,
        },
      ]}
    >
      <Text style={{ color: colors.text, fontWeight: typography.fontWeight.semibold }}>{name}</Text>
      <Text style={{ color: colors.mana, fontSize: typography.fontSize.xs, marginTop: spacing.xs }}>
        MP {mpCost}
      </Text>
      {cooldown > 0 ? (
        <Text style={{ color: colors.textMuted, fontSize: typography.fontSize.xs }}>
          CD {cooldown}
        </Text>
      ) : null}
      {aoeLabel ? (
        <Text style={{ color: colors.warning, fontSize: typography.fontSize.xs }}>{aoeLabel}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {},
});

export const SkillCard = memo(SkillCardComponent);
