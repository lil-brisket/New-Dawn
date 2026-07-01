import type { BaseStats } from '@dawn/types';

const fields: (keyof BaseStats)[] = [
  'hp',
  'maxHp',
  'mp',
  'maxMp',
  'attack',
  'defense',
  'speed',
  'willpower',
  'resistance',
];

export function StatsForm({
  stats,
  onChange,
}: {
  stats: Partial<BaseStats>;
  onChange: (s: Partial<BaseStats>) => void;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {fields.map((f) => (
        <label key={f} style={{ display: 'flex', flexDirection: 'column', fontSize: 13 }}>
          {f}
          <input
            type="number"
            step={1}
            value={stats[f] ?? ''}
            onChange={(e) => onChange({ ...stats, [f]: Number(e.target.value) })}
          />
        </label>
      ))}
    </div>
  );
}
