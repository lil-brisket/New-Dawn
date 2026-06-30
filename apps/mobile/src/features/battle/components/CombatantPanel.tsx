import { View, Text, StyleSheet } from 'react-native';
import { Avatar, HealthBar, ManaBar, useTheme, type AvatarSize } from '@dawn/ui';
import type { BattleTheme } from '../theme/BattleTheme';
import { getCombatantAvatarLabel, type TeamDisplay } from '../utils/battleDisplay';
import { StatusEffectList } from './StatusEffectList';

export interface CombatantPanelProps {
  team: TeamDisplay;
  alignment: 'left' | 'right';
  battleTheme: BattleTheme;
  isActiveTurn?: boolean;
}

export function CombatantPanel({
  team,
  alignment,
  battleTheme,
  isActiveTurn = false,
}: CombatantPanelProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography, radius, border, shadow } = theme;
  const isLeft = alignment === 'left';
  const rep = team.representative;
  const isWeb = battleTheme.platform.key === 'web';
  const cardPadding = isWeb ? spacing.md : spacing.sm;
  const barHeight = isWeb ? theme.game.battle.healthBarHeightLg : theme.game.battle.healthBarHeight;

  if (!rep) {
    return (
      <View
        style={[styles.card, styles.flex, { borderColor: colors.border, borderRadius: radius.lg }]}
      >
        <Text style={{ color: colors.textMuted, fontSize: typography.fontSize.xs }}>—</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        isWeb ? styles.webCard : styles.flex,
        isWeb && battleTheme.panelMaxWidth != null && { maxWidth: battleTheme.panelMaxWidth },
        !isWeb && battleTheme.panelMaxWidth != null && { maxWidth: battleTheme.panelMaxWidth },
        {
          backgroundColor: colors.surface,
          borderColor: isActiveTurn ? colors.warning : colors.border,
          borderWidth: isActiveTurn ? border.normal : border.thin,
          borderRadius: radius.lg,
          padding: cardPadding,
          gap: isWeb ? spacing.sm : spacing.xs,
          minWidth: 0,
          overflow: 'hidden',
          ...shadow.sm,
        },
      ]}
    >
      <View style={[styles.row, isLeft ? styles.rowLeft : styles.rowRight]}>
        <PortraitCard
          name={rep.name}
          teamLabel={team.label}
          portraitSize={battleTheme.portraitSize}
          alignment={alignment}
          isWeb={isWeb}
        />
        {team.rosterCount > 1 ? (
          <View
            style={[
              styles.rosterBadge,
              { backgroundColor: colors.surfacePressed, borderRadius: radius.pill },
            ]}
          >
            <Text style={{ color: colors.textMuted, fontSize: typography.fontSize.xs }}>
              ×{team.rosterCount}
            </Text>
          </View>
        ) : null}
      </View>
      <Text
        style={{
          color: colors.textMuted,
          fontSize: isWeb ? typography.fontSize.sm : typography.fontSize.xs,
          textAlign: isLeft ? 'left' : 'right',
        }}
      >
        Lv. {rep.level}
      </Text>
      <HealthBar value={rep.hp} max={rep.maxHp} animated height={barHeight} />
      <ManaBar value={rep.sp} max={rep.maxSp} animated height={barHeight} />
      <View
        style={[
          styles.statusSlot,
          {
            minHeight: battleTheme.statusSlotHeight,
            borderRadius: radius.sm,
            borderColor: colors.border,
            backgroundColor: colors.surfacePressed,
            paddingHorizontal: spacing.xs,
            paddingVertical: spacing[2],
          },
        ]}
      >
        {rep.statusEffects.length > 0 ? (
          <StatusEffectList effects={rep.statusEffects} alignment={alignment} />
        ) : (
          <Text
            style={{
              color: colors.textMuted,
              fontSize: typography.fontSize.xs,
              textAlign: isLeft ? 'left' : 'right',
              opacity: 0.6,
            }}
          >
            Status
          </Text>
        )}
      </View>
    </View>
  );
}

function portraitToAvatarSize(size: number): AvatarSize {
  if (size <= 32) return 'sm';
  if (size <= 48) return 'md';
  return 'lg';
}

function PortraitCard({
  name,
  teamLabel,
  portraitSize,
  alignment,
  isWeb = false,
}: {
  name: string;
  teamLabel: string;
  portraitSize: number;
  alignment: 'left' | 'right';
  isWeb?: boolean;
}) {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const initials = getCombatantAvatarLabel(name);
  const avatarSize = portraitToAvatarSize(portraitSize);

  return (
    <View
      style={[
        styles.row,
        alignment === 'right' && styles.rowRight,
        { gap: spacing.sm, flex: 1, minWidth: 0 },
      ]}
    >
      {alignment === 'left' ? (
        <>
          <Avatar label={initials} size={avatarSize} />
          <View style={styles.nameBlock}>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: isWeb ? typography.fontSize.sm : typography.fontSize.xs,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              {teamLabel}
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: isWeb ? typography.fontSize.md : typography.fontSize.sm,
                fontWeight: typography.fontWeight.bold,
              }}
              numberOfLines={1}
            >
              {name}
            </Text>
          </View>
        </>
      ) : (
        <>
          <View style={[styles.nameBlock, styles.nameBlockRight]}>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: isWeb ? typography.fontSize.sm : typography.fontSize.xs,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              {teamLabel}
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: isWeb ? typography.fontSize.md : typography.fontSize.sm,
                fontWeight: typography.fontWeight.bold,
              }}
              numberOfLines={1}
            >
              {name}
            </Text>
          </View>
          <Avatar label={initials} size={avatarSize} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  webCard: { flex: 1, minWidth: 0 },
  card: {},
  row: { flexDirection: 'row', alignItems: 'center' },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },
  rosterBadge: { paddingHorizontal: 6, paddingVertical: 2 },
  statusSlot: { borderWidth: 1, borderStyle: 'dashed', justifyContent: 'center' },
  nameBlock: { flex: 1, minWidth: 0 },
  nameBlockRight: { alignItems: 'flex-end' },
});
