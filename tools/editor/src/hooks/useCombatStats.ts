import { useEffect, useState } from 'react';

interface CombatStatsResponse {
  stats: { id: string; label: string }[];
  formulas: unknown;
}

let cachedStatIds: string[] | null = null;

export function useCombatStatOptions(): string[] {
  const [ids, setIds] = useState<string[]>(
    cachedStatIds ?? ['attack', 'defense', 'speed', 'willpower', 'resistance'],
  );

  useEffect(() => {
    if (cachedStatIds) return;
    fetch('/api/content/config/combat_stats')
      .then((r) => r.json())
      .then((data: CombatStatsResponse) => {
        cachedStatIds = data.stats.map((s) => s.id);
        setIds(cachedStatIds);
      })
      .catch(() => {});
  }, []);

  return ids;
}

export function useCombatStatsConfig() {
  const [config, setConfig] = useState<CombatStatsResponse | null>(null);

  useEffect(() => {
    fetch('/api/content/config/combat_stats')
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => {});
  }, []);

  return config;
}
