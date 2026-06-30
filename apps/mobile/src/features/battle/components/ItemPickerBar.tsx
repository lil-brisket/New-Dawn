import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import type { ItemRarity } from '@dawn/types';
import { BattleSubActionBar } from './BattleSubActionBar';
import { MAX_SUB_ACTION_SLOTS } from '../utils/battleActionLimits';
import { useBattleTheme } from '../theme/BattleTheme';

export interface BattleItemOption {
  id: string;
  name: string;
  quantity?: number;
  rarity: ItemRarity;
}

export interface ItemPickerBarProps {
  items: readonly BattleItemOption[];
  onSelect: (itemId: string) => void;
  onBack: () => void;
}

export function ItemPickerBar({ items, onSelect, onBack }: ItemPickerBarProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography, radius, border } = theme;
  const { platform } = useBattleTheme();
  const slotWidth = platform.key === 'web' ? 96 : 88;
  const visibleItems = items.slice(0, MAX_SUB_ACTION_SLOTS);

  return (
    <BattleSubActionBar onBack={onBack}>
      {visibleItems.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: colors.textMuted, fontSize: typography.fontSize.sm }}>
            No items
          </Text>
        </View>
      ) : (
        visibleItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item.id)}
            style={({ pressed }) => [
              styles.slot,
              { width: slotWidth, opacity: pressed ? 0.85 : 1 },
            ]}
            accessibilityLabel={item.name}
          >
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.surfacePressed,
                  borderColor: colors.rarity[item.rarity],
                  borderWidth: border.thin,
                  borderRadius: radius.lg,
                  paddingVertical: spacing[2],
                  paddingHorizontal: spacing.xs,
                },
              ]}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.bold,
                  textAlign: 'center',
                }}
                numberOfLines={2}
              >
                {item.name}
              </Text>
              {item.quantity !== undefined ? (
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: typography.fontSize.xs,
                    textAlign: 'center',
                    marginTop: 2,
                  }}
                >
                  x{item.quantity}
                </Text>
              ) : null}
            </View>
          </Pressable>
        ))
      )}
    </BattleSubActionBar>
  );
}

const styles = StyleSheet.create({
  slot: { alignSelf: 'stretch' },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    paddingHorizontal: 12,
  },
});
