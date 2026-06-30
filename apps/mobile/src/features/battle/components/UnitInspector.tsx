import { View, Text, Modal, Pressable, StyleSheet, ScrollView } from 'react-native';
import type { Combatant } from '@dawn/types';
import { isCombatantAlive } from '@dawn/game-core';
import { useTheme } from '@dawn/ui';
import { formatCoord } from '../utils/hexLayout';

export interface UnitInspectorProps {
  combatant: Combatant | null;
  visible: boolean;
  onClose: () => void;
}

export function UnitInspector({ combatant, visible, onClose }: UnitInspectorProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  if (!combatant) return null;

  const rows: [string, string][] = [
    ['ID', combatant.id],
    ['Team', combatant.team],
    ['HP', `${combatant.hp}/${combatant.maxHp}`],
    ['SP', `${combatant.sp}/${combatant.maxSp}`],
    ['AP', `${combatant.ap}/${combatant.maxAp}`],
    ['Attack', String(combatant.attack)],
    ['Defense', String(combatant.defense)],
    ['Movement', String(combatant.movement)],
    ['Position', formatCoord(combatant.position)],
    ['Alive', String(isCombatantAlive(combatant))],
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View
          style={[
            styles.panel,
            { backgroundColor: colors.surface, borderColor: colors.border, padding: spacing.md },
          ]}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              marginBottom: spacing.sm,
            }}
          >
            {combatant.name}
          </Text>
          <ScrollView>
            {rows.map(([label, value]) => (
              <View key={label} style={styles.row}>
                <Text style={{ color: colors.textMuted, fontSize: typography.fontSize.sm }}>
                  {label}
                </Text>
                <Text style={{ color: colors.text, fontSize: typography.fontSize.sm }}>
                  {value}
                </Text>
              </View>
            ))}
          </ScrollView>
          <Pressable onPress={onClose} style={{ marginTop: spacing.md }}>
            <Text style={{ color: colors.primary, textAlign: 'center' }}>Close</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  panel: {
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: '80%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
});
