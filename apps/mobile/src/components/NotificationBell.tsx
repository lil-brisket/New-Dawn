import { Pressable, View, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import { AppIcon } from './AppIcon';

export function NotificationBell() {
  const { theme } = useTheme();
  const { colors, spacing, radius, icons } = theme;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Notifications"
      style={[styles.button, { padding: spacing.sm }]}
    >
      <AppIcon name="bell" size="md" color={colors.text} accessibilityLabel="Notifications" />
      <View
        style={[
          styles.badge,
          {
            backgroundColor: colors.error,
            top: spacing.sm - 2,
            right: spacing.sm - 2,
            width: icons.xs,
            height: icons.xs,
            borderRadius: radius.xs,
          },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { position: 'relative' },
  badge: {
    position: 'absolute',
  },
});
