export interface BattleUIEvent {
  readonly id: string;
  readonly type: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly color: string;
  readonly priority: number;
  readonly timestamp: number;
  readonly round: number;
  readonly payload: Record<string, unknown>;
  readonly duration?: number;
}

export type BattleLogCard = BattleUIEvent;

export type BattleUIEventHandler = (event: BattleUIEvent) => void;
