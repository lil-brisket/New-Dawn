import React, { memo, useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
import { createCardVariants } from '../../../theme/components/button';
import type {
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
  CardVariant,
} from './Card.types';

function CardRoot({ variant = 'default', title, children, style, testID, ...props }: CardProps) {
  const { theme } = useTheme();
  const { colors, radius, spacing, shadow } = theme;
  const cardVariants = useMemo(
    () => createCardVariants(colors, { sm: shadow.sm, md: shadow.md }),
    [colors, shadow],
  );
  const tokens = cardVariants[variant];

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
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;

  return (
    <View testID={testID} style={[styles.header, { marginBottom: spacing.sm, gap: spacing.sm }]}>
      {icon ? <View style={{ marginRight: spacing.xs }}>{icon}</View> : null}
      {typeof children === 'string' ? (
        <Text
          style={{
            color: colors.text,
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
  const { theme } = useTheme();
  const { spacing, radius, sizes } = theme;

  return (
    <View testID={testID}>
      {image ? (
        <Image
          source={image}
          style={[
            styles.image,
            { borderRadius: radius.md, marginBottom: spacing.md, height: sizes.cardMinHeight },
          ]}
          resizeMode="cover"
        />
      ) : null}
      {children}
    </View>
  );
}

function CardFooter({ children, testID }: CardFooterProps) {
  const { theme } = useTheme();
  const { spacing } = theme;

  return (
    <View testID={testID} style={[styles.footer, { marginTop: spacing.md, gap: spacing.sm }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center' },
  image: { width: '100%' },
  footer: { flexDirection: 'row', alignItems: 'center' },
});

export const Card = Object.assign(memo(CardRoot), {
  Header: memo(CardHeader),
  Body: memo(CardBody),
  Footer: memo(CardFooter),
});

export type { CardProps, CardVariant, CardHeaderProps, CardBodyProps, CardFooterProps };
