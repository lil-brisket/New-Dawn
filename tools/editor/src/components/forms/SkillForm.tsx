import type { SkillEffect, TargetSelector } from '@dawn/types';
import { CostEditor } from '../fields/CostEditor';
import { MetadataSection } from '../fields/MetadataSection';
import { NumberField } from '../fields/NumberField';
import { TargetingEditor } from '../fields/TargetingEditor';
import { ValidationMessage } from '../fields/ValidationMessage';
import { field, input, sectionTitle } from '../fields/styles';
import type { FlatCosts } from '../fields/costAdapter';
import { useSkillOptions } from '../../hooks/useContentOptions';
import { issueAt, useDraftValidation } from '../../hooks/useDraftValidation';
import { EffectBuilder } from '../EffectBuilder/EffectBuilder';

function formatCosts(costs: FlatCosts): string {
  const parts: string[] = [];
  if ((costs.hpCost ?? 0) > 0) parts.push(`HP ${costs.hpCost}`);
  if ((costs.spCost ?? 0) > 0) parts.push(`SP ${costs.spCost}`);
  if ((costs.apCost ?? 0) > 0) parts.push(`AP ${costs.apCost}`);
  return parts.length > 0 ? parts.join(' · ') : 'Free';
}

export function SkillPreview({ draft }: { draft: Record<string, unknown> }) {
  const effects = (draft.effects as SkillEffect[] | undefined) ?? [];
  const targeting = draft.targeting as TargetSelector | undefined;
  const costs: FlatCosts = {
    hpCost: Number(draft.hpCost ?? 0),
    spCost: Number(draft.spCost ?? 0),
    apCost: Number(draft.apCost ?? 0),
  };

  return (
    <div style={{ background: '#252530', borderRadius: 8, padding: 16, fontSize: 13 }}>
      <h3 style={{ margin: '0 0 4px' }}>{String(draft.name ?? 'Skill')}</h3>
      <div style={{ color: '#888', marginBottom: 12 }}>
        {[draft.element, draft.category].filter(Boolean).join(' · ') || '—'}
      </div>
      <p style={{ margin: '0 0 12px', color: '#aaa', fontSize: 12 }}>
        {String(draft.description ?? '')}
      </p>
      <div style={{ marginBottom: 8 }}>
        <strong>Costs:</strong> {formatCosts(costs)}
        {Number(draft.cooldown ?? 0) > 0 && ` · CD ${draft.cooldown}`}
      </div>
      {targeting && (
        <div style={{ marginBottom: 8 }}>
          <strong>Range:</strong> {'range' in targeting ? targeting.range : 0}
          {targeting.type === 'area' && ` · Area radius ${targeting.radius}`}
        </div>
      )}
      <div>
        <strong>Effects</strong>
        {effects.map((e, i) => (
          <div key={i} style={{ padding: '4px 0', borderTop: '1px solid #333', color: '#ccc' }}>
            {e.type === 'damage' &&
              `Damage — base ${e.value.base} + ${e.value.terms.map((t) => `${t.key}×${t.ratio}`).join(', ')} (${e.element})`}
            {e.type === 'heal' &&
              `Heal — base ${e.value.base} + ${e.value.terms.map((t) => `${t.key}×${t.ratio}`).join(', ')}`}
            {e.type === 'apply_status' &&
              `Apply ${e.statusId} — ${Math.round(e.chance * 100)}%${e.duration !== undefined ? ` · ${e.duration} turns` : ''}`}
            {e.type === 'move' && `Move — ${e.range}`}
            {e.type === 'teleport' && `Teleport — ${e.range}`}
            {e.type === 'summon' && `Summon — ${e.entityDefinitionId}`}
          </div>
        ))}
      </div>
      {Boolean(draft.vfxId) && (
        <div style={{ marginTop: 12, fontSize: 11, color: '#666' }}>
          Animation: {String(draft.vfxId)}
        </div>
      )}
    </div>
  );
}

export function SkillForm({
  draft,
  onChange,
}: {
  draft: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const set = (key: string, value: unknown) => onChange({ ...draft, [key]: value });
  const skillOptions = useSkillOptions();
  const issues = useDraftValidation('skills', draft);
  const targeting = (draft.targeting as TargetSelector) ?? { type: 'single_enemy', range: 1 };
  const effects = (draft.effects as SkillEffect[] | undefined) ?? [];
  const costs: FlatCosts = {
    hpCost: Number(draft.hpCost ?? 0),
    spCost: Number(draft.spCost ?? 0),
    apCost: Number(draft.apCost ?? 0),
  };

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
        inheritOptions={skillOptions.filter((s) => s.id !== draft.id)}
        inheritDomain="skills"
      />

      <section>
        <CostEditor
          costs={costs}
          onChange={(c) =>
            onChange({
              ...draft,
              hpCost: c.hpCost ?? 0,
              spCost: c.spCost ?? 0,
              apCost: c.apCost ?? 0,
            })
          }
        />
        <NumberField
          label="Cooldown"
          value={Number(draft.cooldown ?? 0)}
          min={0}
          onChange={(v) => set('cooldown', v)}
        />
      </section>

      <TargetingEditor targeting={targeting} onChange={(t) => set('targeting', t)} />
      {issueAt(issues, 'targeting') && (
        <ValidationMessage message={issueAt(issues, 'targeting')!} />
      )}

      <section>
        <h3 style={sectionTitle}>Effects</h3>
        <EffectBuilder effects={effects} onChange={(e) => set('effects', e)} />
      </section>

      <section>
        <h3 style={sectionTitle}>Assets</h3>
        <label style={field}>
          vfxId{' '}
          <input
            style={input}
            value={String(draft.vfxId ?? '')}
            onChange={(e) => set('vfxId', e.target.value)}
          />
        </label>
        <label style={field}>
          sfxId{' '}
          <input
            style={input}
            value={String(draft.sfxId ?? '')}
            onChange={(e) => set('sfxId', e.target.value)}
          />
        </label>
      </section>

      <details style={{ marginTop: 16, opacity: 0.5 }}>
        <summary style={{ cursor: 'pointer', color: '#666' }}>Conditions (coming soon)</summary>
        <p style={{ fontSize: 12, color: '#555' }}>
          HP thresholds, required statuses, target tags, adjacency, boss-only — reserved for a
          future pass.
        </p>
      </details>

      {issues.length > 0 && (
        <div style={{ marginTop: 16, padding: 12, background: '#2a2218', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#e6a23c', marginBottom: 4 }}>Validation</div>
          {issues.slice(0, 5).map((i) => (
            <ValidationMessage key={i.path} message={`${i.path}: ${i.message}`} />
          ))}
        </div>
      )}
    </div>
  );
}
