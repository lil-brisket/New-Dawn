import { Circle, Text as SvgText } from 'react-native-svg';
import type { Combatant } from '@dawn/types';
import { useTheme } from '@dawn/ui';

export interface UnitSpriteProps {
  combatant: Combatant;
  cx: number;
  cy: number;
  hexSize: number;
  isActive: boolean;
  isSelected: boolean;
}

export function UnitSprite({ combatant, cx, cy, hexSize, isActive, isSelected }: UnitSpriteProps) {
  const { theme } = useTheme();
  const { colors } = theme;
  const radius = hexSize * 0.45;
  const fill = combatant.team === 'player' ? colors.primary : colors.error;
  const stroke = isSelected ? colors.warning : isActive ? colors.text : colors.border;
  const strokeWidth = isSelected ? 3 : isActive ? 2 : 1;
  const fontSize = Math.max(8, hexSize * 0.32);

  return (
    <>
      <Circle cx={cx} cy={cy} r={radius} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
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
      <SvgText
        x={cx}
        y={cy + radius + fontSize}
        fontSize={fontSize}
        fill={colors.text}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {combatant.hp}
      </SvgText>
    </>
  );
}
