import { useMemo } from 'react';
import { RESOURCE_TYPES } from './constants';
import {
  flatCostsToResourceList,
  resourceListToFlatCosts,
  type FlatCosts,
  type ResourceCost,
} from './costAdapter';
import { EnumSelect } from './EnumSelect';
import { field, input, labelRow } from './styles';

export function CostEditor({
  costs,
  onChange,
}: {
  costs: FlatCosts;
  onChange: (costs: FlatCosts) => void;
}) {
  const rows = useMemo(() => flatCostsToResourceList(costs), [costs]);

  const updateRows = (next: ResourceCost[]) => {
    onChange(resourceListToFlatCosts(next));
  };

  const addRow = () => {
    const used = new Set(rows.map((r) => r.resource));
    const next = RESOURCE_TYPES.find((r) => !used.has(r.value));
    if (!next) return;
    updateRows([...rows, { resource: next.value, amount: 1 }]);
  };

  return (
    <div>
      <div style={{ ...field, marginBottom: 8 }}>
        <strong>Costs</strong>
      </div>
      {rows.length === 0 && (
        <p style={{ fontSize: 12, color: '#666', margin: '0 0 8px' }}>No resource costs</p>
      )}
      {rows.map((row, index) => (
        <div key={index} style={{ ...labelRow, marginBottom: 8 }}>
          <EnumSelect
            value={row.resource}
            options={RESOURCE_TYPES.map((r) => ({ value: r.value, label: r.label }))}
            onChange={(resource) => {
              if (!resource) return;
              const next = [...rows];
              next[index] = { resource, amount: row.amount };
              updateRows(next);
            }}
          />
          <input
            style={{ ...input, width: 72 }}
            type="number"
            min={1}
            value={row.amount}
            onChange={(e) => {
              const next = [...rows];
              next[index] = { ...row, amount: Number(e.target.value) };
              updateRows(next);
            }}
          />
          <button type="button" onClick={() => updateRows(rows.filter((_, i) => i !== index))}>
            Remove
          </button>
        </div>
      ))}
      {rows.length < RESOURCE_TYPES.length && (
        <button type="button" onClick={addRow} style={{ fontSize: 12 }}>
          + Add cost
        </button>
      )}
    </div>
  );
}
