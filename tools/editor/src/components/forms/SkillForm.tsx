import type { ElementType, SkillEffect, TargetSelector } from '@dawn/types';
import type { ShapeType } from '../fields/constants';
import { formatElementLabel, hasDisplayElement } from '../fields/elementUtils';
import { CostEditor } from '../fields/CostEditor';
import { IdField } from '../fields/IdField';
import { MetadataSection } from '../fields/MetadataSection';
import { NumberField } from '../fields/NumberField';
import { TargetingEditor } from '../fields/TargetingEditor';
import { ValidationMessage } from '../fields/ValidationMessage';
import { field, fieldGrid, input, sectionCard, sectionTitle } from '../fields/styles';
import type { FlatCosts } from '../fields/costAdapter';
import { issueAt, useDraftValidation } from '../../hooks/useDraftValidation';
import { EffectBuilder } from '../EffectBuilder/EffectBuilder';
import { applyNameWithId } from '../../utils/contentId';

function formatCosts(costs: FlatCosts): string {
  return `HP ${costs.hpCost ?? 0} · SP ${costs.spCost ?? 0} · AP ${costs.apCost ?? 0}`;
}

function formatTerms(effect: SkillEffect): string {
  if (effect.type !== 'damage' && effect.type !== 'heal') return '';
  const terms = effect.value.terms.map((t) => t.key).join(', ');
  return `base ${effect.value.base}${terms ? ` + ${terms}` : ''}`;
}

export function SkillPreview({ draft }: { draft: Record<string, unknown> }) {
  const effects = (draft.effects as SkillEffect[] | undefined) ?? [];
  const targeting = draft.targeting as TargetSelector | undefined;
  const shapeType = (draft.shapeType as ShapeType | undefined) ?? 'aoe';
  const costs: FlatCosts = {
    hpCost: Number(draft.hpCost ?? 0),
    spCost: Number(draft.spCost ?? 0),
    apCost: Number(draft.apCost ?? 0),
  };

  return (
    <div
      style={{
        background: '#1e1e28',
        borderRadius: 12,
        padding: 16,
        fontSize: 13,
        border: '1px solid #2e2e3a',
        position: 'sticky',
        top: 16,
      }}
    >
      <h3 style={{ margin: '0 0 4px' }}>{String(draft.name ?? 'Skill')}</h3>
      <div style={{ color: '#9aa0b4', marginBottom: 12 }}>
        {formatElementLabel(draft.element)} · {shapeType.toUpperCase()}
      </div>
      <p style={{ margin: '0 0 12px', color: '#aaa', fontSize: 12 }}>
        {String(draft.description ?? '')}
      </p>
      <div style={{ marginBottom: 8 }}>
        <strong>Costs:</strong> {formatCosts(costs)}
        {` · CD ${draft.cooldown ?? 0} turns`}
      </div>
      {targeting && (
        <div style={{ marginBottom: 8 }}>
          <strong>Range:</strong> {'range' in targeting ? targeting.range : 0}
        </div>
      )}
      <div>
        <strong>Effects</strong>
        {effects.map((e, i) => (
          <div key={i} style={{ padding: '6px 0', borderTop: '1px solid #2e2e3a', color: '#ccc' }}>
            {e.type === 'damage' &&
              `Damage — ${formatTerms(e)}${hasDisplayElement(e.element) ? ` (${formatElementLabel(e.element)})` : ''}${e.pierce ? ' · Pierce' : ''}`}
            {e.type === 'heal' && `Heal — ${formatTerms(e)}`}
            {e.type === 'apply_status' && `Status ${e.statusId}`}
            {e.type === 'shield' &&
              `Shield — ${e.value.base}${e.value.terms.length ? ` + ${e.value.terms.map((t) => t.key).join(', ')}` : ''} · ${e.duration ?? 2} turns`}
            {e.type === 'move' && `Move — ${e.range}`}
            {e.type === 'summon' && `Summon — ${e.entityDefinitionId}`}
          </div>
        ))}
      </div>
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
  const issues = useDraftValidation('skills', draft);
  const targeting = (draft.targeting as TargetSelector) ?? { type: 'single_enemy', range: 1 };
  const shapeType = (draft.shapeType as ShapeType | undefined) ?? 'aoe';
  const effects = (draft.effects as SkillEffect[] | undefined) ?? [];
  const costs: FlatCosts = {
    hpCost: Number(draft.hpCost ?? 0),
    spCost: Number(draft.spCost ?? 0),
    apCost: Number(draft.apCost ?? 0),
  };

  return (
    <div>
      <section style={sectionCard}>
        <h3 style={sectionTitle}>Identity</h3>
        <div style={fieldGrid}>
          <IdField domain="skills" value={String(draft.id ?? '')} />
          <label style={field}>
            Name
            <input
              style={input}
              value={String(draft.name ?? '')}
              onChange={(e) => onChange(applyNameWithId(draft, e.target.value, 'skill'))}
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
          label="Cooldown (turns)"
          value={Number(draft.cooldown ?? 0)}
          min={0}
          onChange={(v) => set('cooldown', v)}
        />
      </section>

      <TargetingEditor
        targeting={targeting}
        shapeType={shapeType}
        onChange={(t) => set('targeting', t)}
        onShapeChange={(shape) => set('shapeType', shape)}
      />
      {issueAt(issues, 'targeting') && (
        <ValidationMessage message={issueAt(issues, 'targeting')!} />
      )}

      <section style={sectionCard}>
        <h3 style={sectionTitle}>Effects</h3>
        <EffectBuilder
          effects={effects}
          skillElement={draft.element as ElementType | undefined}
          onChange={(e) => set('effects', e)}
        />
      </section>

      {issues.length > 0 && (
        <div style={{ marginTop: 16, padding: 12, background: '#2a2218', borderRadius: 10 }}>
          <div style={{ fontSize: 12, color: '#e6a23c', marginBottom: 4 }}>Validation</div>
          {issues.slice(0, 5).map((i) => (
            <ValidationMessage key={i.path} message={`${i.path}: ${i.message}`} />
          ))}
        </div>
      )}
    </div>
  );
}
