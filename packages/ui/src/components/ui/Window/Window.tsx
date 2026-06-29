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
  const { colors, typography, spacing } = useTheme();

  if (children) {
    return (
      <View
        testID={testID}
        style={[styles.header, { borderBottomColor: colors.border, paddingBottom: spacing.md }]}
      >
        {children}
      </View>
    );
  }

  return (
    <View
      testID={testID}
      style={[styles.header, { borderBottomColor: colors.border, paddingBottom: spacing.md }]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      {title ? (
        <Text
          style={{
            color: colors.accent,
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
  const { spacing } = useTheme();

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
  const { spacing, colors } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.footer,
        { marginTop: spacing.md, borderTopColor: colors.border, paddingTop: spacing.md },
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
    borderBottomWidth: 1,
    gap: 8,
  },
  icon: { marginRight: 4 },
  footer: { borderTopWidth: 1 },
});

export const Window = Object.assign(memo(WindowRoot), {
  Header: memo(WindowHeader),
  Body: memo(WindowBody),
  Footer: memo(WindowFooter),
});

export type { WindowProps, WindowHeaderProps, WindowBodyProps, WindowFooterProps };
