import type { StatusBehavior } from '@dawn/types';

export function BehaviorBuilder({
  behaviors,
  onChange,
}: {
  behaviors: StatusBehavior[];
  onChange: (b: StatusBehavior[]) => void;
}) {
  return (
    <div>
      {behaviors.map((b, index) => (
        <div
          key={index}
          style={{ background: '#252530', padding: 12, borderRadius: 8, marginBottom: 8 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <strong>{b.type}</strong>
            <button type="button" onClick={() => onChange(behaviors.filter((_, i) => i !== index))}>
              ✕
            </button>
          </div>
          {b.type === 'dot' && (
            <>
              <label>
                Element{' '}
                <input
                  value={b.element}
                  onChange={(e) => {
                    const next = [...behaviors];
                    next[index] = { ...b, element: e.target.value as never };
                    onChange(next);
                  }}
                />
              </label>
              <label>
                {' '}
                Dmg/stack{' '}
                <input
                  type="number"
                  value={b.damagePerStack}
                  onChange={(e) => {
                    const next = [...behaviors];
                    next[index] = { ...b, damagePerStack: Number(e.target.value) };
                    onChange(next);
                  }}
                />
              </label>
            </>
          )}
          {b.type === 'stat_mod' && (
            <>
              <label>
                Stat{' '}
                <select
                  value={b.stat}
                  onChange={(e) => {
                    const next = [...behaviors];
                    next[index] = { ...b, stat: e.target.value as 'attack' | 'defense' };
                    onChange(next);
                  }}
                >
                  <option value="attack">attack</option>
                  <option value="defense">defense</option>
                </select>
              </label>
              <label>
                Amount{' '}
                <input
                  type="number"
                  value={b.amountPerStack}
                  onChange={(e) => {
                    const next = [...behaviors];
                    next[index] = { ...b, amountPerStack: Number(e.target.value) };
                    onChange(next);
                  }}
                />
              </label>
            </>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([...behaviors, { type: 'dot', element: 'fire', damagePerStack: 5 }])
        }
      >
        + Add Behavior
      </button>
    </div>
  );
}
