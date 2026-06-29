import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { Avatar } from './Avatar';
import { HealthBar } from './ProgressBar';
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
  const { colors, radius, spacing } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: spacing.md,
          borderColor: colors.rarity[rarity],
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.row}>
        <Avatar label={name} size="lg" />
        <View style={styles.info}>
          <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>{name}</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Lv. {level}</Text>
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
