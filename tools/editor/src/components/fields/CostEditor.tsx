import { RESOURCE_TYPES } from './constants';
import type { FlatCosts } from './costAdapter';
import { NumberField } from './NumberField';
import { fieldGrid, sectionTitle } from './styles';

export function CostEditor({
  costs,
  onChange,
}: {
  costs: FlatCosts;
  onChange: (costs: FlatCosts) => void;
}) {
  return (
    <div>
      <h4 style={sectionTitle}>Costs</h4>
      <div style={fieldGrid}>
        {RESOURCE_TYPES.map(({ value, label }) => (
          <NumberField
            key={value}
            label={label}
            value={
              value === 'hp'
                ? (costs.hpCost ?? 0)
                : value === 'sp'
                  ? (costs.spCost ?? 0)
                  : (costs.apCost ?? 0)
            }
            min={0}
            onChange={(amount) => {
              if (value === 'hp') onChange({ ...costs, hpCost: amount });
              else if (value === 'sp') onChange({ ...costs, spCost: amount });
              else onChange({ ...costs, apCost: amount });
            }}
          />
        ))}
      </div>
    </div>
  );
}
