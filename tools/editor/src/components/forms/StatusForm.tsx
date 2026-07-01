import type { StatusBehavior } from '@dawn/types';
import { BehaviorBuilder } from '../BehaviorEditors';
import { IdField } from '../fields/IdField';
import { MetadataSection } from '../fields/MetadataSection';
import { NumberField } from '../fields/NumberField';
import { ValidationMessage } from '../fields/ValidationMessage';
import { EnumSelect } from '../fields/EnumSelect';
import { field, fieldGrid, input, sectionCard, sectionTitle } from '../fields/styles';
import { useDraftValidation } from '../../hooks/useDraftValidation';
import { applyNameWithId } from '../../utils/contentId';

export function StatusForm({
  draft,
  onChange,
}: {
  draft: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const set = (key: string, value: unknown) => onChange({ ...draft, [key]: value });
  const behaviors = (draft.behaviors as StatusBehavior[] | undefined) ?? [];
  const issues = useDraftValidation('statuses', draft);

  return (
    <div>
      <section style={sectionCard}>
        <h3 style={sectionTitle}>Identity</h3>
        <div style={fieldGrid}>
          <IdField domain="statuses" value={String(draft.id ?? '')} />
          <label style={field}>
            Name
            <input
              style={input}
              value={String(draft.name ?? '')}
              onChange={(e) => onChange(applyNameWithId(draft, e.target.value, 'status'))}
            />
          </label>
        </div>
        <label style={{ ...field, marginTop: 12 }}>
          Description
          <textarea
            style={{ ...input, minHeight: 72, resize: 'vertical' }}
            value={String(draft.description ?? '')}
            onChange={(e) => set('description', e.target.value)}
          />
        </label>
      </section>

      <MetadataSection draft={draft} onChange={onChange} />

      <section style={sectionCard}>
        <h3 style={sectionTitle}>Duration &amp; Stacks</h3>
        <div style={fieldGrid}>
          <NumberField
            label="Duration (turns)"
            value={Number(draft.duration ?? 1)}
            min={0}
            onChange={(v) => set('duration', v)}
            warning={Number(draft.duration ?? 1) < 0 ? 'Duration cannot be negative' : undefined}
          />
          <label style={field}>
            Stackable
            <EnumSelect
              value={draft.stackable ? 'yes' : 'no'}
              options={[
                { value: 'no', label: 'No' },
                { value: 'yes', label: 'Yes' },
              ]}
              onChange={(v) => set('stackable', v === 'yes')}
            />
          </label>
          <NumberField
            label="Max stacks"
            value={Number(draft.maxStacks ?? 1)}
            min={1}
            onChange={(v) => set('maxStacks', v)}
          />
        </div>
      </section>

      <section style={sectionCard}>
        <h3 style={sectionTitle}>Behaviors</h3>
        <BehaviorBuilder behaviors={behaviors} onChange={(b) => set('behaviors', b)} />
      </section>

      {issues.length > 0 && (
        <div style={{ marginTop: 16, padding: 12, background: '#2a2218', borderRadius: 10 }}>
          {issues.slice(0, 5).map((i) => (
            <ValidationMessage key={i.path} message={`${i.path}: ${i.message}`} />
          ))}
        </div>
      )}
    </div>
  );
}
