import { View, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { useTheme } from '@dawn/ui';
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

export function BattleViewport() {
  const { colors } = useTheme();
  const size = GRID_CONSTANTS.SIZE;
  const hexWidth = HEX_SIZE * 2;
  const hexHeight = HEX_SIZE * Math.sqrt(3);

  const cells = [];
  for (let r = 0; r < size; r++) {
    for (let q = 0; q < size; q++) {
      const cx = q * hexWidth * 0.75 + HEX_SIZE + 8;
      const cy = r * hexHeight + (q % 2) * (hexHeight / 2) + HEX_SIZE + 8;
      const isCenter = q === 4 && r === 4;
      cells.push(
        <Polygon
          key={`${q}-${r}`}
          points={hexPoints(cx, cy, HEX_SIZE - 1)}
          fill={isCenter ? colors.primaryDark : colors.surface}
          stroke={colors.border}
          strokeWidth={1}
        />,
      );
    }
  }

  return (
    <View style={styles.wrap}>
      <Svg width={size * hexWidth * 0.75 + HEX_SIZE * 2} height={size * hexHeight + HEX_SIZE * 2}>
        {cells}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
});
