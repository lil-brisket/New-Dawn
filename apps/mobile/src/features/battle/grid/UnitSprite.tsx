import { Circle, Text as SvgText, Polygon } from 'react-native-svg';
import { useTheme } from '@dawn/ui';
import { hexPoints } from '../utils/hexLayout';

export interface UnitSpriteProps {
  label: string;
  team: 'player' | 'enemy';
  cx: number;
  cy: number;
  hexSize: number;
  isActive: boolean;
  isSelected: boolean;
  isAttackableTarget?: boolean;
}

export function UnitSprite({
  label,
  team,
  cx,
  cy,
  hexSize,
  isActive,
  isSelected,
  isAttackableTarget = false,
}: UnitSpriteProps) {
  const { theme } = useTheme();
  const { colors, border } = theme;
  const radius = hexSize * 0.4;
  const fontSize = radius * 0.7;
  const avatarStroke = isSelected ? colors.warning : colors.gold;
  const avatarStrokeWidth = isSelected ? border.normal : border.thin;
  const tileStroke = isAttackableTarget
    ? colors.error
    : team === 'player'
      ? colors.success
      : colors.error;
  const tileStrokeWidth = isAttackableTarget ? 3 : 1.5;
  const tileStrokeOpacity = isAttackableTarget ? 1 : 0.5;

  return (
    <>
      <Polygon
        points={hexPoints(cx, cy, hexSize)}
        fill="transparent"
        stroke={tileStroke}
        strokeWidth={tileStrokeWidth}
        opacity={tileStrokeOpacity}
      />
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={colors.primaryDark}
        stroke={avatarStroke}
        strokeWidth={avatarStrokeWidth}
      />
      <SvgText
        x={cx}
        y={cy + fontSize * 0.35}
        fontSize={fontSize}
        fill={colors.text}
        textAnchor="middle"
        fontWeight="bold"
      >
        {label}
      </SvgText>
      {isActive && (
        <Circle
          cx={cx}
          cy={cy}
          r={radius + 4}
          fill="transparent"
          stroke={colors.warning}
          strokeWidth={2}
          strokeDasharray="3,2"
        />
      )}
    </>
  );
}
