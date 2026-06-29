import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export interface TopBarProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  testID?: string;
}

function TopBarComponent({ title, onBack, rightAction, testID }: TopBarProps) {
  const { colors, sizes } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          height: sizes.topBar,
          backgroundColor: colors.backgroundElevated,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.back}>
          <Text style={{ color: colors.accent, fontSize: 16 }}>{'<'}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.back} />
      )}
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>{rightAction}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  back: { width: 40, alignItems: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700' },
  right: { width: 40, alignItems: 'flex-end' },
});

export const TopBar = memo(TopBarComponent);
