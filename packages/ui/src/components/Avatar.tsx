import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export interface AvatarProps {
  label: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  testID?: string;
}

function AvatarComponent({ label, size = 'md', testID }: AvatarProps) {
  const { colors, sizes, radius } = useTheme();
  const dim = sizes.avatar[size];

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          width: dim,
          height: dim,
          borderRadius: radius.full,
          backgroundColor: colors.primaryDark,
          borderColor: colors.accent,
          borderWidth: 2,
        },
      ]}
    >
      <Text style={{ color: colors.text, fontSize: dim * 0.35, fontWeight: '700' }}>
        {label.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
});

export const Avatar = memo(AvatarComponent);
