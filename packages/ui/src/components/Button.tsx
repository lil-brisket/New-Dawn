import React, { memo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  testID?: string;
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
    primary: { bg: colors.primary, text: colors.text },
    secondary: { bg: colors.surface, text: colors.text },
    ghost: { bg: 'transparent', text: colors.primaryLight },
    danger: { bg: colors.error, text: colors.text },
  }[variant];

  const height = sizes.button[size];

  return (
    <TouchableOpacity
      testID={testID}
      disabled={disabled || loading}
      style={[
        styles.base,
        {
          backgroundColor: variantStyles.bg,
          height,
          borderRadius: radius.md,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      activeOpacity={0.8}
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
    </TouchableOpacity>
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
