import type { ReactNode } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@dawn/ui';
import { ActionButton } from './ActionButton';
import { useBattleTheme } from '../theme/BattleTheme';

export interface BattleSubActionBarProps {
  onBack: () => void;
  children: ReactNode;
}

export function BattleSubActionBar({ onBack, children }: BattleSubActionBarProps) {
  const { theme } = useTheme();
  const { spacing } = theme;
  const { platform } = useBattleTheme();
  const isNative = platform.key === 'native';
  const pad =
    platform.actionBarPadding === 'tight'
      ? spacing[2]
      : platform.actionBarPadding === 'wide'
        ? spacing.lg
        : spacing.sm;

  return (
    <View
      style={[
        styles.row,
        {
          paddingHorizontal: pad,
          paddingVertical: spacing.xs,
          gap: isNative ? spacing[2] : spacing.sm,
          backgroundColor: theme.game.battle.command.background,
          borderTopWidth: theme.border.thin,
          borderTopColor: theme.game.battle.command.border,
        },
      ]}
    >
      <View style={platform.key === 'web' ? styles.backCell : styles.nativeBackCell}>
        <ActionButton
          icon="←"
          label="Back"
          commandStyle="neutral"
          onPress={onBack}
          fillParent
          accessibilityLabel="Back to actions"
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={Platform.OS === 'web'}
        style={styles.slotsScroll}
        contentContainerStyle={[styles.slotsRow, { gap: isNative ? spacing[2] : spacing.sm }]}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    width: '100%',
    minHeight: 68,
    maxWidth: '100%',
  },
  backCell: { width: 72, flexShrink: 0, alignSelf: 'stretch' },
  nativeBackCell: { width: 64, flexShrink: 0, alignSelf: 'stretch' },
  slotsScroll: { flex: 1, minWidth: 0 },
  slotsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 68,
  },
});
