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
  const { colors, sizes, radius, components, typography } = useTheme();
  const dim = sizes.avatar[size];
  const resolvedInitials = (initials ?? label ?? '?').charAt(0).toUpperCase();
  const borderColor = rarity ? colors.rarity[rarity] : colors.accent;
  const tokens = components.avatar;

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
            backgroundColor: tokens.bg,
            borderColor,
            borderWidth: rarity ? 3 : 2,
          },
        ]}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={{ width: dim - 4, height: dim - 4, borderRadius: radius.circle }}
          />
        ) : (
          <Text
            style={{
              color: tokens.text,
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
              backgroundColor: online ? tokens.online : tokens.offline,
              borderColor: colors.surface,
              width: dim * 0.28,
              height: dim * 0.28,
              borderRadius: radius.circle,
            },
          ]}
        />
      ) : null}
      {statusBadge ? <View style={styles.badge}>{statusBadge}</View> : null}
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
    borderWidth: 2,
  },
  badge: { position: 'absolute', top: -4, right: -4 },
});

export const Avatar = memo(AvatarComponent);
export type { AvatarProps, AvatarSize, AvatarRarity } from './Avatar.types';
