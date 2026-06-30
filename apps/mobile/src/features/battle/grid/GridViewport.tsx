import type { ReactNode } from 'react';
import { View, StyleSheet, Platform, type LayoutChangeEvent } from 'react-native';

export interface GridViewportProps {
  svgWidth: number;
  svgHeight: number;
  onLayout?: (width: number, height: number) => void;
  children: ReactNode;
}

const WEB_GRID_INSET = 6;

/** Static viewport — no scroll, offset, or camera follow */
export function GridViewport({ svgWidth, svgHeight, onLayout, children }: GridViewportProps) {
  const isWeb = Platform.OS === 'web';
  const inset = isWeb ? WEB_GRID_INSET : 0;

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    onLayout?.(width, height);
  };

  return (
    <View style={[styles.fill, isWeb && styles.fillWeb]} onLayout={handleLayout}>
      <View style={[styles.content, isWeb && styles.contentWeb, isWeb && { padding: inset }]}>
        <View style={{ width: svgWidth, height: svgHeight }}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  fillWeb: { overflow: 'visible' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWeb: { overflow: 'visible' },
});
