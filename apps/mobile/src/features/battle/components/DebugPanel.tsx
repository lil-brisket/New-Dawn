import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Share,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '@dawn/ui';
import type { BattleState } from '@dawn/types';
import type { DebugSettings } from '../hooks/useBattle';
import type { BattleViewMode } from '../state/BattleUIState';
import type { BattleCommandState } from '../state/BattleCommandState';
import type { BattleScenario } from '../sandbox/battles';

export interface DebugContext {
  restart: () => void;
  undo: () => void;
  endTurn: () => void;
  advanceTurns: (n: number) => void;
  skipRound: () => void;
  killSelected: () => void;
  healSelected: () => void;
  exportReplay: () => string | null;
  verifyReplay: () => boolean;
  debugSettings: DebugSettings;
  setDebugSettings: (patch: Partial<DebugSettings>) => void;
  lastReplayVerify: string | null;
  spawnBattle: () => void;
  viewMode?: BattleViewMode;
  cycleViewMode?: () => void;
  battleScenarios?: readonly BattleScenario[];
  activeBattleId?: string;
  onSelectBattle?: (id: string) => void;
  battleState?: BattleState | null;
  selectedCombatantId?: string | null;
  commandState?: BattleCommandState;
  reachableCount?: number;
}

export interface DebugAction {
  id: string;
  label: string;
  type?: 'button' | 'picker';
  onPress?: (ctx: DebugContext) => void;
}

const AI_SPEED_OPTIONS = [
  { label: 'Instant', value: 0 },
  { label: '250ms', value: 250 },
  { label: '500ms', value: 500 },
  { label: '1000ms', value: 1000 },
];

export const CORE_DEBUG_ACTIONS: DebugAction[] = [
  { id: 'restart', label: 'Restart Battle', onPress: (c) => c.restart() },
  { id: 'undo', label: 'Undo', onPress: (c) => c.undo() },
  { id: 'endTurn', label: 'End Turn', onPress: (c) => c.endTurn() },
  { id: 'nextTurn', label: 'Next Turn', onPress: (c) => c.advanceTurns(1) },
  { id: 'skipRound', label: 'Skip Round', onPress: (c) => c.skipRound() },
  { id: 'advance5', label: 'Advance 5 Turns', onPress: (c) => c.advanceTurns(5) },
  {
    id: 'kill',
    label: 'Kill Selected',
    onPress: (c) => {
      if (!c.selectedCombatantId) {
        Alert.alert('Kill Selected', 'Select a combatant first');
        return;
      }
      c.killSelected();
    },
  },
  {
    id: 'heal',
    label: 'Heal Selected',
    onPress: (c) => {
      if (!c.selectedCombatantId) {
        Alert.alert('Heal Selected', 'Select a combatant first');
        return;
      }
      c.healSelected();
    },
  },
  {
    id: 'exportReplay',
    label: 'Export Replay',
    onPress: (c) => {
      const json = c.exportReplay();
      if (!json) {
        Alert.alert('Export Replay', 'No recording available');
        return;
      }
      if (Platform.OS === 'web') {
        const webNavigator = globalThis.navigator as Navigator & {
          clipboard?: { writeText: (text: string) => Promise<void> };
        };
        if (webNavigator?.clipboard) {
          void webNavigator.clipboard.writeText(json).then(() => {
            Alert.alert('Export Replay', 'Copied to clipboard');
          });
          return;
        }
      }
      void Share.share({ message: json, title: 'Battle Replay' });
    },
  },
  {
    id: 'verifyReplay',
    label: 'Verify Replay',
    onPress: (c) => {
      const ok = c.verifyReplay();
      Alert.alert(
        'Verify Replay',
        ok ? 'Recording matches current state' : (c.lastReplayVerify ?? 'Failed'),
      );
    },
  },
  {
    id: 'toggleCoords',
    label: 'Toggle Coordinates',
    onPress: (c) => c.setDebugSettings({ showCoords: !c.debugSettings.showCoords }),
  },
  {
    id: 'toggleReachable',
    label: 'Toggle Reachable',
    onPress: (c) => c.setDebugSettings({ showReachable: !c.debugSettings.showReachable }),
  },
  {
    id: 'toggleGrid',
    label: 'Toggle Grid',
    onPress: (c) => c.setDebugSettings({ showGrid: !c.debugSettings.showGrid }),
  },
  { id: 'spawnBattle', label: 'Spawn Test Battle', onPress: (c) => c.spawnBattle() },
];

export interface DebugPanelProps {
  context: DebugContext;
  extraActions?: DebugAction[];
  collapsed?: boolean;
}

export function DebugPanel({
  context,
  extraActions = [],
  collapsed: collapsedDefault = false,
}: DebugPanelProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography, radius, border } = theme;
  const [expanded, setExpanded] = useState(!collapsedDefault);
  const actions = [...CORE_DEBUG_ACTIONS, ...extraActions];

  const cycleAiSpeed = () => {
    const current = context.debugSettings.aiSpeedMs;
    const idx = AI_SPEED_OPTIONS.findIndex((o) => o.value === current);
    const next = AI_SPEED_OPTIONS[(idx + 1) % AI_SPEED_OPTIONS.length]!;
    context.setDebugSettings({ aiSpeedMs: next.value });
  };

  const aiSpeedLabel =
    AI_SPEED_OPTIONS.find((o) => o.value === context.debugSettings.aiSpeedMs)?.label ?? 'Custom';

  return (
    <View style={[styles.wrap, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
      <Pressable
        onPress={() => setExpanded((e) => !e)}
        style={{ paddingVertical: spacing.sm, paddingHorizontal: spacing.md }}
        accessibilityRole="button"
        accessibilityLabel="Toggle debug panel"
      >
        <Text style={{ color: colors.textSecondary, fontWeight: typography.fontWeight.bold }}>
          Debug Panel {expanded ? '▼' : '▶'}
          {context.viewMode ? ` · ${context.viewMode}` : ''}
        </Text>
      </Pressable>

      {expanded && (
        <ScrollView
          style={{ maxHeight: 280 }}
          contentContainerStyle={[styles.grid, { padding: spacing.sm }]}
        >
          {context.cycleViewMode ? (
            <Pressable
              onPress={context.cycleViewMode}
              style={[
                styles.btn,
                { backgroundColor: colors.primaryDark, borderColor: colors.border },
              ]}
            >
              <Text style={{ color: colors.textInverse, fontSize: typography.fontSize.xs }}>
                View: {context.viewMode ?? 'play'}
              </Text>
            </Pressable>
          ) : null}

          <Pressable
            onPress={cycleAiSpeed}
            style={[
              styles.btn,
              { backgroundColor: colors.surfacePressed, borderColor: colors.border },
            ]}
          >
            <Text style={{ color: colors.text, fontSize: typography.fontSize.xs }}>
              AI Speed: {aiSpeedLabel}
            </Text>
          </Pressable>

          {context.battleScenarios?.map((scenario) => (
            <Pressable
              key={scenario.definition.id}
              onPress={() => context.onSelectBattle?.(scenario.definition.id)}
              style={[
                styles.btn,
                {
                  backgroundColor:
                    context.activeBattleId === scenario.definition.id
                      ? colors.primary
                      : colors.surfacePressed,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={{
                  color:
                    context.activeBattleId === scenario.definition.id
                      ? colors.textInverse
                      : colors.text,
                  fontSize: typography.fontSize.xs,
                }}
              >
                {scenario.definition.name}
              </Text>
            </Pressable>
          ))}

          {actions.map((action) => (
            <Pressable
              key={action.id}
              onPress={() => action.onPress?.(context)}
              style={[
                styles.btn,
                { backgroundColor: colors.surfacePressed, borderColor: colors.border },
              ]}
            >
              <Text style={{ color: colors.text, fontSize: typography.fontSize.xs }}>
                {action.label}
              </Text>
            </Pressable>
          ))}

          {context.battleState && context.viewMode !== 'play' ? (
            <View
              style={[
                styles.readout,
                {
                  backgroundColor: colors.surfacePressed,
                  borderRadius: radius.sm,
                  borderColor: colors.border,
                  borderWidth: border.thin,
                  padding: spacing.sm,
                },
              ]}
            >
              <Text
                style={{ color: colors.textMuted, fontSize: typography.fontSize.xs, width: '100%' }}
              >
                Round {context.battleState.round} · Turn {context.battleState.turn + 1}
              </Text>
              <Text
                style={{ color: colors.textMuted, fontSize: typography.fontSize.xs, width: '100%' }}
              >
                Command: {context.commandState ?? '—'}
              </Text>
              <Text
                style={{ color: colors.textMuted, fontSize: typography.fontSize.xs, width: '100%' }}
              >
                Selected: {context.selectedCombatantId ?? 'none'}
              </Text>
              <Text
                style={{ color: colors.textMuted, fontSize: typography.fontSize.xs, width: '100%' }}
              >
                Reachable tiles: {context.reachableCount ?? 0}
              </Text>
              <Text
                style={{ color: colors.textMuted, fontSize: typography.fontSize.xs, width: '100%' }}
              >
                Active: {context.battleState.activeCombatantId}
              </Text>
            </View>
          ) : null}

          {context.lastReplayVerify ? (
            <Text
              style={{ color: colors.textMuted, fontSize: typography.fontSize.xs, width: '100%' }}
            >
              {context.lastReplayVerify}
            </Text>
          ) : null}

          <Text
            style={{ color: colors.textMuted, fontSize: typography.fontSize.xs, width: '100%' }}
          >
            Coords:{context.debugSettings.showCoords ? 'ON' : 'OFF'} Reachable:
            {context.debugSettings.showReachable ? 'ON' : 'OFF'} Grid:
            {context.debugSettings.showGrid ? 'ON' : 'OFF'}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderTopWidth: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  btn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  readout: { width: '100%' },
});
