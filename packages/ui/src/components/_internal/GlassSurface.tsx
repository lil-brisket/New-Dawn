import React, { memo, type ReactNode } from 'react';
import { View, StyleSheet, type ViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export interface GlassSurfaceProps extends ViewProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function GlassSurfaceComponent({ children, style, testID, ...props }: GlassSurfaceProps) {
  const { theme } = useTheme();
  const { colors, radius, spacing, border } = theme;

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: colors.surfaceGlass,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: spacing.lg,
          borderWidth: border.thin,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});

export const GlassSurface = memo(GlassSurfaceComponent);
