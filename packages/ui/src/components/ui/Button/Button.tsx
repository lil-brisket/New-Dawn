import React, { memo } from 'react';
import { Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useTheme } from '../../../theme';
import { getButtonVariants, buttonSizeStyles } from './Button.styles';
import { PressableScale } from '../../_internal/PressableScale';
import type { ButtonProps } from './Button.types';

function ButtonComponent({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  icon,
  leftIcon,
  rightIcon,
  style,
  testID,
  accessibilityLabel,
  accessibilityRole = 'button',
  ...props
}: ButtonProps) {
  const { theme } = useTheme();
  const { colors, sizes, radius, typography, spacing } = theme;
  const variants = getButtonVariants(colors);
  const variantStyle = variants[variant];
  const sizeStyle = buttonSizeStyles[size];
  const height = sizes.button[size];
  const isDisabled = disabled || loading;

  const leading = leftIcon ?? icon;
  const trailing = rightIcon;

  return (
    <PressableScale
      testID={testID}
      disabled={isDisabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        styles.base,
        {
          backgroundColor: variantStyle.bg,
          height,
          borderRadius: radius.md,
          borderColor: variantStyle.border,
          borderWidth: variantStyle.borderWidth,
          paddingHorizontal: sizeStyle.paddingH,
          opacity: isDisabled ? variantStyle.disabledOpacity : 1,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.text} />
      ) : (
        <View style={[styles.content, { gap: spacing.sm }]}>
          {leading ? <View style={styles.iconSlot}>{leading}</View> : null}
          <Text
            style={{
              color: variantStyle.text,
              fontSize: typography.fontSize[sizeStyle.fontSize],
              fontWeight: typography.fontWeight.semibold,
            }}
          >
            {title}
          </Text>
          {trailing ? <View style={styles.iconSlot}>{trailing}</View> : null}
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const Button = memo(ButtonComponent);
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button.types';
