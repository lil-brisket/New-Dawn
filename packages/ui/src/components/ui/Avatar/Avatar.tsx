import React, { memo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
import type { AvatarProps } from './Avatar.types';

function AvatarComponent({
  image,
  initials,
  label,
  size = 'md',
  rarity,
  online,
  statusBadge,
  testID,
  accessibilityLabel,
}: AvatarProps) {
  const { theme } = useTheme();
  const { colors, sizes, radius, typography, border, spacing } = theme;
  const dim = sizes.avatar[size];
  const resolvedInitials = (initials ?? label ?? '?').charAt(0).toUpperCase();
  const borderColor = rarity ? colors.rarity[rarity] : colors.gold;

  const imageSource = typeof image === 'string' ? { uri: image } : image;

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel ?? resolvedInitials}
      style={styles.wrapper}
    >
      <View
        style={[
          styles.base,
          {
            width: dim,
            height: dim,
            borderRadius: radius.circle,
            backgroundColor: colors.primaryDark,
            borderColor,
            borderWidth: rarity ? border.normal : border.thin,
          },
        ]}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={{
              width: dim - spacing.xs,
              height: dim - spacing.xs,
              borderRadius: radius.circle,
            }}
          />
        ) : (
          <Text
            style={{
              color: colors.text,
              fontSize: dim * 0.35,
              fontWeight: typography.fontWeight.bold,
            }}
          >
            {resolvedInitials}
          </Text>
        )}
      </View>
      {online !== undefined ? (
        <View
          style={[
            styles.online,
            {
              backgroundColor: online ? colors.success : colors.textMuted,
              borderColor: colors.surface,
              width: dim * 0.28,
              height: dim * 0.28,
              borderRadius: radius.circle,
              borderWidth: border.thin,
            },
          ]}
        />
      ) : null}
      {statusBadge ? (
        <View style={[styles.badge, { top: -spacing.xs, right: -spacing.xs }]}>{statusBadge}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignSelf: 'flex-start' },
  base: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  online: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  badge: { position: 'absolute' },
});

export const Avatar = memo(AvatarComponent);
export type { AvatarProps, AvatarSize, AvatarRarity } from './Avatar.types';
