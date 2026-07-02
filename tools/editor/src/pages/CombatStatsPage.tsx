import { useCallback, useEffect, useMemo, useState } from 'react';
import { btnSecondary } from '../components/fields/styles';
import { CombatStatsForm } from '../components/forms/CombatStatsForm';
import { combatStatsConfigSchema } from '@dawn/content-pipeline/schemas';
import type { CombatStatsConfig } from '@dawn/types';
import { getCombatStatsConfig, saveCombatStatsConfig } from '../api/contentApi';

const toolbar: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  marginBottom: 20,
  alignItems: 'center',
  flexWrap: 'wrap',
};

export function CombatStatsPage() {
  const [draft, setDraft] = useState<CombatStatsConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(() => {
    getCombatStatsConfig()
      .then(setDraft)
      .catch(() => setMessage('Failed to load combat stats'));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const issues = useMemo(() => {
    if (!draft) return [];
    const result = combatStatsConfigSchema.safeParse(draft);
    if (result.success) return [];
    return result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
  }, [draft]);

  const save = async () => {
    if (!draft || issues.length > 0) return;
    setSaving(true);
    setMessage('');
    try {
      await saveCombatStatsConfig(draft);
      setMessage('Saved — codegen complete');
      load();
    } catch {
      setMessage('Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!draft) {
    return (
      <div style={{ padding: 24 }}>
        <p>Loading combat stats…</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 840 }}>
      <h1 style={{ marginTop: 0, fontSize: 22 }}>Combat Stats</h1>
      <p style={{ color: '#888', marginTop: 0 }}>
        Defines combat stat IDs and global formula bindings. Changes regenerate{' '}
        <code>CombatStatId</code> types on save.
      </p>

      <div style={toolbar}>
        <button
          type="button"
          style={btnSecondary}
          onClick={save}
          disabled={saving || issues.length > 0}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        {message && <span style={{ color: '#888' }}>{message}</span>}
      </div>

      <CombatStatsForm draft={draft} onChange={setDraft} issues={issues} />
    </div>
  );
}
