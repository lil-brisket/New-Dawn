import { View, StyleSheet } from 'react-native';
import { Button, useTheme } from '@dawn/ui';

export function BattleCommandBar() {
  const { spacing } = useTheme();

  return (
    <View style={[styles.row, { gap: spacing.sm }]}>
      <View style={styles.button}>
        <Button title="Attack" onPress={() => {}} accessibilityLabel="Attack" />
      </View>
      <View style={styles.button}>
        <Button
          title="Skill"
          variant="secondary"
          onPress={() => {}}
          accessibilityLabel="Use skill"
        />
      </View>
      <View style={styles.button}>
        <Button title="Defend" variant="secondary" onPress={() => {}} accessibilityLabel="Defend" />
      </View>
      <View style={styles.button}>
        <Button title="End Turn" variant="ghost" onPress={() => {}} accessibilityLabel="End turn" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  button: { flex: 1, minWidth: '45%' },
});
