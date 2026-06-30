export type BattleCommandState =
  | 'idle'
  | 'selecting_move'
  | 'selecting_attack'
  | 'selecting_skill'
  | 'waiting_for_target'
  | 'enemy_turn'
  | 'victory'
  | 'defeat'
  | 'animation_locked';

export type BattleActionType = 'attack' | 'item' | 'move' | 'skill' | 'end_turn';
