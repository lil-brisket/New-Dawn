import type { BaseStats } from '@dawn/types';
import { StatsForm } from '../StatsForm';

const field: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  marginBottom: 12,
};
const input: React.CSSProperties = {
  padding: '6px 8px',
  borderRadius: 4,
  border: '1px solid #444',
  background: '#1a1a22',
  color: '#eee',
};

export function EnemyForm({
  draft,
  onChange,
  skillOptions,
}: {
  draft: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
  skillOptions: string[];
}) {
  const set = (key: string, value: unknown) => onChange({ ...draft, [key]: value });
  const skillIds = (draft.skillIds as string[] | undefined) ?? [];
  const baseStats = (draft.baseStats as Partial<BaseStats> | undefined) ?? {};

  return (
    <div>
      <label style={field}>
        ID <input style={input} value={String(draft.id ?? '')} readOnly />
      </label>
      <label style={field}>
        Name{' '}
        <input
          style={input}
          value={String(draft.name ?? '')}
          onChange={(e) => set('name', e.target.value)}
        />
      </label>
      <label style={field}>
        Description{' '}
        <textarea
          style={input}
          value={String(draft.description ?? '')}
          onChange={(e) => set('description', e.target.value)}
        />
      </label>
      <label style={field}>
        portraitId{' '}
        <input
          style={input}
          value={String(draft.portraitId ?? '')}
          onChange={(e) => set('portraitId', e.target.value)}
        />
      </label>
      <label style={field}>
        spriteId{' '}
        <input
          style={input}
          value={String(draft.spriteId ?? '')}
          onChange={(e) => set('spriteId', e.target.value)}
        />
      </label>
      <label style={field}>
        Element{' '}
        <input
          style={input}
          value={String(draft.element ?? '')}
          onChange={(e) => set('element', e.target.value)}
        />
      </label>
      <label style={field}>
        AI Profile{' '}
        <input
          style={input}
          value={String(draft.aiProfileId ?? '')}
          onChange={(e) => set('aiProfileId', e.target.value)}
        />
      </label>
      <label style={field}>
        Loot Table{' '}
        <input
          style={input}
          value={String(draft.lootTableId ?? '')}
          onChange={(e) => set('lootTableId', e.target.value)}
        />
      </label>
      <h3>Skills</h3>
      <select
        multiple
        style={{ ...input, minHeight: 100, width: '100%' }}
        value={skillIds}
        onChange={(e) =>
          set(
            'skillIds',
            Array.from(e.target.selectedOptions).map((o) => o.value),
          )
        }
      >
        {skillOptions.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
      <h3>Base Stats</h3>
      <StatsForm stats={baseStats} onChange={(s) => set('baseStats', s)} />
    </div>
  );
}
