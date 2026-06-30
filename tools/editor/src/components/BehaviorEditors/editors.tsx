import type { StatusBehavior } from '@dawn/types';
import { EnumSelect } from '../fields/EnumSelect';
import { NumberField } from '../fields/NumberField';
import { ELEMENTS, STAT_MOD_MODES, TRIGGER_EVENTS } from '../fields/constants';
import { EffectBuilder } from '../EffectBuilder/EffectBuilder';

export function DotEditor({
  behavior,
  onChange,
}: {
  behavior: Extract<StatusBehavior, { type: 'dot' }>;
  onChange: (b: StatusBehavior) => void;
}) {
  return (
    <>
      <label>
        Element{' '}
        <EnumSelect
          value={behavior.element}
          options={[...ELEMENTS]}
          onChange={(v) => v && onChange({ ...behavior, element: v })}
        />
      </label>
      <NumberField
        label="Damage per stack"
        value={behavior.damagePerStack}
        onChange={(damagePerStack) => onChange({ ...behavior, damagePerStack })}
      />
    </>
  );
}

export function ControlEditor({
  behavior,
  onChange,
}: {
  behavior: Extract<StatusBehavior, { type: 'control' }>;
  onChange: (b: StatusBehavior) => void;
}) {
  return (
    <label>
      Effect{' '}
      <EnumSelect
        value={behavior.effect}
        options={['stun']}
        onChange={(v) => v && onChange({ ...behavior, effect: v })}
      />
    </label>
  );
}

export function StatModEditor({
  behavior,
  onChange,
}: {
  behavior: Extract<StatusBehavior, { type: 'stat_mod' }>;
  onChange: (b: StatusBehavior) => void;
}) {
  return (
    <>
      <label>
        Stat{' '}
        <EnumSelect
          value={behavior.stat}
          options={['attack', 'defense']}
          onChange={(v) => v && onChange({ ...behavior, stat: v })}
        />
      </label>
      <label>
        Mode{' '}
        <EnumSelect
          value={behavior.mode}
          options={[...STAT_MOD_MODES]}
          onChange={(v) => v && onChange({ ...behavior, mode: v })}
        />
      </label>
      <NumberField
        label="Amount per stack"
        value={behavior.amountPerStack}
        onChange={(amountPerStack) => onChange({ ...behavior, amountPerStack })}
      />
    </>
  );
}

export function TriggerEditor({
  behavior,
  onChange,
}: {
  behavior: Extract<StatusBehavior, { type: 'trigger' }>;
  onChange: (b: StatusBehavior) => void;
}) {
  return (
    <>
      <label>
        Event{' '}
        <EnumSelect
          value={behavior.event}
          options={[...TRIGGER_EVENTS]}
          onChange={(v) => v && onChange({ ...behavior, event: v })}
        />
      </label>
      <div style={{ marginTop: 8 }}>
        <strong>Trigger effect</strong>
        <EffectBuilder
          single
          effects={[behavior.effect]}
          onChange={(effects) => {
            const effect = effects[0];
            if (effect) onChange({ ...behavior, effect });
          }}
        />
      </div>
    </>
  );
}

export function createDefaultBehavior(type: StatusBehavior['type']): StatusBehavior {
  switch (type) {
    case 'dot':
      return { type: 'dot', element: 'fire', damagePerStack: 5 };
    case 'stat_mod':
      return { type: 'stat_mod', stat: 'attack', mode: 'flat', amountPerStack: 5 };
    case 'control':
      return { type: 'control', effect: 'stun' };
    case 'trigger':
      return {
        type: 'trigger',
        event: 'on_turn_start',
        effect: { type: 'damage', element: 'fire', multiplier: 0.5 },
      };
  }
}

export function BehaviorFields({
  behavior,
  onChange,
}: {
  behavior: StatusBehavior;
  onChange: (b: StatusBehavior) => void;
}) {
  switch (behavior.type) {
    case 'dot':
      return <DotEditor behavior={behavior} onChange={onChange} />;
    case 'control':
      return <ControlEditor behavior={behavior} onChange={onChange} />;
    case 'stat_mod':
      return <StatModEditor behavior={behavior} onChange={onChange} />;
    case 'trigger':
      return <TriggerEditor behavior={behavior} onChange={onChange} />;
  }
}
