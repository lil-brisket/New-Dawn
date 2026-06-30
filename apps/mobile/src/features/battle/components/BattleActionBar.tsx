import { View, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import type { BattleCommandState } from '../state/BattleCommandState';
import type { CommandContext } from '../state/commandHelpers';
import { BATTLE_COMMANDS, type BattleCommandHandlers } from '../commands/battleCommands';
import { ActionButton } from './ActionButton';
import { useBattleTheme } from '../theme/BattleTheme';

export interface BattleActionBarProps {
  commandState: BattleCommandState;
  commandContext: CommandContext;
  handlers: BattleCommandHandlers;
  commands?: typeof BATTLE_COMMANDS;
}

export function BattleActionBar({
  commandState,
  commandContext,
  handlers,
  commands = BATTLE_COMMANDS,
}: BattleActionBarProps) {
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
      {commands.map((command) => (
        <View
          key={command.type}
          style={platform.key === 'web' ? styles.webCell : styles.nativeCell}
        >
          <ActionButton
            icon={command.icon}
            label={command.label}
            commandStyle={command.style}
            selected={command.selected(commandState, command.type)}
            disabled={!command.enabled(commandContext)}
            onPress={handlers[command.type]}
            fillParent
          />
        </View>
      ))}
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
  webCell: { flex: 1, flexBasis: 0, minWidth: 0, width: 0, alignSelf: 'stretch' },
  nativeCell: { flex: 1, flexBasis: 0, minWidth: 0, alignSelf: 'stretch' },
});
