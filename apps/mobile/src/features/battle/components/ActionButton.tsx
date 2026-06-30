import { Pressable, Text, View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@dawn/ui';
import type { CommandStyle } from '../commands/battleCommands';

export interface ActionButtonProps {
  icon: string;
  label: string;
  commandStyle: CommandStyle;
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  fillParent?: boolean;
}

export function ActionButton({
  icon,
  label,
  commandStyle,
  selected = false,
  disabled = false,
  onPress,
  accessibilityLabel,
  fillParent = false,
}: ActionButtonProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography, radius, border, shadow, opacity } = theme;
  const commandTokens = theme.game.battle.command;
  const accent = commandTokens[commandStyle];
  const isWeb = Platform.OS === 'web';
  const borderColor = disabled ? commandTokens.disabled : selected ? accent : commandTokens.border;
  const backgroundColor = disabled
    ? colors.surfaceDisabled
    : selected
      ? accent + '33'
      : commandTokens.background;
  const textColor = disabled ? commandTokens.disabled : colors.text;
  const stretchFill = fillParent && isWeb;
  const iconSize = isWeb ? typography.fontSize['2xl'] : typography.fontSize.xl;
  const labelSize = isWeb ? typography.fontSize.sm : typography.fontSize.xs;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        fillParent ? styles.fillParent : styles.flex,
        stretchFill && styles.fillParentWeb,
        { opacity: pressed && !disabled ? opacity.pressed : 1 },
      ]}
    >
      <View
        style={[
          styles.button,
          stretchFill && styles.buttonWeb,
          {
            backgroundColor,
            borderColor,
            borderWidth: border.normal,
            borderRadius: radius.lg,
            paddingVertical: isWeb ? spacing.sm : spacing[2],
            paddingHorizontal: spacing.xs,
            ...(selected && !disabled ? shadow.glow : shadow.sm),
          },
        ]}
      >
        <View style={[styles.iconSlot, isWeb && styles.iconSlotWeb]}>
          <Text
            style={[
              styles.icon,
              {
                fontSize: iconSize,
                lineHeight: iconSize * 1.15,
              },
            ]}
          >
            {icon}
          </Text>
        </View>
        <Text
          style={[
            styles.label,
            {
              color: textColor,
              fontSize: labelSize,
              fontWeight: typography.fontWeight.bold,
              lineHeight: labelSize * 1.2,
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, flexBasis: 0, minWidth: 0 },
  fillParent: { flex: 1, width: '100%', minWidth: 0 },
  fillParentWeb: { alignSelf: 'stretch' },
  button: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    gap: 4,
  },
  buttonWeb: {
    width: '100%',
    alignSelf: 'stretch',
    minHeight: '100%',
  },
  iconSlot: {
    flex: 1,
    width: '100%',
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSlotWeb: {
    minHeight: 32,
  },
  icon: { textAlign: 'center' },
  label: { textAlign: 'center', width: '100%' },
});
