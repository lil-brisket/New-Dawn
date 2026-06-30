import type { HexCoord } from '@dawn/types';
import type { ReachableTileCost } from '@dawn/game-core';
import type { CombatantDisplay } from '../utils/battleDisplay';

export type BattleViewMode = 'play' | 'developer' | 'debug';

export interface FloatingTextItem {
  readonly id: string;
  readonly text: string;
  readonly cx: number;
  readonly cy: number;
  readonly color: string;
  readonly createdAt: number;
}

export interface BattleUICamera {
  offsetX: number;
  offsetY: number;
  hexSize: number;
}

export interface BattleUIOverlays {
  showGrid: boolean;
  showCoords: boolean;
  showReachable: boolean;
  movementRange: ReachableTileCost[];
  attackTargets: CombatantDisplay[];
}

export interface BattleUIState {
  selectedTile: HexCoord | null;
  hoverTile: HexCoord | null;
  hoverUnitId: string | null;
  previewPath: HexCoord[];
  camera: BattleUICamera;
  overlays: BattleUIOverlays;
  viewMode: BattleViewMode;
  floatingTexts: FloatingTextItem[];
  activeAnimations: string[];
  turnBanner: string | null;
}

export const INITIAL_CAMERA: BattleUICamera = {
  offsetX: 0,
  offsetY: 0,
  hexSize: 24,
};

export const INITIAL_OVERLAYS: BattleUIOverlays = {
  showGrid: false,
  showCoords: false,
  showReachable: false,
  movementRange: [],
  attackTargets: [],
};

export const INITIAL_BATTLE_UI_STATE: BattleUIState = {
  selectedTile: null,
  hoverTile: null,
  hoverUnitId: null,
  previewPath: [],
  camera: INITIAL_CAMERA,
  overlays: INITIAL_OVERLAYS,
  viewMode: 'play',
  floatingTexts: [],
  activeAnimations: [],
  turnBanner: null,
};

export type BattleUIAction =
  | { type: 'set_selected_tile'; tile: HexCoord | null }
  | { type: 'set_hover_tile'; tile: HexCoord | null; unitId?: string | null }
  | { type: 'set_preview_path'; path: HexCoord[] }
  | { type: 'set_camera'; camera: Partial<BattleUICamera> }
  | { type: 'set_overlays'; overlays: Partial<BattleUIOverlays> }
  | { type: 'set_view_mode'; mode: BattleViewMode }
  | { type: 'add_floating_text'; item: FloatingTextItem }
  | { type: 'remove_floating_text'; id: string }
  | { type: 'clear_floating_texts' }
  | { type: 'set_active_animations'; ids: string[] }
  | { type: 'add_animation'; id: string }
  | { type: 'remove_animation'; id: string }
  | { type: 'set_turn_banner'; message: string | null }
  | { type: 'reset_ui' };

export function battleUIReducer(state: BattleUIState, action: BattleUIAction): BattleUIState {
  switch (action.type) {
    case 'set_selected_tile':
      return { ...state, selectedTile: action.tile };
    case 'set_hover_tile':
      return {
        ...state,
        hoverTile: action.tile,
        hoverUnitId: action.unitId ?? null,
        previewPath: action.tile === null ? [] : state.previewPath,
      };
    case 'set_preview_path':
      return { ...state, previewPath: action.path };
    case 'set_camera':
      return { ...state, camera: { ...state.camera, ...action.camera } };
    case 'set_overlays':
      return { ...state, overlays: { ...state.overlays, ...action.overlays } };
    case 'set_view_mode':
      return { ...state, viewMode: action.mode };
    case 'add_floating_text':
      return { ...state, floatingTexts: [...state.floatingTexts, action.item] };
    case 'remove_floating_text':
      return {
        ...state,
        floatingTexts: state.floatingTexts.filter((f) => f.id !== action.id),
      };
    case 'clear_floating_texts':
      return { ...state, floatingTexts: [] };
    case 'set_active_animations':
      return { ...state, activeAnimations: action.ids };
    case 'add_animation':
      return { ...state, activeAnimations: [...state.activeAnimations, action.id] };
    case 'remove_animation':
      return {
        ...state,
        activeAnimations: state.activeAnimations.filter((id) => id !== action.id),
      };
    case 'set_turn_banner':
      return { ...state, turnBanner: action.message };
    case 'reset_ui':
      return {
        ...INITIAL_BATTLE_UI_STATE,
        viewMode: state.viewMode,
        camera: state.camera,
      };
    default:
      return state;
  }
}
