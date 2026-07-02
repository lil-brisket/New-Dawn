import type { CombatStatsConfig } from '@dawn/types';
import {
  sectionCard,
  sectionTitle,
  field,
  input,
  fieldGrid,
  btnSecondary,
  btnGhost,
} from '../fields/styles';
import { NumberField } from '../fields/NumberField';
import { EnumSelect } from '../fields/EnumSelect';
import { ValidationMessage } from '../fields/ValidationMessage';
import { useCombatStatOptions } from '../../hooks/useCombatStats';

type CombatStatsDraft = CombatStatsConfig;

export function CombatStatsForm({
  draft,
  onChange,
  issues,
}: {
  draft: CombatStatsDraft;
  onChange: (draft: CombatStatsDraft) => void;
  issues: string[];
}) {
  const statOptions = useCombatStatOptions();

  return (
    <div>
      <section style={sectionCard}>
        <h3 style={sectionTitle}>Stats</h3>
        {draft.stats.map((stat, index) => (
          <div key={index} style={{ ...fieldGrid, marginBottom: 12 }}>
            <label style={field}>
              ID
              <input
                style={input}
                value={stat.id}
                onChange={(e) => {
                  const stats = [...draft.stats];
                  stats[index] = { ...stat, id: e.target.value };
                  onChange({ ...draft, stats });
                }}
              />
            </label>
            <label style={field}>
              Label
              <input
                style={input}
                value={stat.label}
                onChange={(e) => {
                  const stats = [...draft.stats];
                  stats[index] = { ...stat, label: e.target.value };
                  onChange({ ...draft, stats });
                }}
              />
            </label>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                type="button"
                style={btnGhost}
                onClick={() =>
                  onChange({ ...draft, stats: draft.stats.filter((_, i) => i !== index) })
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          style={btnSecondary}
          onClick={() =>
            onChange({
              ...draft,
              stats: [...draft.stats, { id: 'new_stat', label: 'New Stat' }],
            })
          }
        >
          + Add stat
        </button>
      </section>

      <section style={sectionCard}>
        <h3 style={sectionTitle}>Tag Application Formula</h3>
        <div style={fieldGrid}>
          <label style={field}>
            Attacker stat
            <EnumSelect
              value={draft.formulas.tagApplication.attackerStat}
              options={statOptions}
              onChange={(v) =>
                v &&
                onChange({
                  ...draft,
                  formulas: {
                    ...draft.formulas,
                    tagApplication: { ...draft.formulas.tagApplication, attackerStat: v },
                  },
                })
              }
            />
          </label>
          <label style={field}>
            Defender stat
            <EnumSelect
              value={draft.formulas.tagApplication.defenderStat}
              options={statOptions}
              onChange={(v) =>
                v &&
                onChange({
                  ...draft,
                  formulas: {
                    ...draft.formulas,
                    tagApplication: { ...draft.formulas.tagApplication, defenderStat: v },
                  },
                })
              }
            />
          </label>
          <NumberField
            label="Per-point delta"
            value={draft.formulas.tagApplication.perPointDelta}
            step={0.001}
            onChange={(perPointDelta) =>
              onChange({
                ...draft,
                formulas: {
                  ...draft.formulas,
                  tagApplication: { ...draft.formulas.tagApplication, perPointDelta },
                },
              })
            }
          />
        </div>
      </section>

      <section style={sectionCard}>
        <h3 style={sectionTitle}>Duration Reduction</h3>
        <div style={fieldGrid}>
          <label style={field}>
            Defender stat
            <EnumSelect
              value={draft.formulas.durationReduction.defenderStat}
              options={statOptions}
              onChange={(v) =>
                v &&
                onChange({
                  ...draft,
                  formulas: {
                    ...draft.formulas,
                    durationReduction: { ...draft.formulas.durationReduction, defenderStat: v },
                  },
                })
              }
            />
          </label>
          <NumberField
            label="Per-point reduction"
            value={draft.formulas.durationReduction.perPointReduction}
            step={0.01}
            onChange={(perPointReduction) =>
              onChange({
                ...draft,
                formulas: {
                  ...draft.formulas,
                  durationReduction: { ...draft.formulas.durationReduction, perPointReduction },
                },
              })
            }
          />
          <NumberField
            label="Min duration"
            value={draft.formulas.durationReduction.minDuration}
            min={0}
            onChange={(minDuration) =>
              onChange({
                ...draft,
                formulas: {
                  ...draft.formulas,
                  durationReduction: { ...draft.formulas.durationReduction, minDuration },
                },
              })
            }
          />
        </div>
      </section>

      {issues.map((issue) => (
        <ValidationMessage key={issue} message={issue} />
      ))}
    </div>
  );
}
