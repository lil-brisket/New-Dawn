import React, { memo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
import type {
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
  CardVariant,
} from './Card.types';

function CardRoot({ variant = 'default', title, children, style, testID, ...props }: CardProps) {
  const { components, radius, spacing } = useTheme();
  const tokens = components.card[variant];

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: tokens.bg,
          borderRadius: radius.lg,
          padding: spacing.lg,
          borderColor: tokens.border,
          borderWidth: tokens.borderWidth,
        },
        tokens.shadow,
        style,
      ]}
      {...props}
    >
      {title ? <Card.Header>{title}</Card.Header> : null}
      {children}
    </View>
  );
}

function CardHeader({ children, icon, testID }: CardHeaderProps) {
  const { colors, typography, spacing } = useTheme();

  return (
    <View testID={testID} style={[styles.header, { marginBottom: spacing.sm }]}>
      {icon ? <View style={styles.headerIcon}>{icon}</View> : null}
      {typeof children === 'string' ? (
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold,
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

function CardBody({ children, image, testID }: CardBodyProps) {
  const { spacing, radius } = useTheme();

  return (
    <View testID={testID}>
      {image ? (
        <Image
          source={image}
          style={[styles.image, { borderRadius: radius.md, marginBottom: spacing.md }]}
          resizeMode="cover"
        />
      ) : null}
      {children}
    </View>
  );
}

function CardFooter({ children, testID }: CardFooterProps) {
  const { spacing } = useTheme();

  return (
    <View testID={testID} style={[styles.footer, { marginTop: spacing.md }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerIcon: { marginRight: 4 },
  image: { width: '100%', height: 120 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

export const Card = Object.assign(memo(CardRoot), {
  Header: memo(CardHeader),
  Body: memo(CardBody),
  Footer: memo(CardFooter),
});

export type { CardProps, CardVariant, CardHeaderProps, CardBodyProps, CardFooterProps };
