import { Pressable, View, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import { AppIcon } from './AppIcon';

export function NotificationBell() {
  const { colors, spacing } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Notifications"
      style={[styles.button, { padding: spacing.sm }]}
    >
      <AppIcon name="bell" size="md" color={colors.text} accessibilityLabel="Notifications" />
      <View style={[styles.badge, { backgroundColor: colors.error }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
