import { useState } from 'react';
import type { TagBehavior } from '@dawn/types';
import { BEHAVIOR_TYPES } from '../fields/constants';
import { EnumSelect } from '../fields/EnumSelect';
import { btnGhost } from '../fields/styles';
import { BehaviorFields, createDefaultBehavior } from './editors';

export function BehaviorBuilder({
  behaviors,
  onChange,
  lockStructure = false,
}: {
  behaviors: TagBehavior[];
  onChange: (b: TagBehavior[]) => void;
  /** When true, behavior types are fixed — only value fields can be edited. */
  lockStructure?: boolean;
}) {
  const [addType, setAddType] = useState<TagBehavior['type']>('dot');

  return (
    <div>
      {behaviors.map((b, index) => (
        <div
          key={index}
          style={{
            background: '#252530',
            padding: 14,
            borderRadius: 10,
            marginBottom: 10,
            border: '1px solid #2e2e3a',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <strong>{BEHAVIOR_TYPES.find((t) => t.value === b.type)?.label ?? b.type}</strong>
            {!lockStructure ? (
              <button
                type="button"
                style={btnGhost}
                onClick={() => onChange(behaviors.filter((_, i) => i !== index))}
              >
                Delete
              </button>
            ) : null}
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
      {!lockStructure ? (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <EnumSelect
            value={addType}
            options={[...BEHAVIOR_TYPES]}
            onChange={(t) => t && setAddType(t)}
          />
          <button
            type="button"
            style={btnGhost}
            onClick={() => onChange([...behaviors, createDefaultBehavior(addType)])}
          >
            + Add Behavior
          </button>
        </div>
      ) : (
        <p style={{ margin: 0, fontSize: 12, color: '#9aa0b4' }}>
          Behavior type is fixed for this tag. Adjust formulas and values above.
        </p>
      )}
    </div>
  );
}
