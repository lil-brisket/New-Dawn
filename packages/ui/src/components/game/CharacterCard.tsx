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
  const { colors, radius, spacing, typography } = useTheme();

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
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.row}>
        <Avatar initials={name} size="lg" rarity={rarity} />
        <View style={styles.info}>
          <Text
            style={{
              color: colors.textPrimary,
              fontWeight: typography.fontWeight.bold,
              fontSize: typography.fontSize.lg,
            }}
          >
            {name}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: typography.fontSize.sm }}>
            Lv. {level}
          </Text>
        </View>
      </View>
      <View style={{ marginTop: spacing.sm }}>
        <HealthBar value={hp} max={maxHp} height={6} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {},
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  info: { flex: 1 },
});

export const CharacterCard = memo(CharacterCardComponent);
