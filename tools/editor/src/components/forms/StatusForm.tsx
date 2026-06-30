import type { StatusBehavior } from '@dawn/types';
import { BehaviorBuilder } from '../BehaviorEditors';
import { MetadataSection } from '../fields/MetadataSection';
import { NumberField } from '../fields/NumberField';
import { ValidationMessage } from '../fields/ValidationMessage';
import { field, input, sectionTitle } from '../fields/styles';
import { useStatusOptions } from '../../hooks/useContentOptions';
import { useDraftValidation } from '../../hooks/useDraftValidation';

export function StatusForm({
  draft,
  onChange,
}: {
  draft: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const set = (key: string, value: unknown) => onChange({ ...draft, [key]: value });
  const behaviors = (draft.behaviors as StatusBehavior[] | undefined) ?? [];
  const statusOptions = useStatusOptions();
  const issues = useDraftValidation('statuses', draft);

  return (
    <div>
      <section>
        <h3 style={sectionTitle}>Identity</h3>
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
      </section>

      <MetadataSection
        draft={draft}
        onChange={onChange}
        inheritOptions={statusOptions.filter((s) => s.id !== draft.id)}
        inheritDomain="statuses"
      />

      <section>
        <h3 style={sectionTitle}>Duration &amp; Stacks</h3>
        <p style={{ fontSize: 12, color: '#666', margin: '0 0 8px' }}>
          Turns remaining when applied
        </p>
        <NumberField
          label="Duration"
          value={Number(draft.duration ?? 1)}
          min={0}
          onChange={(v) => set('duration', v)}
          warning={Number(draft.duration ?? 1) < 0 ? 'Duration cannot be negative' : undefined}
        />
        <label style={field}>
          Stackable{' '}
          <input
            type="checkbox"
            checked={Boolean(draft.stackable)}
            onChange={(e) => set('stackable', e.target.checked)}
          />
        </label>
        <NumberField
          label="Max stacks"
          value={Number(draft.maxStacks ?? 1)}
          min={1}
          onChange={(v) => set('maxStacks', v)}
        />
      </section>

      <section>
        <h3 style={sectionTitle}>Behaviors</h3>
        <BehaviorBuilder behaviors={behaviors} onChange={(b) => set('behaviors', b)} />
      </section>

      {issues.length > 0 && (
        <div style={{ marginTop: 16, padding: 12, background: '#2a2218', borderRadius: 8 }}>
          {issues.slice(0, 5).map((i) => (
            <ValidationMessage key={i.path} message={`${i.path}: ${i.message}`} />
          ))}
        </div>
      )}
    </div>
  );
}
