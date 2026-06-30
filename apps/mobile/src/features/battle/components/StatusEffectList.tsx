import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import type { StatusDisplayItem } from '../utils/battleDisplay';

export interface StatusEffectListProps {
  effects: readonly StatusDisplayItem[];
  alignment?: 'left' | 'right';
}

export function StatusEffectList({ effects, alignment = 'left' }: StatusEffectListProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography, radius } = theme;

  if (effects.length === 0) return null;

  return (
    <View style={[styles.wrap, alignment === 'right' && styles.wrapRight, { gap: spacing.xs }]}>
      {effects.map((effect) => (
        <View
          key={effect.id}
          style={[
            styles.chip,
            {
              backgroundColor: colors.surfacePressed,
              borderRadius: radius.sm,
              paddingHorizontal: spacing.xs,
              paddingVertical: 2,
            },
          ]}
        >
          <Text style={{ color: colors.textSecondary, fontSize: typography.fontSize.xs }}>
            {effect.icon} {effect.name} ({effect.remainingTurns})
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  wrapRight: { justifyContent: 'flex-end' },
  chip: {},
});
