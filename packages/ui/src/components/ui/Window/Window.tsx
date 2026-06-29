import React, { memo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
import { Panel } from '../Panel';
import type {
  WindowProps,
  WindowHeaderProps,
  WindowBodyProps,
  WindowFooterProps,
} from './Window.types';

function WindowRoot({ children, title, icon, testID, style }: WindowProps) {
  const hasConvenience = title || icon;

  if (hasConvenience && !children) {
    return (
      <Panel
        testID={testID}
        variant="elevated"
        borderStyle="default"
        style={[styles.container, style]}
      >
        <Window.Header title={title} icon={icon} />
      </Panel>
    );
  }

  if (hasConvenience && React.Children.count(children) === 0) {
    return null;
  }

  return (
    <Panel
      testID={testID}
      variant="elevated"
      borderStyle="default"
      style={[styles.container, style]}
    >
      {hasConvenience ? <Window.Header title={title} icon={icon} /> : null}
      {children}
    </Panel>
  );
}

function WindowHeader({ title, icon, children, testID }: WindowHeaderProps) {
  const { theme } = useTheme();
  const { colors, typography, spacing, border } = theme;

  if (children) {
    return (
      <View
        testID={testID}
        style={[
          styles.header,
          {
            borderBottomColor: colors.border,
            borderBottomWidth: border.thin,
            paddingBottom: spacing.md,
            gap: spacing.sm,
          },
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View
      testID={testID}
      style={[
        styles.header,
        {
          borderBottomColor: colors.border,
          borderBottomWidth: border.thin,
          paddingBottom: spacing.md,
          gap: spacing.sm,
        },
      ]}
    >
      {icon ? <View style={{ marginRight: spacing.xs }}>{icon}</View> : null}
      {title ? (
        <Text
          style={{
            color: colors.gold,
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
          }}
        >
          {title}
        </Text>
      ) : null}
    </View>
  );
}

function WindowBody({ children, scrollable = false, testID, ...scrollProps }: WindowBodyProps) {
  const { theme } = useTheme();
  const { spacing } = theme;

  if (scrollable) {
    return (
      <ScrollView
        testID={testID}
        style={{ maxHeight: 320 }}
        contentContainerStyle={{ paddingTop: spacing.md }}
        {...scrollProps}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View testID={testID} style={{ paddingTop: spacing.md }}>
      {children}
    </View>
  );
}

function WindowFooter({ children, testID }: WindowFooterProps) {
  const { theme } = useTheme();
  const { spacing, colors, border } = theme;

  return (
    <View
      testID={testID}
      style={[
        styles.footer,
        {
          marginTop: spacing.md,
          borderTopColor: colors.border,
          borderTopWidth: border.thin,
          paddingTop: spacing.md,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minWidth: 280 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {},
});

export const Window = Object.assign(memo(WindowRoot), {
  Header: memo(WindowHeader),
  Body: memo(WindowBody),
  Footer: memo(WindowFooter),
});

export type { WindowProps, WindowHeaderProps, WindowBodyProps, WindowFooterProps };
