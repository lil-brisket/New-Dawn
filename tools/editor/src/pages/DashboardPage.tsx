import { useEffect, useState } from 'react';
import { getDashboard } from '../api/contentApi';

const page: React.CSSProperties = { padding: 24 };
const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
  gap: 16,
  marginTop: 24,
};
const card: React.CSSProperties = {
  background: '#252530',
  borderRadius: 8,
  padding: 16,
};
const value: React.CSSProperties = { fontSize: 28, fontWeight: 700, color: '#f0c674' };
const label: React.CSSProperties = { fontSize: 13, color: '#888', marginTop: 4 };

export function DashboardPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);

  useEffect(() => {
    getDashboard().then(setData).catch(console.error);
  }, []);

  if (!data) return <div style={page}>Loading…</div>;

  const { stats, errors, warnings } = data;
  const metrics: { key: string; label: string }[] = [
    { key: 'skillCount', label: 'Skills' },
    { key: 'statusCount', label: 'Statuses' },
    { key: 'enemyCount', label: 'Enemies' },
    { key: 'brokenReferences', label: 'Broken References' },
    { key: 'warnings', label: 'Warnings' },
    { key: 'avgSkillMpCost', label: 'Avg Skill Cost (MP)' },
    { key: 'avgEnemyHp', label: 'Avg Enemy HP' },
  ];

  return (
    <div style={page}>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      <div style={grid}>
        {metrics.map((m) => (
          <div key={m.key} style={card}>
            <div style={value}>{stats[m.key] ?? 0}</div>
            <div style={label}>{m.label}</div>
          </div>
        ))}
      </div>
      {errors.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <h2>Errors</h2>
          <ul>
            {errors.map((e, i) => (
              <li key={i} style={{ color: '#f07178' }}>
                [{e.file}] {e.message}
              </li>
            ))}
          </ul>
        </section>
      )}
      {warnings.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2>Warnings</h2>
          <ul>
            {warnings.map((w, i) => (
              <li key={i} style={{ color: '#e5c07b' }}>
                [{w.file}] {w.message}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
