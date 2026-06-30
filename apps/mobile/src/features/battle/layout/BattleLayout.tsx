import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import type { BattleTheme } from '../theme/BattleTheme';

export interface BattleLayoutProps {
  battleTheme: BattleTheme;
  background?: ReactNode;
  header: ReactNode;
  grid: ReactNode;
  log: ReactNode;
  actionBar: ReactNode;
  debug?: ReactNode;
  overlays?: ReactNode;
}

export function BattleLayout({
  battleTheme,
  background,
  header,
  grid,
  log,
  actionBar,
  debug,
  overlays,
}: BattleLayoutProps) {
  return (
    <View style={styles.root}>
      {background}
      <View style={styles.main}>
        <View
          style={[
            styles.header,
            battleTheme.platform.key === 'web'
              ? styles.headerWeb
              : { minHeight: battleTheme.headerHeight },
            battleTheme.platform.key === 'web' && { minHeight: battleTheme.headerHeight },
          ]}
        >
          {header}
        </View>
        <View style={[styles.grid, battleTheme.platform.key === 'web' && styles.gridWeb]}>
          {grid}
        </View>
        <View style={[styles.log, { height: battleTheme.logHeight }]}>{log}</View>
        <View style={[styles.actionBar, { minHeight: battleTheme.actionBarHeight }]}>
          {actionBar}
        </View>
      </View>
      {debug ? <View style={styles.debugFooter}>{debug}</View> : null}
      {overlays ? <View style={styles.overlays}>{overlays}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  main: { flex: 1, minHeight: 0 },
  header: { flexShrink: 0 },
  headerWeb: { overflow: 'hidden' },
  grid: { flex: 1, flexShrink: 1, minHeight: 0 },
  gridWeb: { overflow: 'visible' },
  log: { flexShrink: 0 },
  actionBar: { flexShrink: 0, width: '100%' },
  debugFooter: { flexShrink: 0, width: '100%' },
  overlays: { ...StyleSheet.absoluteFillObject, pointerEvents: 'box-none' },
});
