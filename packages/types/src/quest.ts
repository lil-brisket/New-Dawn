export interface QuestObjective {
  id: string;
  description: string;
  current: number;
  target: number;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  rewards: string[];
  status: 'available' | 'active' | 'completed' | 'failed';
}
