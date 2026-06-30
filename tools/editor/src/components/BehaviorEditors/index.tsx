import { useState } from 'react';
import type { StatusBehavior } from '@dawn/types';
import { BEHAVIOR_TYPES } from '../fields/constants';
import { EnumSelect } from '../fields/EnumSelect';
import { BehaviorFields, createDefaultBehavior } from './editors';

export function BehaviorBuilder({
  behaviors,
  onChange,
}: {
  behaviors: StatusBehavior[];
  onChange: (b: StatusBehavior[]) => void;
}) {
  const [addType, setAddType] = useState<StatusBehavior['type']>('dot');

  return (
    <div>
      {behaviors.map((b, index) => (
        <div
          key={index}
          style={{ background: '#252530', padding: 12, borderRadius: 8, marginBottom: 8 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <strong style={{ textTransform: 'capitalize' }}>{b.type.replace('_', ' ')}</strong>
            <button type="button" onClick={() => onChange(behaviors.filter((_, i) => i !== index))}>
              Delete
            </button>
          </div>
          <BehaviorFields
            behavior={b}
            onChange={(next) => {
              const copy = [...behaviors];
              copy[index] = next;
              onChange(copy);
            }}
          />
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <EnumSelect
          value={addType}
          options={[...BEHAVIOR_TYPES]}
          onChange={(t) => t && setAddType(t)}
        />
        <button
          type="button"
          onClick={() => onChange([...behaviors, createDefaultBehavior(addType)])}
        >
          + Add Behavior
        </button>
      </div>
    </div>
  );
}
