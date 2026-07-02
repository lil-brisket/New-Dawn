import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import type { HexCoord, BattleEvent } from '@dawn/types';
import { findPath, getRemainingMoves, getAffectedTiles, defaultRegistry } from '@dawn/game-core';
import { createId } from '@dawn/utils';
import { Button, useTheme } from '@dawn/ui';
import { ScreenLayout } from '@/layouts/ScreenLayout';
import { ROUTES } from '@/navigation/routes';
import { useBattleContext } from '../provider/BattleProvider';
import { BattleLayout } from '../layout/BattleLayout';
import { BattleHeader } from '../components/BattleHeader';
import { BattleLog } from '../components/BattleLog';
import { BattleActionBar } from '../components/BattleActionBar';
import { DebugPanel } from '../components/DebugPanel';
import { UnitInspector } from '../components/UnitInspector';
import { BattleGrid } from '../grid/BattleGrid';
import { buildGridLayers } from '../grid/buildGridLayers';
import { growHexSizeToViewport, useHexSize } from '../hooks/useHexSize';
import { useBattleUIState } from '../state/useBattleUIState';
import { deriveCommandState, type CommandContext } from '../state/commandHelpers';
import { useBattleTheme } from '../theme/BattleTheme';
import { buildTeamDisplay, buildTurnDisplay } from '../utils/battleDisplay';
import { createBattleEventBus } from '../events/battleEventBus';
import { createBattleUIEventQueue } from '../events/BattleUIEventQueue';
import { createBattleAnimationManager } from '../animation/BattleAnimationManager';
import { mapBattleEventsToUIEvents } from '../events/mapBattleEventsToUIEvents';
import type { BattleLogCard } from '../events/BattleUIEvent';
import { getBattleScenario, BATTLE_SCENARIOS } from '../sandbox/battles';
import { cubeToPixel } from '../utils/hexLayout';
import type { BattleCommandState } from '../state/BattleCommandState';
import type { BattleViewMode } from '../state/BattleUIState';
import { SkillPickerBar } from '../components/SkillPickerBar';
import { ItemPickerBar } from '../components/ItemPickerBar';
import { mockInventory } from '@/mocks/inventory';

const VIEW_MODES: BattleViewMode[] = ['play', 'developer', 'debug'];

type ActionBarPanel = 'main' | 'skills' | 'items';

function commandHintFor(
  state: BattleCommandState,
  playerTurn: boolean,
  canAct: boolean,
): string | null {
  if (!playerTurn || !canAct) return null;
  switch (state) {
    case 'idle':
      return 'Select an action';
    case 'selecting_move':
      return 'Select destination';
    case 'selecting_attack':
      return 'Select an enemy';
    case 'selecting_skill':
      return 'Select skill target';
    default:
      return null;
  }
}

export function BattlePresenter() {
  const router = useRouter();
  const battle = useBattleContext();
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const battleTheme = useBattleTheme();
  const { uiState, setUI } = useBattleUIState();

  const [logCards, setLogCards] = useState<BattleLogCard[]>([]);
  const [inspectUnitId, setInspectUnitId] = useState<string | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [animationLocked, setAnimationLocked] = useState(false);
  const [actionBarPanel, setActionBarPanel] = useState<ActionBarPanel>('main');

  const busRef = useRef(createBattleEventBus());
  const queueRef = useRef(createBattleUIEventQueue());
  const animRef = useRef(createBattleAnimationManager(queueRef.current, busRef.current));
  const prevStateRef = useRef(battle.battleState);
  const prevLogLenRef = useRef(0);

  const scenario = getBattleScenario(battle.battleDefinitionId);
  const scene = scenario?.scene;

  const gridWidth = battle.battleState?.grid.width ?? 0;
  const gridHeight = battle.battleState?.grid.height ?? 0;

  const showCoords = battle.debugSettings.showCoords;
  const reserveAxisLabels = uiState.viewMode === 'play' || showCoords;

  const gridViewportInset = battleTheme.platform.key === 'web' ? 12 : 0;
  const gridViewportWidth = Math.max(0, viewportSize.width - gridViewportInset);
  const gridViewportHeight = Math.max(0, viewportSize.height - gridViewportInset);

  const rawHexSize = useHexSize(
    gridWidth,
    gridHeight,
    gridViewportWidth,
    gridViewportHeight,
    battleTheme.gridPadding,
    battleTheme.hexSizeMin,
    reserveAxisLabels,
    battleTheme.gridAxis,
  );
  const cappedHexSize = Math.min(rawHexSize, battleTheme.hexSizeMax);
  const hexSize = growHexSizeToViewport(
    cappedHexSize,
    gridWidth,
    gridHeight,
    gridViewportWidth,
    gridViewportHeight,
    battleTheme.gridPadding,
    battleTheme.hexSizeMax,
    reserveAxisLabels,
    battleTheme.gridAxis,
  );
  const gridLayoutOptions = { reserveAxisLabels, axis: battleTheme.gridAxis };

  useEffect(() => {
    animRef.current.setCallbacks({
      onAnimationStart: () => setAnimationLocked(true),
      onAnimationEnd: () => setAnimationLocked(false),
      onTurnBanner: (event) => {
        setUI({ type: 'set_turn_banner', message: event.title });
        setTimeout(() => setUI({ type: 'set_turn_banner', message: null }), 1500);
      },
      onHeal: (event) => {
        const targetId = event.payload.targetId as string | undefined;
        const amount = event.payload.amount as number | undefined;
        if (!targetId || !battle.battleState) return;
        const target = battle.battleState.combatants.get(targetId);
        if (!target) return;
        const { cx, cy } = cubeToPixel(
          target.position,
          hexSize,
          battleTheme.gridPadding,
          gridLayoutOptions,
        );
        const id = createId('float');
        setUI({
          type: 'add_floating_text',
          item: {
            id,
            text: `+${amount}`,
            cx,
            cy,
            color: 'success',
            createdAt: Date.now(),
          },
        });
        setTimeout(() => setUI({ type: 'remove_floating_text', id }), 250);
      },
      onDamage: (event) => {
        const targetId = event.payload.targetId as string | undefined;
        const amount = event.payload.amount as number | undefined;
        if (!targetId || !battle.battleState) return;
        const target = battle.battleState.combatants.get(targetId);
        if (!target) return;
        const hexSizeForFloat = hexSize;
        const { cx, cy } = cubeToPixel(
          target.position,
          hexSizeForFloat,
          battleTheme.gridPadding,
          gridLayoutOptions,
        );
        const id = createId('float');
        setUI({
          type: 'add_floating_text',
          item: {
            id,
            text: `-${amount}`,
            cx,
            cy,
            color: 'error',
            createdAt: Date.now(),
          },
        });
        setTimeout(() => setUI({ type: 'remove_floating_text', id }), 250);
      },
    });
  }, [battle.battleState, battleTheme.gridPadding, hexSize, gridLayoutOptions, setUI]);

  useEffect(() => {
    const unsub = busRef.current.subscribeAll((event) => {
      setLogCards((prev) => [...prev, event]);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (battle.battleState && battle.battleState !== prevStateRef.current) {
      prevStateRef.current = battle.battleState;
    }
  }, [battle.battleState]);

  const battleIdRef = useRef<string | null>(null);
  useEffect(() => {
    const battleId = battle.battleState?.battleId ?? null;
    if (!battleId || battleIdRef.current === battleId) return;
    battleIdRef.current = battleId;
    setUI({ type: 'set_selected_tile', tile: null });
    setUI({ type: 'set_hover_tile', tile: null, unitId: null });
    setUI({ type: 'set_preview_path', path: [] });
    setInspectUnitId(null);
    setActionBarPanel('main');
  }, [battle.battleState?.battleId, setUI]);

  useEffect(() => {
    if (!battle.playerTurn || battle.battleState?.winner !== null) {
      setActionBarPanel('main');
    }
  }, [battle.playerTurn, battle.battleState?.winner]);

  const processDispatchEvents = useCallback(
    (events: readonly BattleEvent[]) => {
      if (!battle.battleState || events.length === 0) return;
      const uiEvents = mapBattleEventsToUIEvents(events, battle.battleState);
      animRef.current.enqueue(uiEvents);
    },
    [battle.battleState],
  );

  useEffect(() => {
    const prevLen = prevLogLenRef.current;
    if (battle.logEntries.length > prevLen && battle.battleState) {
      const newEntries = battle.logEntries.slice(prevLen);
      const events = newEntries
        .map((e) => e.payload)
        .filter(
          (p): p is BattleEvent => p !== null && typeof p === 'object' && 'type' in (p as object),
        );
      processDispatchEvents(events);
    }
    prevLogLenRef.current = battle.logEntries.length;
  }, [battle.logEntries, battle.battleState, processDispatchEvents]);

  const canAct =
    !!battle.battleState &&
    battle.battleState.winner === null &&
    battle.playerTurn &&
    !!battle.battleState.activeCombatantId &&
    battle.battleState.activeCombatantId === battle.selectedCombatantId;

  const commandState = deriveCommandState({
    mode: battle.mode,
    playerTurn: battle.playerTurn,
    winner: battle.battleState?.winner ?? null,
    animationLocked,
  });

  const commandContext: CommandContext = {
    commandState,
    canAct,
    canUsePrimaryAction: !battle.battleState?.turnActionState.hasUsedPrimaryAction,
    playerTurn: battle.playerTurn,
    battleEnded: battle.battleState?.winner !== null && battle.battleState?.winner !== undefined,
  };

  const showGrid = battle.debugSettings.showGrid;
  const gridStrong = battle.debugSettings.showGrid;
  const showAxisLabels = reserveAxisLabels;
  const showReachable = battle.mode === 'move' || battle.debugSettings.showReachable;

  const reachableCosts = useMemo(() => {
    if (!showReachable) return [];
    return battle.reachableTileCosts;
  }, [showReachable, battle.reachableTileCosts]);

  const attackableIds = useMemo(() => {
    return new Set(battle.attackableTargets.map((t) => t.id));
  }, [battle.attackableTargets]);

  const attackableCoordKeys = useMemo(() => {
    return new Set(
      battle.attackableTargets.map((t) => `${t.position.x},${t.position.y},${t.position.z}`),
    );
  }, [battle.attackableTargets]);

  const attackRangeCoordKeys = useMemo(() => {
    return new Set(battle.attackRangeTiles.map((c) => `${c.x},${c.y},${c.z}`));
  }, [battle.attackRangeTiles]);

  const reachableCoordKeys = useMemo(() => {
    return new Set(
      reachableCosts.map((entry) => `${entry.coord.x},${entry.coord.y},${entry.coord.z}`),
    );
  }, [reachableCosts]);

  const skillTargetCoordKeys = useMemo(() => {
    return new Set(battle.skillTargetTiles.map((c) => `${c.x},${c.y},${c.z}`));
  }, [battle.skillTargetTiles]);

  const skillTargetUnitIds = useMemo(() => new Set(battle.skillTargetIds), [battle.skillTargetIds]);

  const aoePreviewCoordKeys = useMemo(() => {
    if (
      battle.mode !== 'skill' ||
      !battle.selectedSkillId ||
      !battle.battleState ||
      !uiState.hoverTile
    ) {
      return new Set<string>();
    }

    const skill = defaultRegistry.getSkill(battle.selectedSkillId);
    if (!skill || skill.targeting.type !== 'area') return new Set<string>();

    const activeId = battle.battleState.activeCombatantId;
    if (!activeId) return new Set<string>();

    const hover = uiState.hoverTile;
    const hoverKey = `${hover.x},${hover.y},${hover.z}`;
    if (!skillTargetCoordKeys.has(hoverKey)) return new Set<string>();

    let selection: { targetId?: string; destination?: typeof hover } = {};
    if (skill.targeting.center === 'tile') {
      selection = { destination: hover };
    } else {
      const targetId = battle.skillTargetIds.find((id) => {
        const unit = battle.battleState!.combatants.get(id);
        return (
          unit &&
          unit.position.x === hover.x &&
          unit.position.y === hover.y &&
          unit.position.z === hover.z
        );
      });
      if (!targetId) return new Set<string>();
      selection = { targetId };
    }

    const tiles = getAffectedTiles(battle.battleState, skill, activeId, selection);
    return new Set(
      tiles.filter((t) => `${t.x},${t.y},${t.z}` !== hoverKey).map((t) => `${t.x},${t.y},${t.z}`),
    );
  }, [
    battle.mode,
    battle.selectedSkillId,
    battle.battleState,
    battle.skillTargetIds,
    uiState.hoverTile,
    skillTargetCoordKeys,
  ]);

  const handleEndBattle = useCallback(() => {
    router.replace(ROUTES.DEVELOPER);
  }, [router]);

  const showInvalidAttackTarget = useCallback(
    (coord: HexCoord) => {
      const { cx, cy } = cubeToPixel(coord, hexSize, battleTheme.gridPadding, gridLayoutOptions);
      const id = createId('float');
      setUI({
        type: 'add_floating_text',
        item: {
          id,
          text: 'No target',
          cx,
          cy,
          color: 'warning',
          createdAt: Date.now(),
        },
      });
      setTimeout(() => setUI({ type: 'remove_floating_text', id }), 900);
    },
    [battleTheme.gridPadding, gridLayoutOptions, hexSize, setUI],
  );

  const handleTileHover = useCallback(
    (coord: HexCoord | null, unitId?: string | null) => {
      if (
        coord &&
        battle.mode === 'attack' &&
        !attackableCoordKeys.has(`${coord.x},${coord.y},${coord.z}`)
      ) {
        setUI({ type: 'set_hover_tile', tile: null, unitId: null });
        return;
      }

      if (
        coord &&
        battle.mode === 'skill' &&
        !skillTargetCoordKeys.has(`${coord.x},${coord.y},${coord.z}`)
      ) {
        setUI({ type: 'set_hover_tile', tile: null, unitId: null });
        return;
      }

      setUI({ type: 'set_hover_tile', tile: coord, unitId });

      if (coord && battle.battleState && battle.mode === 'move') {
        const activeId = battle.battleState.activeCombatantId;
        if (!activeId) return;
        const unit = battle.battleState.combatants.get(activeId);
        if (unit) {
          const path =
            findPath(
              battle.battleState,
              unit.position,
              coord,
              getRemainingMoves(battle.battleState, battle.battleState.config),
            ) ?? [];
          setUI({ type: 'set_preview_path', path });
        }
      } else {
        setUI({ type: 'set_preview_path', path: [] });
      }
    },
    [
      battle.battleState,
      battle.selectedCombatantId,
      battle.mode,
      attackableCoordKeys,
      skillTargetCoordKeys,
      setUI,
    ],
  );

  const handleTilePress = useCallback(
    (coord: HexCoord) => {
      if (battle.mode === 'attack') {
        const key = `${coord.x},${coord.y},${coord.z}`;
        if (!attackableCoordKeys.has(key)) {
          showInvalidAttackTarget(coord);
          return;
        }
      }
      if (battle.mode === 'skill') {
        const key = `${coord.x},${coord.y},${coord.z}`;
        if (!skillTargetCoordKeys.has(key)) {
          showInvalidAttackTarget(coord);
          return;
        }
      }
      setUI({ type: 'set_selected_tile', tile: coord });
      battle.handleTilePress(coord);
    },
    [attackableCoordKeys, skillTargetCoordKeys, battle, setUI, showInvalidAttackTarget],
  );

  const handleInvalidAttackTarget = useCallback(
    (coord: HexCoord) => {
      showInvalidAttackTarget(coord);
    },
    [showInvalidAttackTarget],
  );

  const handleUnitPress = useCallback(
    (combatantId: string) => {
      if (battle.mode === 'attack') {
        if (!attackableIds.has(combatantId)) {
          const unit = battle.battleState?.combatants.get(combatantId);
          if (unit) showInvalidAttackTarget(unit.position);
          return;
        }
        const unit = battle.battleState?.combatants.get(combatantId);
        if (unit) battle.handleTilePress(unit.position);
        return;
      }
      if (battle.mode === 'skill') {
        if (!skillTargetUnitIds.has(combatantId)) {
          const unit = battle.battleState?.combatants.get(combatantId);
          if (unit) showInvalidAttackTarget(unit.position);
          return;
        }
        const unit = battle.battleState?.combatants.get(combatantId);
        if (unit) battle.handleTilePress(unit.position);
        return;
      }
      battle.setSelectedCombatantId(combatantId);
      const unit = battle.battleState?.combatants.get(combatantId);
      if (unit) {
        setUI({ type: 'set_selected_tile', tile: unit.position });
      }
    },
    [battle, setUI, attackableIds, skillTargetUnitIds, showInvalidAttackTarget],
  );

  const cycleViewMode = useCallback(() => {
    const idx = VIEW_MODES.indexOf(uiState.viewMode);
    const next = VIEW_MODES[(idx + 1) % VIEW_MODES.length]!;
    setUI({ type: 'set_view_mode', mode: next });
  }, [uiState.viewMode, setUI]);

  const debugContext = useMemo(
    () => ({
      restart: battle.restart,
      undo: battle.undo,
      endTurn: battle.endTurn,
      advanceTurns: battle.advanceTurns,
      skipRound: battle.skipRound,
      killSelected: battle.killSelected,
      healSelected: battle.healSelected,
      exportReplay: battle.exportReplay,
      verifyReplay: battle.verifyReplay,
      debugSettings: battle.debugSettings,
      setDebugSettings: (patch: Partial<typeof battle.debugSettings>) =>
        battle.setDebugSettings((s) => ({ ...s, ...patch })),
      lastReplayVerify: battle.lastReplayVerify,
      spawnBattle: () => battle.restart(),
      viewMode: uiState.viewMode,
      cycleViewMode,
      battleScenarios: BATTLE_SCENARIOS,
      activeBattleId: battle.battleDefinitionId,
      onSelectBattle: battle.setBattleDefinitionId,
      battleState: battle.battleState,
      selectedCombatantId: battle.selectedCombatantId,
      commandState,
      reachableCount: reachableCosts.length,
    }),
    [battle, uiState.viewMode, cycleViewMode, commandState, reachableCosts.length],
  );

  const commandHandlers = useMemo(() => {
    const cancelActionMode = () => {
      battle.setMode('idle');
      battle.selectSkill(null);
      setUI({ type: 'set_preview_path', path: [] });
      setUI({ type: 'set_hover_tile', tile: null, unitId: null });
    };

    return {
      attack: () => {
        setActionBarPanel('main');
        if (battle.mode === 'attack') {
          cancelActionMode();
          return;
        }
        battle.selectSkill(null);
        battle.setMode('attack');
      },
      item: () => {
        if (actionBarPanel === 'items') {
          setActionBarPanel('main');
          return;
        }
        cancelActionMode();
        setActionBarPanel('items');
      },
      move: () => {
        setActionBarPanel('main');
        if (battle.mode === 'move') {
          cancelActionMode();
          return;
        }
        battle.selectSkill(null);
        battle.setMode('move');
      },
      skill: () => {
        if (battle.mode === 'skill') {
          cancelActionMode();
          return;
        }
        cancelActionMode();
        setActionBarPanel('skills');
      },
      end_turn: () => {
        setActionBarPanel('main');
        battle.endTurn();
      },
    };
  }, [battle, setUI, actionBarPanel]);

  const handleSkillSelect = useCallback(
    (skillId: string) => {
      const skill = defaultRegistry.getSkill(skillId);
      if (!skill) return;
      if (skill.targeting.type === 'self') {
        battle.castSelfSkill(skillId);
        battle.selectSkill(null);
        return;
      }
      battle.selectSkill(skillId);
    },
    [battle],
  );

  const handleBackFromSubPanel = useCallback(() => {
    if (actionBarPanel === 'skills') {
      battle.setMode('idle');
      battle.selectSkill(null);
      setUI({ type: 'set_preview_path', path: [] });
      setUI({ type: 'set_hover_tile', tile: null, unitId: null });
    }
    setActionBarPanel('main');
  }, [actionBarPanel, battle, setUI]);

  const skillDebugActions = useMemo(
    () => [
      { id: 'infiniteSp', label: 'Infinite SP', onPress: () => battle.infiniteSp() },
      { id: 'skipCd', label: 'Skip Cooldowns', onPress: () => battle.clearCooldowns() },
      {
        id: 'applyTags',
        label: 'Apply Every Tag',
        onPress: () => battle.applyAllTags(),
      },
      { id: 'spawnDummy', label: 'Spawn Dummy', onPress: () => battle.spawnDummy() },
      { id: 'resetBattle', label: 'Reset Battle', onPress: () => battle.restart() },
    ],
    [battle],
  );

  if (!battle.battleState) {
    return (
      <ScreenLayout>
        <View
          style={[styles.centered, { backgroundColor: colors.background, padding: spacing.lg }]}
        >
          {battle.loadError ? (
            <>
              <Text
                style={{
                  color: colors.text,
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.bold,
                  marginBottom: spacing.sm,
                  textAlign: 'center',
                }}
              >
                Failed to start battle
              </Text>
              <Text
                style={{ color: colors.textMuted, textAlign: 'center', marginBottom: spacing.md }}
              >
                {battle.loadError.code}
              </Text>
              <Button title="Retry" onPress={battle.restart} />
            </>
          ) : (
            <Text style={{ color: colors.text }}>Loading battle...</Text>
          )}
        </View>
      </ScreenLayout>
    );
  }

  const state = battle.battleState;
  const showVictory = state.winner !== null;
  const teamA = buildTeamDisplay(state, 'player');
  const teamB = buildTeamDisplay(state, 'enemy');
  const turn = buildTurnDisplay(state, battle.battleDefinition.name, battle.playerTurn);
  const bannerMessage =
    uiState.turnBanner ?? commandHintFor(commandState, battle.playerTurn, canAct);

  const gridLayers = buildGridLayers({
    state,
    uiState,
    hexSize,
    gridPadding: battleTheme.gridPadding,
    gridAxis: battleTheme.gridAxis,
    reachableTileCosts: reachableCosts,
    attackableUnitIds: attackableIds,
    attackableCoordKeys,
    attackRangeCoordKeys,
    reachableCoordKeys,
    skillTargetCoordKeys,
    aoePreviewCoordKeys,
    selectedCombatantId: battle.selectedCombatantId,
    targetingMode: battle.mode,
    showGrid,
    showAxisLabels,
    showCoords,
    onTilePress: handleTilePress,
    onTileHover: handleTileHover,
    onInvalidAttackTarget: handleInvalidAttackTarget,
    onUnitPress: handleUnitPress,
    onUnitLongPress: (id) => {
      if (uiState.viewMode === 'debug') setInspectUnitId(id);
    },
  });

  const inspectUnit = inspectUnitId ? (state.combatants.get(inspectUnitId) ?? null) : null;

  return (
    <ScreenLayout>
      <View style={styles.shell}>
        <BattleLayout
          battleTheme={battleTheme}
          background={
            scene ? (
              <View
                style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]}
                pointerEvents="none"
              />
            ) : undefined
          }
          header={
            <BattleHeader
              teamA={teamA}
              teamB={teamB}
              turn={turn}
              turnBannerMessage={bannerMessage}
              battleTheme={battleTheme}
              onEndBattle={handleEndBattle}
            />
          }
          grid={
            <BattleGrid
              layers={gridLayers}
              gridPadding={battleTheme.gridPadding}
              gridStrong={gridStrong}
              onViewportLayout={(w, h) => setViewportSize({ width: w, height: h })}
            />
          }
          log={<BattleLog entries={logCards} viewMode={uiState.viewMode} />}
          actionBar={
            actionBarPanel === 'skills' ? (
              <SkillPickerBar
                combatant={
                  battle.activeCombatant?.team === 'player' ? battle.activeCombatant : null
                }
                selectedSkillId={battle.selectedSkillId}
                onSelect={handleSkillSelect}
                onBack={handleBackFromSubPanel}
              />
            ) : actionBarPanel === 'items' ? (
              <ItemPickerBar
                items={mockInventory}
                onSelect={() => {}}
                onBack={handleBackFromSubPanel}
              />
            ) : (
              <BattleActionBar
                commandState={commandState}
                commandContext={commandContext}
                handlers={commandHandlers}
              />
            )
          }
          debug={
            <DebugPanel
              context={debugContext}
              extraActions={skillDebugActions}
              collapsed={uiState.viewMode === 'play'}
            />
          }
          overlays={
            <>
              <UnitInspector
                combatant={inspectUnit}
                visible={inspectUnitId !== null}
                onClose={() => setInspectUnitId(null)}
              />
              <Modal visible={showVictory} transparent animationType="fade">
                <View style={[styles.victoryBackdrop, { backgroundColor: colors.backdrop }]}>
                  <View
                    style={[
                      styles.victoryPanel,
                      {
                        backgroundColor: colors.surfaceElevated,
                        padding: spacing.xl,
                        borderRadius: theme.radius.lg,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: theme.typography.fontSize['2xl'],
                        fontWeight: theme.typography.fontWeight.bold,
                        marginBottom: spacing.md,
                      }}
                    >
                      {state.winner === 'player' ? 'Victory' : 'Defeat'}
                    </Text>
                    <Button title="Restart" onPress={battle.restart} />
                    <Pressable
                      onPress={() => router.replace(ROUTES.DEVELOPER)}
                      style={{ marginTop: spacing.sm }}
                    >
                      <Text style={{ color: colors.primary, textAlign: 'center' }}>Exit</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            </>
          }
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  shell: { flex: 1 },
  victoryBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  victoryPanel: {
    minWidth: 240,
    alignItems: 'center',
  },
});
