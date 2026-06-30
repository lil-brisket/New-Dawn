import { Polygon, Text as SvgText } from 'react-native-svg';
import type { HexCoord } from '@dawn/types';
import { useTheme } from '@dawn/ui';
import { hexPoints, formatCoord } from '../utils/hexLayout';

export type TileHighlight =
  'none' | 'selected' | 'reachable' | 'attackable' | 'occupied' | 'blocked';

export interface HexTileProps {
  coord: HexCoord;
  cx: number;
  cy: number;
  hexSize: number;
  highlight: TileHighlight;
  walkable: boolean;
  showCoords: boolean;
  showGrid: boolean;
  apLabel?: string;
  onPress?: () => void;
}

export function HexTile({
  coord,
  cx,
  cy,
  hexSize,
  highlight,
  walkable,
  showCoords,
  showGrid,
  apLabel,
}: HexTileProps) {
  const { theme } = useTheme();
  const { colors, border } = theme;

  let fill: string = walkable ? colors.surface : colors.surfacePressed;
  if (highlight === 'selected') fill = colors.primaryDark;
  else if (highlight === 'reachable') fill = colors.primary + '55';
  else if (highlight === 'attackable') fill = colors.error + '44';
  else if (highlight === 'occupied') fill = colors.surfaceElevated;
  else if (highlight === 'blocked') fill = colors.surfacePressed;

  let stroke = showGrid ? colors.border : 'transparent';
  let strokeWidth: number = border.thin;
  let strokeDasharray: string | undefined;

  if (highlight === 'selected') {
    stroke = colors.primary;
    strokeWidth = 3;
  } else if (highlight === 'reachable') {
    stroke = colors.primary;
    strokeWidth = 2;
    strokeDasharray = '4,3';
  } else if (highlight === 'attackable') {
    stroke = colors.error;
    strokeWidth = 2;
    strokeDasharray = '2,2';
  }

  const points = hexPoints(cx, cy, hexSize);
  const label = formatCoord(coord);
  const fontSize = Math.max(7, hexSize * 0.28);

  return (
    <>
      <Polygon
        points={points}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
      />
      {highlight === 'attackable' && (
        <Polygon
          points={points}
          fill="transparent"
          stroke={colors.error}
          strokeWidth={1}
          strokeDasharray="1,3"
          opacity={0.6}
        />
      )}
      {showCoords && (
        <SvgText
          x={cx}
          y={cy - (apLabel ? 4 : 0)}
          fontSize={fontSize}
          fill={colors.textMuted}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {label}
        </SvgText>
      )}
      {apLabel && (
        <SvgText
          x={cx}
          y={cy + hexSize * 0.35}
          fontSize={fontSize}
          fill={colors.primary}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontWeight="bold"
        >
          {apLabel}
        </SvgText>
      )}
    </>
  );
}
