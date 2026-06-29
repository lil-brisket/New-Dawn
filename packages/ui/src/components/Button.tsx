import React, { memo } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

function ButtonComponent({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  style,
  testID,
  ...props
}: ButtonProps) {
  const { colors, sizes, radius, typography } = useTheme();

  const variantStyles = {
    primary: { bg: colors.primary, text: colors.text, border: colors.primary, borderWidth: 0 },
    secondary: {
      bg: colors.surfaceLight,
      text: colors.text,
      border: colors.border,
      borderWidth: 1,
    },
    ghost: { bg: 'transparent', text: colors.primaryLight, border: 'transparent', borderWidth: 0 },
    danger: { bg: colors.error, text: colors.text, border: colors.error, borderWidth: 0 },
  }[variant];

  const height = sizes.button[size];

  return (
    <Pressable
      testID={testID}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: variantStyles.bg,
          height,
          borderRadius: radius.md,
          borderColor: variantStyles.border,
          borderWidth: variantStyles.borderWidth,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text} />
      ) : (
        <Text
          style={{
            color: variantStyles.text,
            fontSize: size === 'sm' ? typography.fontSize.sm : typography.fontSize.md,
            fontWeight: typography.fontWeight.semibold,
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export const Button = memo(ButtonComponent);
