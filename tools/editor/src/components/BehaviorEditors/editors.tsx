import type { ElementType, TagBehavior } from '@dawn/types';
import { EnumSelect } from '../fields/EnumSelect';
import { FormulaEditor } from '../fields/FormulaEditor';
import { NumberField } from '../fields/NumberField';
import { EFFECT_ELEMENT_OPTIONS, STAT_MOD_MODES, TRIGGER_EVENTS } from '../fields/constants';
import { field } from '../fields/styles';
import { useCombatStatOptions } from '../../hooks/useCombatStats';
import { EffectBuilder } from '../EffectBuilder/EffectBuilder';

const defaultFormula = {
  base: 0,
  terms: [{ source: 'stat' as const, key: 'attack', ratio: 1 }],
};

const defaultPercent = {
  base: 0.1,
  terms: [{ source: 'stat' as const, key: 'willpower', ratio: 0.01 }],
};

function InstantDamageEditor({
  behavior,
  onChange,
}: {
  behavior: Extract<TagBehavior, { type: 'instant_damage' }>;
  onChange: (b: TagBehavior) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={field}>
        Element
        <EnumSelect
          value={behavior.element}
          options={EFFECT_ELEMENT_OPTIONS}
          onChange={(v) => onChange({ ...behavior, element: (v || 'physical') as ElementType })}
        />
      </label>
      <FormulaEditor
        label="Damage"
        value={behavior.value}
        onChange={(value) => onChange({ ...behavior, value })}
      />
      <label style={field}>
        <input
          type="checkbox"
          checked={behavior.pierce ?? false}
          onChange={(e) => onChange({ ...behavior, pierce: e.target.checked })}
        />{' '}
        Pierce defense
      </label>
    </div>
  );
}

function InstantHealEditor({
  behavior,
  onChange,
}: {
  behavior: Extract<TagBehavior, { type: 'instant_heal' }>;
  onChange: (b: TagBehavior) => void;
}) {
  return (
    <FormulaEditor
      label="Heal amount"
      value={behavior.value}
      onChange={(value) => onChange({ ...behavior, value })}
    />
  );
}

function ShieldGrantEditor({
  behavior,
  onChange,
}: {
  behavior: Extract<TagBehavior, { type: 'shield_grant' }>;
  onChange: (b: TagBehavior) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <FormulaEditor
        label="Shield value"
        value={behavior.value}
        onChange={(value) => onChange({ ...behavior, value })}
      />
      <NumberField
        label="Duration (turns)"
        value={behavior.duration ?? 2}
        min={1}
        max={2}
        onChange={(duration) => onChange({ ...behavior, duration })}
      />
    </div>
  );
}

function RangeBehaviorEditor({
  behavior,
  onChange,
  label,
}: {
  behavior: Extract<TagBehavior, { type: 'move' | 'teleport' }>;
  onChange: (b: TagBehavior) => void;
  label: string;
}) {
  return (
    <NumberField
      label={label}
      value={behavior.range}
      min={0}
      onChange={(range) => onChange({ ...behavior, range })}
    />
  );
}

function SummonEditor({
  behavior,
  onChange,
}: {
  behavior: Extract<TagBehavior, { type: 'summon' }>;
  onChange: (b: TagBehavior) => void;
}) {
  return (
    <label style={field}>
      Entity definition ID
      <input
        style={{ width: '100%' }}
        value={behavior.entityDefinitionId}
        onChange={(e) => onChange({ ...behavior, entityDefinitionId: e.target.value })}
      />
    </label>
  );
}

function PercentBehaviorEditor({
  behavior,
  onChange,
  label,
}: {
  behavior: Extract<TagBehavior, { type: 'absorb' | 'lifesteal' | 'reflect' }>;
  onChange: (b: TagBehavior) => void;
  label: string;
}) {
  return (
    <FormulaEditor
      label={label}
      value={behavior.percent}
      onChange={(percent) => onChange({ ...behavior, percent })}
    />
  );
}

export function DotEditor({
  behavior,
  onChange,
}: {
  behavior: Extract<TagBehavior, { type: 'dot' }>;
  onChange: (b: TagBehavior) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={field}>
        Element
        <EnumSelect
          value={behavior.element ?? ''}
          options={EFFECT_ELEMENT_OPTIONS}
          onChange={(v) => onChange({ ...behavior, element: (v || 'fire') as ElementType })}
        />
      </label>
      <FormulaEditor
        label="Damage per turn"
        value={behavior.damagePerTurn}
        onChange={(damagePerTurn) => onChange({ ...behavior, damagePerTurn })}
      />
    </div>
  );
}

export function ControlEditor({
  behavior,
  onChange,
}: {
  behavior: Extract<TagBehavior, { type: 'control' }>;
  onChange: (b: TagBehavior) => void;
}) {
  return (
    <label style={field}>
      Effect
      <EnumSelect
        value={behavior.effect}
        options={[
          { value: 'stun', label: 'Stun' },
          { value: 'bind', label: 'Bind' },
        ]}
        onChange={(v) => v && onChange({ ...behavior, effect: v })}
      />
    </label>
  );
}

export function StatModEditor({
  behavior,
  onChange,
}: {
  behavior: Extract<TagBehavior, { type: 'stat_mod' }>;
  onChange: (b: TagBehavior) => void;
}) {
  const statOptions = useCombatStatOptions();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={field}>
        Stat
        <EnumSelect
          value={behavior.stat}
          options={statOptions}
          onChange={(v) => v && onChange({ ...behavior, stat: v })}
        />
      </label>
      <label style={field}>
        Mode
        <EnumSelect
          value={behavior.mode}
          options={[...STAT_MOD_MODES]}
          onChange={(v) => v && onChange({ ...behavior, mode: v })}
        />
      </label>
      <FormulaEditor
        label="Value per stack"
        value={behavior.value}
        onChange={(value) => onChange({ ...behavior, value })}
      />
    </div>
  );
}

export function TriggerEditor({
  behavior,
  onChange,
}: {
  behavior: Extract<TagBehavior, { type: 'trigger' }>;
  onChange: (b: TagBehavior) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={field}>
        Event
        <EnumSelect
          value={behavior.event}
          options={[...TRIGGER_EVENTS]}
          onChange={(v) => v && onChange({ ...behavior, event: v })}
        />
      </label>
      <div>
        <span style={{ fontSize: 12, color: '#9aa0b4' }}>Trigger effect</span>
        <EffectBuilder
          single
          effects={[behavior.effect]}
          onChange={(effects) => {
            const effect = effects[0];
            if (effect) onChange({ ...behavior, effect });
          }}
        />
      </div>
    </div>
  );
}

export function createDefaultBehavior(type: TagBehavior['type']): TagBehavior {
  switch (type) {
    case 'instant_damage':
      return { type: 'instant_damage', element: 'physical', value: defaultFormula };
    case 'instant_heal':
      return { type: 'instant_heal', value: defaultFormula };
    case 'shield_grant':
      return { type: 'shield_grant', value: defaultFormula, duration: 2 };
    case 'move':
      return { type: 'move', range: 3 };
    case 'teleport':
      return { type: 'teleport', range: 3 };
    case 'summon':
      return { type: 'summon', entityDefinitionId: 'enemy_goblin' };
    case 'dot':
      return {
        type: 'dot',
        element: 'fire',
        damagePerTurn: { base: 5, terms: [{ source: 'stat', key: 'attack', ratio: 1 }] },
      };
    case 'stat_mod':
      return {
        type: 'stat_mod',
        stat: 'attack',
        mode: 'flat',
        value: { base: 10, terms: [{ source: 'stat', key: 'willpower', ratio: 1 }] },
      };
    case 'control':
      return { type: 'control', effect: 'stun' };
    case 'trigger':
      return {
        type: 'trigger',
        event: 'on_turn_start',
        effect: { type: 'apply_tag', tagId: 'tag_damage', chance: 1 },
      };
    case 'absorb':
      return { type: 'absorb', percent: defaultPercent };
    case 'lifesteal':
      return { type: 'lifesteal', percent: defaultPercent };
    case 'reflect':
      return { type: 'reflect', percent: defaultPercent };
    case 'clear':
      return { type: 'clear', polarity: 'positive' };
    case 'cleanse':
      return { type: 'cleanse', polarity: 'negative' };
  }
}

export function BehaviorFields({
  behavior,
  onChange,
}: {
  behavior: TagBehavior;
  onChange: (b: TagBehavior) => void;
}) {
  switch (behavior.type) {
    case 'instant_damage':
      return <InstantDamageEditor behavior={behavior} onChange={onChange} />;
    case 'instant_heal':
      return <InstantHealEditor behavior={behavior} onChange={onChange} />;
    case 'shield_grant':
      return <ShieldGrantEditor behavior={behavior} onChange={onChange} />;
    case 'move':
      return <RangeBehaviorEditor behavior={behavior} onChange={onChange} label="Move range" />;
    case 'teleport':
      return <RangeBehaviorEditor behavior={behavior} onChange={onChange} label="Teleport range" />;
    case 'summon':
      return <SummonEditor behavior={behavior} onChange={onChange} />;
    case 'dot':
      return <DotEditor behavior={behavior} onChange={onChange} />;
    case 'control':
      return <ControlEditor behavior={behavior} onChange={onChange} />;
    case 'stat_mod':
      return <StatModEditor behavior={behavior} onChange={onChange} />;
    case 'trigger':
      return <TriggerEditor behavior={behavior} onChange={onChange} />;
    case 'absorb':
      return (
        <PercentBehaviorEditor behavior={behavior} onChange={onChange} label="Absorb percent" />
      );
    case 'lifesteal':
      return (
        <PercentBehaviorEditor behavior={behavior} onChange={onChange} label="Life steal percent" />
      );
    case 'reflect':
      return (
        <PercentBehaviorEditor behavior={behavior} onChange={onChange} label="Reflect percent" />
      );
    case 'clear':
      return <p style={{ fontSize: 12, color: '#9aa0b4' }}>Dispels positive tags on apply.</p>;
    case 'cleanse':
      return <p style={{ fontSize: 12, color: '#9aa0b4' }}>Dispels negative tags on apply.</p>;
  }
}
