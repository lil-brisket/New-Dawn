import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import { defaultRegistry } from '@dawn/game-core';
import type { Combatant } from '@dawn/types';
import { BattleSubActionBar } from './BattleSubActionBar';
import { MAX_SUB_ACTION_SLOTS } from '../utils/battleActionLimits';
import { getSkillAoeLabel } from '../utils/skillDisplay';
import { useBattleTheme } from '../theme/BattleTheme';

export interface SkillPickerBarProps {
  combatant: Combatant | null;
  selectedSkillId?: string | null;
  onSelect: (skillId: string) => void;
  onBack: () => void;
}

export function SkillPickerBar({
  combatant,
  selectedSkillId,
  onSelect,
  onBack,
}: SkillPickerBarProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography, radius, border } = theme;
  const { platform } = useBattleTheme();
  const slotWidth = platform.key === 'web' ? 96 : 88;

  const skills = (combatant?.skillIds ?? [])
    .map((id) => defaultRegistry.getSkill(id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined)
    .slice(0, MAX_SUB_ACTION_SLOTS);

  return (
    <BattleSubActionBar onBack={onBack}>
      {skills.map((skill) => {
        const cd = combatant?.skillCooldowns[skill.id];
        const onCd = cd !== undefined && cd > 0;
        const noSp = (combatant?.sp ?? 0) < skill.spCost;
        const noAp = (combatant?.ap ?? 0) < skill.apCost;
        const noHp = skill.hpCost > 0 && (combatant?.hp ?? 0) - skill.hpCost < 1;
        const disabled = onCd || noSp || noAp || noHp;
        const aoeLabel = getSkillAoeLabel(skill);
        const selected = selectedSkillId === skill.id;

        return (
          <Pressable
            key={skill.id}
            disabled={disabled}
            onPress={() => onSelect(skill.id)}
            style={({ pressed }) => [
              styles.slot,
              { width: slotWidth, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 },
            ]}
            accessibilityLabel={skill.name}
            accessibilityState={{ selected }}
          >
            <View
              style={[
                styles.card,
                {
                  backgroundColor: selected ? colors.primaryDark : colors.surfacePressed,
                  borderColor: selected ? colors.gold : colors.border,
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
                {onCd ? `${skill.name} (${cd})` : skill.name}
              </Text>
              <Text
                style={{
                  color: colors.mana,
                  fontSize: typography.fontSize.xs,
                  textAlign: 'center',
                  marginTop: 2,
                }}
              >
                {[
                  skill.spCost > 0 ? `SP ${skill.spCost}` : null,
                  skill.apCost > 0 ? `AP ${skill.apCost}` : null,
                  skill.hpCost > 0 ? `HP ${skill.hpCost}` : null,
                ]
                  .filter(Boolean)
                  .join(' · ') || 'Free'}
              </Text>
              {skill.cooldown > 0 ? (
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: typography.fontSize.xs,
                    textAlign: 'center',
                  }}
                >
                  CD {skill.cooldown}
                </Text>
              ) : null}
              {aoeLabel ? (
                <Text
                  style={{
                    color: colors.warning,
                    fontSize: typography.fontSize.xs,
                    textAlign: 'center',
                  }}
                >
                  {aoeLabel}
                </Text>
              ) : null}
            </View>
          </Pressable>
        );
      })}
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
});
