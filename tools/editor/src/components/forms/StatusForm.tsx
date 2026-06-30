import type { StatusBehavior } from '@dawn/types';
import { BehaviorBuilder } from '../BehaviorBuilder';

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

export function StatusForm({
  draft,
  onChange,
}: {
  draft: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const set = (key: string, value: unknown) => onChange({ ...draft, [key]: value });
  const behaviors = (draft.behaviors as StatusBehavior[] | undefined) ?? [];

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
        Duration{' '}
        <input
          style={input}
          type="number"
          value={Number(draft.duration ?? 1)}
          onChange={(e) => set('duration', Number(e.target.value))}
        />
      </label>
      <label style={field}>
        Stackable{' '}
        <input
          type="checkbox"
          checked={Boolean(draft.stackable)}
          onChange={(e) => set('stackable', e.target.checked)}
        />
      </label>
      <label style={field}>
        Max Stacks{' '}
        <input
          style={input}
          type="number"
          value={Number(draft.maxStacks ?? 1)}
          onChange={(e) => set('maxStacks', Number(e.target.value))}
        />
      </label>
      <label style={field}>
        iconId{' '}
        <input
          style={input}
          value={String(draft.iconId ?? '')}
          onChange={(e) => set('iconId', e.target.value)}
        />
      </label>
      <h3>Behaviors</h3>
      <BehaviorBuilder behaviors={behaviors} onChange={(b) => set('behaviors', b)} />
    </div>
  );
}
