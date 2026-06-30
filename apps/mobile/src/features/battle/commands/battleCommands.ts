import type { BattleActionType } from '../state/BattleCommandState';
import type { CommandContext } from '../state/commandHelpers';
import { isActionEnabled, isActionSelected } from '../state/commandHelpers';
import { BattleAssets } from '../assets/BattleAssets';

export type CommandStyle = 'primary' | 'success' | 'magic' | 'warning' | 'neutral';

export interface BattleCommandDefinition {
  type: BattleActionType;
  icon: string;
  label: string;
  style: CommandStyle;
  enabled: (ctx: CommandContext) => boolean;
  selected: (commandState: CommandContext['commandState'], type: BattleActionType) => boolean;
}

export const BATTLE_COMMANDS: BattleCommandDefinition[] = [
  {
    type: 'attack',
    icon: BattleAssets.icons.attack,
    label: 'Attack',
    style: 'primary',
    enabled: (ctx) => isActionEnabled(ctx, 'attack'),
    selected: (state, type) => isActionSelected(state, type),
  },
  {
    type: 'item',
    icon: BattleAssets.icons.item,
    label: 'Item',
    style: 'success',
    enabled: (ctx) => isActionEnabled(ctx, 'item'),
    selected: (state, type) => isActionSelected(state, type),
  },
  {
    type: 'move',
    icon: BattleAssets.icons.move,
    label: 'Move',
    style: 'neutral',
    enabled: (ctx) => isActionEnabled(ctx, 'move'),
    selected: (state, type) => isActionSelected(state, type),
  },
  {
    type: 'skill',
    icon: BattleAssets.icons.skill,
    label: 'Skill',
    style: 'magic',
    enabled: (ctx) => isActionEnabled(ctx, 'skill'),
    selected: (state, type) => isActionSelected(state, type),
  },
  {
    type: 'end_turn',
    icon: BattleAssets.icons.endTurn,
    label: 'End Turn',
    style: 'warning',
    enabled: (ctx) => isActionEnabled(ctx, 'end_turn'),
    selected: (state, type) => isActionSelected(state, type),
  },
];

export type BattleCommandHandlers = Record<BattleActionType, () => void>;

export const DEFAULT_COMMAND_HANDLERS: BattleCommandHandlers = {
  attack: () => {},
  item: () => {},
  move: () => {},
  skill: () => {},
  end_turn: () => {},
};
