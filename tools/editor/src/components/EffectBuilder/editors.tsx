import type { SkillEffect } from '@dawn/types';
import { EnumSelect } from '../fields/EnumSelect';
import { NumberField } from '../fields/NumberField';
import { ContentRefSelect } from '../fields/ContentRefSelect';
import { ELEMENTS } from '../fields/constants';
import { useStatusOptions } from '../../hooks/useContentOptions';

export function DamageEffectEditor({
  effect,
  onChange,
}: {
  effect: Extract<SkillEffect, { type: 'damage' }>;
  onChange: (e: SkillEffect) => void;
}) {
  return (
    <>
      <label>
        Element{' '}
        <EnumSelect
          value={effect.element}
          options={[...ELEMENTS]}
          onChange={(v) => v && onChange({ ...effect, element: v })}
        />
      </label>
      <NumberField
        label="Multiplier"
        value={effect.multiplier}
        step={0.1}
        onChange={(multiplier) => onChange({ ...effect, multiplier })}
      />
      <NumberField
        label="Flat bonus"
        value={effect.flatBonus ?? 0}
        onChange={(flatBonus) => onChange({ ...effect, flatBonus: flatBonus || undefined })}
      />
    </>
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
    <>
      <NumberField
        label="Multiplier"
        value={effect.multiplier}
        step={0.1}
        onChange={(multiplier) => onChange({ ...effect, multiplier })}
      />
      <NumberField
        label="Flat bonus"
        value={effect.flatBonus ?? 0}
        onChange={(flatBonus) => onChange({ ...effect, flatBonus: flatBonus || undefined })}
      />
    </>
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
  const useDefault = effect.duration === undefined;

  return (
    <>
      <ContentRefSelect
        value={effect.statusId}
        options={statusOptions}
        onChange={(id) => id && onChange({ ...effect, statusId: id })}
      />
      <NumberField
        label="Chance (0–1)"
        value={effect.chance}
        min={0}
        max={1}
        step={0.05}
        onChange={(chance) => onChange({ ...effect, chance })}
      />
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={useDefault}
          onChange={(e) => {
            if (e.target.checked) {
              const { duration: _d, ...rest } = effect;
              onChange(rest as SkillEffect);
            } else {
              onChange({ ...effect, duration: 3 });
            }
          }}
        />
        Use status default duration
      </label>
      {!useDefault && (
        <NumberField
          label="Override turns"
          value={effect.duration ?? 1}
          min={0}
          onChange={(duration) => onChange({ ...effect, duration })}
        />
      )}
    </>
  );
}

export function RangeEffectEditor({
  effect,
  onChange,
}: {
  effect: Extract<SkillEffect, { type: 'move' | 'teleport' }>;
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
    <label>
      Entity ID{' '}
      <input
        value={effect.entityDefinitionId}
        onChange={(e) => onChange({ ...effect, entityDefinitionId: e.target.value })}
      />
    </label>
  );
}

export function createDefaultEffect(type: SkillEffect['type']): SkillEffect {
  switch (type) {
    case 'damage':
      return { type: 'damage', element: 'physical', multiplier: 1 };
    case 'heal':
      return { type: 'heal', multiplier: 1 };
    case 'apply_status':
      return { type: 'apply_status', statusId: 'status_burn', chance: 0.3 };
    case 'move':
      return { type: 'move', range: 1 };
    case 'teleport':
      return { type: 'teleport', range: 1 };
    case 'summon':
      return { type: 'summon', entityDefinitionId: 'enemy_goblin' };
  }
}
