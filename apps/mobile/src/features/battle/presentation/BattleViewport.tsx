import { View, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { useTheme } from '@dawn/ui';

const DEFAULT_GRID_SIZE = 9;

function hexPoints(cx: number, cy: number, size: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    points.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
  }
  return points.join(' ');
}

export function BattleViewport() {
  const { theme } = useTheme();
  const { colors, game, border } = theme;
  const hexSize = game.battle.hexSize;
  const gridPadding = game.battle.gridSpacing;
  const size = DEFAULT_GRID_SIZE;
  const hexWidth = hexSize * 2;
  const hexHeight = hexSize * Math.sqrt(3);

  const cells = [];
  for (let r = 0; r < size; r++) {
    for (let q = 0; q < size; q++) {
      const cx = q * hexWidth * 0.75 + hexSize + gridPadding;
      const cy = r * hexHeight + (q % 2) * (hexHeight / 2) + hexSize + gridPadding;
      const isCenter = q === 4 && r === 4;
      cells.push(
        <Polygon
          key={`${q}-${r}`}
          points={hexPoints(cx, cy, hexSize - 1)}
          fill={isCenter ? colors.primaryDark : colors.surface}
          stroke={colors.border}
          strokeWidth={border.thin}
        />,
      );
    }
  }

  return (
    <View style={styles.wrap}>
      <Svg width={size * hexWidth * 0.75 + hexSize * 2} height={size * hexHeight + hexSize * 2}>
        {cells}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
});
