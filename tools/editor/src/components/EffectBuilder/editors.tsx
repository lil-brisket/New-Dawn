import type { ElementType, SkillEffect } from '@dawn/types';
import { NumberField } from '../fields/NumberField';
import { ContentRefSelect } from '../fields/ContentRefSelect';
import { FormulaEditor } from '../fields/FormulaEditor';
import { skillElementToDamageElement } from '../fields/elementUtils';
import { field } from '../fields/styles';
import { useStatusOptions } from '../../hooks/useContentOptions';

const DEFAULT_DAMAGE_VALUE = {
  base: 0,
  terms: [{ source: 'stat' as const, key: 'attack', ratio: 1 }],
};

export function DamageEffectEditor({
  effect,
  onChange,
}: {
  effect: Extract<SkillEffect, { type: 'damage' }>;
  onChange: (e: SkillEffect) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
        <input
          type="checkbox"
          checked={effect.pierce === true}
          onChange={(e) => onChange({ ...effect, pierce: e.target.checked ? true : undefined })}
        />
        Pierce — pure damage, breaks shields
      </label>
      <FormulaEditor
        label="Damage"
        value={effect.value}
        onChange={(value) => onChange({ ...effect, value })}
      />
    </div>
  );
}

export function ShieldEffectEditor({
  effect,
  onChange,
}: {
  effect: Extract<SkillEffect, { type: 'shield' }>;
  onChange: (e: SkillEffect) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <FormulaEditor
        label="Shield HP"
        value={effect.value}
        onChange={(value) => onChange({ ...effect, value })}
      />
      <NumberField
        label="Duration (turns, max 2)"
        value={effect.duration ?? 2}
        min={1}
        max={2}
        onChange={(duration) => onChange({ ...effect, duration })}
      />
    </div>
  );
}

export function HealEffectEditor({
  effect,
  onChange,
}: {
  effect: Extract<SkillEffect, { type: 'heal' }>;
  onChange: (e: SkillEffect) => void;
}) {
  return (
    <FormulaEditor
      label="Heal"
      value={effect.value}
      onChange={(value) => onChange({ ...effect, value })}
    />
  );
}

export function ApplyStatusEffectEditor({
  effect,
  onChange,
}: {
  effect: Extract<SkillEffect, { type: 'apply_status' }>;
  onChange: (e: SkillEffect) => void;
}) {
  const statusOptions = useStatusOptions();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ContentRefSelect
        value={effect.statusId}
        options={statusOptions}
        onChange={(id) => id && onChange({ ...effect, statusId: id })}
      />
    </div>
  );
}

export function RangeEffectEditor({
  effect,
  onChange,
}: {
  effect: Extract<SkillEffect, { type: 'move' }>;
  onChange: (e: SkillEffect) => void;
}) {
  return (
    <NumberField
      label="Range"
      value={effect.range}
      min={0}
      onChange={(range) => onChange({ ...effect, range })}
    />
  );
}

export function SummonEffectEditor({
  effect,
  onChange,
}: {
  effect: Extract<SkillEffect, { type: 'summon' }>;
  onChange: (e: SkillEffect) => void;
}) {
  return (
    <label style={field}>
      Entity ID
      <input
        style={{
          marginTop: 4,
          width: '100%',
          padding: '8px 10px',
          borderRadius: 8,
          border: '1px solid #3a3a48',
          background: '#16161e',
          color: '#eee',
        }}
        value={effect.entityDefinitionId}
        onChange={(e) => onChange({ ...effect, entityDefinitionId: e.target.value })}
        placeholder="enemy_id"
      />
    </label>
  );
}

export function createDefaultEffect(
  type: SkillEffect['type'],
  skillElement?: ElementType,
): SkillEffect {
  switch (type) {
    case 'damage':
      return {
        type: 'damage',
        element: skillElementToDamageElement(skillElement),
        value: DEFAULT_DAMAGE_VALUE,
      };
    case 'heal':
      return {
        type: 'heal',
        value: { base: 0, terms: [{ source: 'stat', key: 'willpower', ratio: 1 }] },
      };
    case 'apply_status':
      return { type: 'apply_status', statusId: 'status_burn', chance: 1 };
    case 'shield':
      return {
        type: 'shield',
        value: { base: 20, terms: [{ source: 'stat', key: 'willpower', ratio: 1 }] },
        duration: 2,
      };
    case 'move':
      return { type: 'move', range: 1 };
    case 'summon':
      return { type: 'summon', entityDefinitionId: 'enemy_goblin' };
    case 'teleport':
      return { type: 'move', range: 1 };
  }
}
