import type { StatFormula, FormulaTerm } from '@dawn/types';
import { NumberField } from './NumberField';
import { EnumSelect } from './EnumSelect';
import { useCombatStatOptions } from '../../hooks/useCombatStats';

const TERM_SOURCES = ['stat', 'stacks', 'level', 'missing_hp', 'hp_percent', 'distance'] as const;

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

  const updateTerm = (index: number, term: FormulaTerm) => {
    const terms = [...formula.terms];
    terms[index] = term;
    onChange({ ...formula, terms });
  };

  const addTerm = () => {
    onChange({
      ...formula,
      terms: [...formula.terms, { source: 'stat', key: statOptions[0] ?? 'attack', ratio: 0 }],
    });
  };

  const removeTerm = (index: number) => {
    onChange({ ...formula, terms: formula.terms.filter((_, i) => i !== index) });
  };

  return (
    <fieldset style={{ border: '1px solid #333', borderRadius: 6, padding: 12, marginTop: 8 }}>
      <legend>{label}</legend>
      <NumberField
        label="Base"
        value={formula.base}
        step={1}
        onChange={(base) => onChange({ ...formula, base })}
      />
      <div style={{ marginTop: 8 }}>
        <strong style={{ fontSize: 13 }}>Terms</strong>
        {formula.terms.map((term, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr auto',
              gap: 8,
              marginTop: 8,
              alignItems: 'end',
            }}
          >
            <label style={{ fontSize: 13 }}>
              Source
              <EnumSelect
                value={term.source}
                options={[...TERM_SOURCES]}
                onChange={(v) => v && updateTerm(index, { ...term, source: v })}
              />
            </label>
            <label style={{ fontSize: 13 }}>
              Key
              {term.source === 'stat' ? (
                <EnumSelect
                  value={term.key}
                  options={statOptions}
                  onChange={(v) => v && updateTerm(index, { ...term, key: v })}
                />
              ) : (
                <input value={term.key} disabled style={{ opacity: 0.5 }} />
              )}
            </label>
            <NumberField
              label="Ratio"
              value={term.ratio}
              step={0.05}
              onChange={(ratio) => updateTerm(index, { ...term, ratio })}
            />
            <button type="button" onClick={() => removeTerm(index)}>
              ×
            </button>
          </div>
        ))}
        <button type="button" style={{ marginTop: 8 }} onClick={addTerm}>
          + Add term
        </button>
      </div>
    </fieldset>
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
    <fieldset style={{ border: '1px solid #333', borderRadius: 6, padding: 12, marginTop: 8 }}>
      <legend>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
      </legend>
      {enabled && value && (
        <>
          <label style={{ fontSize: 13 }}>
            Stat
            <EnumSelect
              value={value.stat}
              options={statOptions}
              onChange={(v) => v && onChange({ ...value, stat: v })}
            />
          </label>
          <NumberField
            label="Ratio"
            value={value.ratio}
            step={0.01}
            onChange={(ratio) => onChange({ ...value, ratio })}
          />
          <NumberField
            label="Max bonus (optional)"
            value={value.maxBonus ?? 0}
            step={1}
            onChange={(maxBonus) => onChange({ ...value, maxBonus: maxBonus || undefined })}
          />
        </>
      )}
    </fieldset>
  );
}
