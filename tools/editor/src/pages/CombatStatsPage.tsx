import { useCallback, useEffect, useState } from 'react';
import { sectionTitle } from '../components/fields/styles';
import { NumberField } from '../components/fields/NumberField';
import { EnumSelect } from '../components/fields/EnumSelect';
import { useCombatStatOptions } from '../hooks/useCombatStats';

interface CombatStatsDraft {
  schemaVersion: number;
  stats: { id: string; label: string }[];
  formulas: {
    statusApplication: {
      attackerStat: string;
      defenderStat: string;
      perPointDelta: number;
    };
    durationReduction: {
      defenderStat: string;
      perPointReduction: number;
      minDuration: number;
    };
  };
}

export function CombatStatsPage() {
  const [draft, setDraft] = useState<CombatStatsDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const statOptions = useCombatStatOptions();

  const load = useCallback(() => {
    fetch('/api/content/config/combat_stats')
      .then((r) => r.json())
      .then(setDraft)
      .catch(() => setMessage('Failed to load combat stats'));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/content/config/combat_stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error('Save failed');
      setMessage('Saved — codegen complete');
      load();
    } catch {
      setMessage('Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!draft) return <div style={{ padding: 24 }}>Loading combat stats…</div>;

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <h1 style={{ marginTop: 0 }}>Combat Stats</h1>
      <p style={{ color: '#888' }}>
        Defines combat stat IDs and global formula bindings. Changes regenerate{' '}
        <code>CombatStatId</code> types on save.
      </p>

      <h2 style={sectionTitle}>Stats</h2>
      {draft.stats.map((stat, index) => (
        <div
          key={index}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginBottom: 8 }}
        >
          <label>
            ID
            <input
              value={stat.id}
              onChange={(e) => {
                const stats = [...draft.stats];
                stats[index] = { ...stat, id: e.target.value };
                setDraft({ ...draft, stats });
              }}
            />
          </label>
          <label>
            Label
            <input
              value={stat.label}
              onChange={(e) => {
                const stats = [...draft.stats];
                stats[index] = { ...stat, label: e.target.value };
                setDraft({ ...draft, stats });
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => setDraft({ ...draft, stats: draft.stats.filter((_, i) => i !== index) })}
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setDraft({
            ...draft,
            stats: [...draft.stats, { id: 'new_stat', label: 'New Stat' }],
          })
        }
      >
        + Add stat
      </button>

      <h2 style={sectionTitle}>Status application formula</h2>
      <label>
        Attacker stat
        <EnumSelect
          value={draft.formulas.statusApplication.attackerStat}
          options={statOptions}
          onChange={(v) =>
            v &&
            setDraft({
              ...draft,
              formulas: {
                ...draft.formulas,
                statusApplication: { ...draft.formulas.statusApplication, attackerStat: v },
              },
            })
          }
        />
      </label>
      <label>
        Defender stat
        <EnumSelect
          value={draft.formulas.statusApplication.defenderStat}
          options={statOptions}
          onChange={(v) =>
            v &&
            setDraft({
              ...draft,
              formulas: {
                ...draft.formulas,
                statusApplication: { ...draft.formulas.statusApplication, defenderStat: v },
              },
            })
          }
        />
      </label>
      <NumberField
        label="Per-point delta"
        value={draft.formulas.statusApplication.perPointDelta}
        step={0.001}
        onChange={(perPointDelta) =>
          setDraft({
            ...draft,
            formulas: {
              ...draft.formulas,
              statusApplication: { ...draft.formulas.statusApplication, perPointDelta },
            },
          })
        }
      />

      <h2 style={sectionTitle}>Duration reduction</h2>
      <label>
        Defender stat
        <EnumSelect
          value={draft.formulas.durationReduction.defenderStat}
          options={statOptions}
          onChange={(v) =>
            v &&
            setDraft({
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
          setDraft({
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
          setDraft({
            ...draft,
            formulas: {
              ...draft.formulas,
              durationReduction: { ...draft.formulas.durationReduction, minDuration },
            },
          })
        }
      />

      <div style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
        <button type="button" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        {message && <span style={{ color: '#888' }}>{message}</span>}
      </div>
    </div>
  );
}
