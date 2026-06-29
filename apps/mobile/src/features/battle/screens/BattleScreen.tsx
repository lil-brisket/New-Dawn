import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { useTheme, Panel, Button, TopBar } from '@dawn/ui';
import { ScreenLayout } from '@/layouts/ScreenLayout';
import { GRID_CONSTANTS } from '@dawn/game-core';

const HEX_SIZE = 18;

function hexPoints(cx: number, cy: number, size: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    points.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
  }
  return points.join(' ');
}

function HexGridPreview() {
  const { colors } = useTheme();
  const size = GRID_CONSTANTS.SIZE;
  const hexWidth = HEX_SIZE * 2;
  const hexHeight = HEX_SIZE * Math.sqrt(3);

  const cells = [];
  for (let r = 0; r < size; r++) {
    for (let q = 0; q < size; q++) {
      const cx = q * hexWidth * 0.75 + HEX_SIZE + 8;
      const cy = r * hexHeight + (q % 2) * (hexHeight / 2) + HEX_SIZE + 8;
      cells.push(
        <Polygon
          key={`${q}-${r}`}
          points={hexPoints(cx, cy, HEX_SIZE - 1)}
          fill={colors.surface}
          stroke={colors.border}
          strokeWidth={1}
        />,
      );
    }
  }

  return (
    <Svg width={size * hexWidth * 0.75 + HEX_SIZE * 2} height={size * hexHeight + HEX_SIZE * 2}>
      {cells}
    </Svg>
  );
}

export function BattleScreen() {
  const { colors, spacing } = useTheme();

  return (
    <ScreenLayout>
      <TopBar title="Battle" />
      <View style={[styles.container, { padding: spacing.lg }]}>
        <Panel variant="elevated">
          <Text style={[styles.label, { color: colors.textSecondary }]}>9×9 Hex Grid</Text>
          <View style={styles.gridWrap}>
            <HexGridPreview />
          </View>
        </Panel>
        <View style={styles.actions}>
          <Button title="Attack" onPress={() => {}} />
          <Button title="End Turn" variant="secondary" onPress={() => {}} />
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: { marginBottom: 12, textAlign: 'center' },
  gridWrap: { alignItems: 'center' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
});
