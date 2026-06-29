import React, { memo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export interface LoadingOverlayProps {
  visible: boolean;
  testID?: string;
}

function LoadingOverlayComponent({ visible, testID }: LoadingOverlayProps) {
  const { theme } = useTheme();
  const { colors, zIndex } = theme;

  if (!visible) return null;

  return (
    <View
      testID={testID}
      style={[styles.base, { backgroundColor: colors.overlay, zIndex: zIndex.overlay }]}
    >
      <ActivityIndicator size="large" color={colors.gold} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const LoadingOverlay = memo(LoadingOverlayComponent);
