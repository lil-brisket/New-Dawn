import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import type { TagDisplayItem } from '../utils/battleDisplay';

export interface TagEffectListProps {
  effects: readonly TagDisplayItem[];
  alignment?: 'left' | 'right';
}

/** @deprecated Use TagEffectList */
export type StatusEffectListProps = TagEffectListProps;

function formatTurnLabel(turns: number): string {
  return turns === 1 ? '1 turn' : `${turns} turns`;
}

export function TagEffectList({ effects, alignment = 'left' }: TagEffectListProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography, radius, border } = theme;

  if (effects.length === 0) return null;

  return (
    <View style={[styles.wrap, alignment === 'right' && styles.wrapRight, { gap: spacing.xs }]}>
      {effects.map((effect) => (
        <View
          key={effect.id}
          accessibilityLabel={`${effect.name}, ${formatTurnLabel(effect.remainingTurns)}${
            effect.stacks > 1 ? `, ${effect.stacks} stacks` : ''
          }`}
          style={[
            styles.chip,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: border.thin,
              borderRadius: radius.sm,
              paddingHorizontal: spacing.xs,
              paddingVertical: spacing[2],
            },
          ]}
        >
          <View style={styles.iconTile}>
            <Text
              style={[
                styles.icon,
                { fontSize: typography.fontSize.lg, lineHeight: typography.fontSize.lg },
              ]}
            >
              {effect.icon}
            </Text>
            <View
              style={[
                styles.durationBadge,
                {
                  backgroundColor: colors.primaryDark,
                  borderRadius: radius.pill,
                  minWidth: 16,
                  paddingHorizontal: 3,
                },
              ]}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 10,
                  fontWeight: typography.fontWeight.bold,
                  textAlign: 'center',
                }}
              >
                {effect.remainingTurns}
              </Text>
            </View>
            {effect.stacks > 1 ? (
              <View
                style={[
                  styles.stackBadge,
                  {
                    backgroundColor: colors.warning,
                    borderRadius: radius.pill,
                    minWidth: 14,
                    paddingHorizontal: 2,
                  },
                ]}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 9,
                    fontWeight: typography.fontWeight.bold,
                    textAlign: 'center',
                  }}
                >
                  x{effect.stacks}
                </Text>
              </View>
            ) : null}
          </View>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 10,
              textAlign: 'center',
              marginTop: 2,
            }}
            numberOfLines={1}
          >
            {effect.name}
          </Text>
        </View>
      ))}
    </View>
  );
}

/** @deprecated Use TagEffectList */
export const StatusEffectList = TagEffectList;

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },
  wrapRight: { justifyContent: 'flex-end' },
  chip: { alignItems: 'center', minWidth: 40 },
  iconTile: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 28,
    minHeight: 28,
  },
  icon: { textAlign: 'center', includeFontPadding: false },
  durationBadge: {
    position: 'absolute',
    right: -6,
    bottom: -4,
  },
  stackBadge: {
    position: 'absolute',
    left: -6,
    top: -4,
  },
});
