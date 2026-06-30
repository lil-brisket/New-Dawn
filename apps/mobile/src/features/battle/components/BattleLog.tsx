import { useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import type { BattleLogCard } from '../events/BattleUIEvent';
import type { BattleViewMode } from '../state/BattleUIState';
import { useBattleTheme } from '../theme/BattleTheme';

export interface BattleLogProps {
  entries: BattleLogCard[];
  viewMode?: BattleViewMode;
}

function LogLine({ item, showTimestamp }: { item: BattleLogCard; showTimestamp: boolean }) {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;
  const accentColor =
    colors[item.color as keyof typeof colors] ?? colors[item.color as 'primary'] ?? colors.text;

  return (
    <View
      style={[
        styles.line,
        {
          borderLeftColor: accentColor as string,
          paddingVertical: spacing[2],
          paddingHorizontal: spacing.xs,
          marginBottom: spacing[2],
        },
      ]}
    >
      <Text
        style={{
          color: colors.text,
          fontSize: typography.fontSize.xs,
          lineHeight: typography.fontSize.xs * 1.35,
        }}
        numberOfLines={2}
      >
        <Text style={{ color: colors.textMuted, fontWeight: typography.fontWeight.semibold }}>
          R{item.round}{' '}
        </Text>
        <Text style={{ fontWeight: typography.fontWeight.semibold }}>{item.title}</Text>
        {' — '}
        <Text style={{ color: colors.textSecondary }}>{item.description}</Text>
        {showTimestamp ? (
          <Text style={{ color: colors.textMuted }}>
            {' '}
            · {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        ) : null}
      </Text>
    </View>
  );
}

export function BattleLog({ entries, viewMode = 'play' }: BattleLogProps) {
  const { theme } = useTheme();
  const battleTheme = useBattleTheme();
  const { colors, spacing, typography, border, radius } = theme;
  const listRef = useRef<FlatList<BattleLogCard>>(null);
  const showTimestamp = viewMode !== 'play';
  const chronological = [...entries].sort((a, b) => a.timestamp - b.timestamp);

  useEffect(() => {
    if (chronological.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [chronological.length]);

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.surfacePressed,
          borderColor: colors.border,
          borderWidth: border.thin,
          borderRadius: radius.md,
          paddingHorizontal: spacing.xs,
          paddingTop: spacing.xs,
          paddingBottom: spacing[2],
          marginHorizontal: battleTheme.platform.key === 'web' ? spacing.lg : spacing.xs,
        },
      ]}
    >
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.semibold,
          marginBottom: spacing[2],
          paddingHorizontal: spacing.xs,
        }}
      >
        Battle Log
      </Text>
      <FlatList
        ref={listRef}
        data={chronological}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LogLine item={item} showTimestamp={showTimestamp} />}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  list: { flex: 1 },
  line: { borderLeftWidth: 2 },
});
