import React, { memo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export interface LoadingOverlayProps {
  visible: boolean;
  testID?: string;
}

function LoadingOverlayComponent({ visible, testID }: LoadingOverlayProps) {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <View testID={testID} style={[styles.base, { backgroundColor: colors.overlay }]}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
});

export const LoadingOverlay = memo(LoadingOverlayComponent);
