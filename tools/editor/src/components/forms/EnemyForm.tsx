import type { BaseStats } from '@dawn/types';
import { StatsForm } from '../StatsForm';
import { MetadataSection } from '../fields/MetadataSection';
import { ContentRefMultiSelect } from '../fields/ContentRefSelect';
import { EnumSelect } from '../fields/EnumSelect';
import { ELEMENTS } from '../fields/constants';
import { field, input, sectionTitle } from '../fields/styles';
import { useSkillOptions } from '../../hooks/useContentOptions';
import { useDraftValidation } from '../../hooks/useDraftValidation';
import { ValidationMessage } from '../fields/ValidationMessage';

export function EnemyForm({
  draft,
  onChange,
}: {
  draft: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const set = (key: string, value: unknown) => onChange({ ...draft, [key]: value });
  const skillIds = (draft.skillIds as string[] | undefined) ?? [];
  const baseStats = (draft.baseStats as Partial<BaseStats> | undefined) ?? {};
  const skillOptions = useSkillOptions();
  const issues = useDraftValidation('enemies', draft);

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

      <MetadataSection draft={draft} onChange={onChange} />

      <section>
        <h3 style={sectionTitle}>Combat</h3>
        <label style={field}>
          Element{' '}
          <EnumSelect
            value={String(draft.element ?? '')}
            options={[...ELEMENTS]}
            allowEmpty
            onChange={(v) => set('element', v)}
          />
        </label>
        <ContentRefMultiSelect
          value={skillIds}
          options={skillOptions}
          onChange={(ids) => set('skillIds', ids)}
        />
        <StatsForm stats={baseStats} onChange={(s) => set('baseStats', s)} />
      </section>

      <section>
        <h3 style={sectionTitle}>Assets &amp; AI</h3>
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
