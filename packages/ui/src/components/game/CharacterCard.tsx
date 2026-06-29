import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Avatar } from '../ui/Avatar';
import { HealthBar } from './HealthBar';
import type { ItemRarity } from '@dawn/types';

export interface CharacterCardProps {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  rarity: ItemRarity;
  testID?: string;
}

function CharacterCardComponent({ name, level, hp, maxHp, rarity, testID }: CharacterCardProps) {
  const { theme } = useTheme();
  const { colors, radius, spacing, typography, border, game } = theme;

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: colors.surfacePressed,
          borderRadius: radius.lg,
          padding: spacing.md,
          borderColor: colors.rarity[rarity],
          borderWidth: border.thin,
        },
      ]}
    >
      <View style={[styles.row, { gap: spacing.md }]}>
        <Avatar initials={name} size="lg" rarity={rarity} />
        <View style={styles.info}>
          <Text
            style={{
              color: colors.text,
              fontWeight: typography.fontWeight.bold,
              fontSize: typography.fontSize.lg,
            }}
          >
            {name}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: typography.fontSize.sm }}>
            Lv. {level}
          </Text>
        </View>
      </View>
      <View style={{ marginTop: spacing.sm }}>
        <HealthBar value={hp} max={maxHp} height={game.battle.healthBarHeight} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {},
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1 },
});

export const CharacterCard = memo(CharacterCardComponent);
