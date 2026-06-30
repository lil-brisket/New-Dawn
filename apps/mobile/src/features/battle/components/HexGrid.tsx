import { useMemo } from 'react';
import { View, Pressable, StyleSheet, ScrollView } from 'react-native';
import Svg from 'react-native-svg';
import type { BattleState, HexCoord } from '@dawn/types';
import { getAllCoords, getCombatantAt, type ReachableTileCost } from '@dawn/game-core';
import { hexEquals } from '@dawn/utils';
import { useTheme } from '@dawn/ui';
import { cubeToPixel, gridPixelSize } from '../utils/hexLayout';
import { HexTile, type TileHighlight } from './HexTile';
import { UnitSprite } from './UnitSprite';
import type { Combatant } from '@dawn/types';

export interface HexGridProps {
  state: BattleState;
  selectedCombatantId: string | null;
  reachableTileCosts: ReachableTileCost[];
  attackableTargets: Combatant[];
  showCoords: boolean;
  showGrid: boolean;
  onTilePress: (coord: HexCoord) => void;
  onUnitPress: (combatantId: string) => void;
  onUnitLongPress: (combatant: Combatant) => void;
}

function coordKey(c: HexCoord): string {
  return `${c.x},${c.y},${c.z}`;
}

export function HexGrid({
  state,
  selectedCombatantId,
  reachableTileCosts,
  attackableTargets,
  showCoords,
  showGrid,
  onTilePress,
  onUnitPress,
  onUnitLongPress,
}: HexGridProps) {
  const { theme } = useTheme();
  const hexSize = theme.game.battle.hexSize;
  const gridPadding = theme.game.battle.gridSpacing;

  const reachableMap = useMemo(() => {
    const map = new Map<string, ReachableTileCost>();
    for (const entry of reachableTileCosts) {
      map.set(coordKey(entry.coord), entry);
    }
    return map;
  }, [reachableTileCosts]);

  const attackCoords = useMemo(() => {
    const set = new Set<string>();
    for (const t of attackableTargets) {
      set.add(coordKey(t.position));
    }
    return set;
  }, [attackableTargets]);

  const selectedUnit = selectedCombatantId ? state.combatants.get(selectedCombatantId) : undefined;

  const coords = getAllCoords(state.grid);
  const { svgWidth, svgHeight } = gridPixelSize(
    state.grid.width,
    state.grid.height,
    hexSize,
    gridPadding,
  );

  const pressTargets = useMemo(() => {
    return coords.map((coord) => {
      const { cx, cy } = cubeToPixel(coord, hexSize, gridPadding);
      const combatant = getCombatantAt(state, coord);
      const key = coordKey(coord);
      const reachable = reachableMap.get(key);
      const tile = state.grid.tiles.get(key);

      let highlight: TileHighlight = 'none';
      if (selectedUnit && hexEquals(coord, selectedUnit.position)) {
        highlight = 'selected';
      } else if (attackCoords.has(key)) {
        highlight = 'attackable';
      } else if (reachable) {
        highlight = 'reachable';
      } else if (combatant) {
        highlight = 'occupied';
      } else if (tile && !tile.walkable) {
        highlight = 'blocked';
      }

      return {
        coord,
        cx,
        cy,
        highlight,
        walkable: tile?.walkable ?? false,
        apLabel: reachable ? `AP:${reachable.apCost}` : undefined,
        combatant,
      };
    });
  }, [coords, state, hexSize, gridPadding, selectedUnit, attackCoords, reachableMap]);

  return (
    <ScrollView horizontal contentContainerStyle={styles.scrollH}>
      <ScrollView contentContainerStyle={styles.scrollV}>
        <View style={styles.wrap}>
          <Svg width={svgWidth} height={svgHeight}>
            {pressTargets.map((t) => (
              <HexTile
                key={coordKey(t.coord)}
                coord={t.coord}
                cx={t.cx}
                cy={t.cy}
                hexSize={hexSize}
                highlight={t.highlight}
                walkable={t.walkable}
                showCoords={showCoords}
                showGrid={showGrid}
                apLabel={t.apLabel}
              />
            ))}
            {pressTargets
              .filter((t) => t.combatant)
              .map((t) => (
                <UnitSprite
                  key={`unit-${t.combatant!.id}`}
                  combatant={t.combatant!}
                  cx={t.cx}
                  cy={t.cy}
                  hexSize={hexSize}
                  isActive={state.activeCombatantId === t.combatant!.id}
                  isSelected={selectedCombatantId === t.combatant!.id}
                />
              ))}
          </Svg>
          <View style={[StyleSheet.absoluteFill, { width: svgWidth, height: svgHeight }]}>
            {pressTargets.map((t) => (
              <Pressable
                key={`press-${coordKey(t.coord)}`}
                style={{
                  position: 'absolute',
                  left: t.cx - hexSize,
                  top: t.cy - hexSize,
                  width: hexSize * 2,
                  height: hexSize * 2,
                }}
                onPress={() => {
                  if (t.combatant) {
                    onUnitPress(t.combatant.id);
                  } else {
                    onTilePress(t.coord);
                  }
                }}
                onLongPress={() => {
                  if (t.combatant) onUnitLongPress(t.combatant);
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollH: { flexGrow: 1 },
  scrollV: { flexGrow: 1 },
  wrap: { position: 'relative' },
});
