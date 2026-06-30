import { Modal, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SkillCard, useTheme } from '@dawn/ui';
import { defaultRegistry } from '@dawn/game-core';
import type { Combatant } from '@dawn/types';
import { getSkillAoeLabel } from '../utils/skillDisplay';

export interface SkillPickerModalProps {
  visible: boolean;
  combatant: Combatant | null;
  onSelect: (skillId: string) => void;
  onClose: () => void;
}

export function SkillPickerModal({ visible, combatant, onSelect, onClose }: SkillPickerModalProps) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  const skills = (combatant?.skillIds ?? [])
    .map((id) => defaultRegistry.getSkill(id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surface, padding: spacing.md }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={{ color: colors.text, fontWeight: '700', marginBottom: spacing.sm }}>
            Select Skill
          </Text>
          <ScrollView horizontal contentContainerStyle={{ gap: spacing.sm }}>
            {skills.map((skill) => {
              const cd = combatant?.skillCooldowns[skill.id];
              const onCd = cd !== undefined && cd > 0;
              const noSp = (combatant?.sp ?? 0) < skill.mpCost;
              const disabled = onCd || noSp;
              return (
                <Pressable
                  key={skill.id}
                  disabled={disabled}
                  onPress={() => {
                    if (skill.targeting.type === 'self') {
                      onSelect(skill.id);
                      onClose();
                      return;
                    }
                    onSelect(skill.id);
                    onClose();
                  }}
                  style={{ opacity: disabled ? 0.45 : 1 }}
                >
                  <SkillCard
                    name={onCd ? `${skill.name} (${cd})` : skill.name}
                    mpCost={skill.mpCost}
                    cooldown={skill.cooldown}
                    aoeLabel={getSkillAoeLabel(skill)}
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '40%',
  },
});
