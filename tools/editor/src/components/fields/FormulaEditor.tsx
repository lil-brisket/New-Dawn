import type { StatFormula } from '@dawn/types';
import { useCombatStatOptions } from '../../hooks/useCombatStats';
import { EnumSelect } from './EnumSelect';
import { NumberField } from './NumberField';
import { btnGhost, field, fieldGrid, sectionTitle } from './styles';

const DEFAULT_FORMULA: StatFormula = {
  base: 0,
  terms: [{ source: 'stat', key: 'attack', ratio: 1 }],
};

export function FormulaEditor({
  label = 'Formula',
  value,
  onChange,
}: {
  label?: string;
  value?: StatFormula;
  onChange: (formula: StatFormula) => void;
}) {
  const formula = value ?? DEFAULT_FORMULA;
  const statOptions = useCombatStatOptions();

  const updateTerm = (index: number, key: string) => {
    const terms = [...formula.terms];
    terms[index] = { source: 'stat', key, ratio: 1 };
    onChange({ ...formula, terms });
  };

  const addTerm = () => {
    onChange({
      ...formula,
      terms: [...formula.terms, { source: 'stat', key: statOptions[0] ?? 'attack', ratio: 1 }],
    });
  };

  const removeTerm = (index: number) => {
    onChange({ ...formula, terms: formula.terms.filter((_, i) => i !== index) });
  };

  return (
    <div style={{ marginTop: 8 }}>
      <h4 style={{ ...sectionTitle, marginBottom: 8 }}>{label}</h4>
      <NumberField
        label="Base"
        value={formula.base}
        step={1}
        onChange={(base) => onChange({ ...formula, base })}
      />
      <div style={{ marginTop: 12 }}>
        <span style={{ fontSize: 12, color: '#9aa0b4' }}>Stat terms</span>
        {formula.terms.map((term, index) => (
          <div key={index} style={{ ...fieldGrid, marginTop: 8, alignItems: 'end' }}>
            <label style={field}>
              Stat
              <EnumSelect
                value={term.key}
                options={statOptions}
                onChange={(v) => v && updateTerm(index, v)}
              />
            </label>
            <button type="button" style={btnGhost} onClick={() => removeTerm(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" style={{ ...btnGhost, marginTop: 8 }} onClick={addTerm}>
          + Add stat
        </button>
      </div>
    </div>
  );
}

export function DurationFormulaEditor({
  value,
  onChange,
  onClear,
}: {
  value?: { stat: string; ratio: number; maxBonus?: number };
  onChange: (v: { stat: string; ratio: number; maxBonus?: number }) => void;
  onClear?: () => void;
}) {
  const statOptions = useCombatStatOptions();
  const enabled = value !== undefined;

  return (
    <div style={{ marginTop: 12 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => {
            if (e.target.checked) {
              onChange({ stat: statOptions[0] ?? 'willpower', ratio: 0.01 });
            } else {
              onClear?.();
            }
          }}
        />
        Duration scaling
      </label>
      {enabled && value && (
        <div style={fieldGrid}>
          <label style={field}>
            Stat
            <EnumSelect
              value={value.stat}
              options={statOptions}
              onChange={(v) => v && onChange({ ...value, stat: v })}
            />
          </label>
          <NumberField
            label="Max bonus turns (optional)"
            value={value.maxBonus ?? 0}
            step={1}
            min={0}
            onChange={(maxBonus) => onChange({ ...value, maxBonus: maxBonus || undefined })}
          />
        </div>
      )}
    </div>
  );
}
