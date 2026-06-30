import type { SkillEffect, TargetSelector } from '@dawn/types';
import { EffectBuilder } from '../EffectBuilder/EffectBuilder';

const field: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  marginBottom: 12,
};
const input: React.CSSProperties = {
  padding: '6px 8px',
  borderRadius: 4,
  border: '1px solid #444',
  background: '#1a1a22',
  color: '#eee',
};

export function SkillPreview({ draft }: { draft: Record<string, unknown> }) {
  const effects = (draft.effects as SkillEffect[] | undefined) ?? [];
  const targeting = draft.targeting as TargetSelector | undefined;
  const range = targeting && 'range' in targeting ? targeting.range : 0;

  return (
    <div style={{ background: '#252530', borderRadius: 8, padding: 16 }}>
      <h3 style={{ margin: '0 0 8px' }}>{String(draft.name ?? 'Skill')}</h3>
      <p style={{ margin: '0 0 12px', fontSize: 13, color: '#aaa' }}>
        {String(draft.description ?? '')}
      </p>
      <div style={{ fontSize: 12, color: '#888' }}>
        <div>
          MP: {String(draft.mpCost ?? 0)} · CD: {String(draft.cooldown ?? 0)}
        </div>
        <div>Range: {range}</div>
      </div>
      <div style={{ marginTop: 12 }}>
        {effects.map((e, i) => (
          <div key={i} style={{ fontSize: 12, padding: '4px 0', borderTop: '1px solid #333' }}>
            {e.type === 'damage' && `Damage ${e.multiplier}x ${e.element}`}
            {e.type === 'heal' && `Heal ${e.multiplier}x`}
            {e.type === 'apply_status' && `Apply ${e.statusId} @ ${Math.round(e.chance * 100)}%`}
            {e.type === 'move' && `Move ${e.range}`}
            {e.type === 'teleport' && `Teleport ${e.range}`}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Target area</div>
        <div
          style={{
            display: 'inline-grid',
            gridTemplateColumns: `repeat(${Math.min(range * 2 + 1, 7)}, 20px)`,
            gap: 2,
          }}
        >
          {Array.from({ length: Math.min((range * 2 + 1) ** 2, 49) }).map((_, i, arr) => {
            const mid = Math.floor(arr.length / 2);
            const isCenter = i === mid;
            return (
              <div
                key={i}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 3,
                  background: isCenter ? '#f0c674' : '#3a3a48',
                  opacity: isCenter ? 1 : 0.6,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SkillForm({
  draft,
  onChange,
}: {
  draft: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const set = (key: string, value: unknown) => onChange({ ...draft, [key]: value });
  const targeting = (draft.targeting as TargetSelector | undefined) ?? {
    type: 'single_enemy',
    range: 1,
  };
  const effects = (draft.effects as SkillEffect[] | undefined) ?? [];

  return (
    <div>
      <section>
        <h3>Identity</h3>
        <label style={field}>
          ID <input style={input} value={String(draft.id ?? '')} readOnly />
        </label>
        <label style={field}>
          Name{' '}
          <input
            style={input}
            value={String(draft.name ?? '')}
            onChange={(e) => set('name', e.target.value)}
          />
        </label>
        <label style={field}>
          Description{' '}
          <textarea
            style={input}
            value={String(draft.description ?? '')}
            onChange={(e) => set('description', e.target.value)}
          />
        </label>
      </section>
      <section>
        <h3>Metadata</h3>
        <label style={field}>
          Category{' '}
          <input
            style={input}
            value={String(draft.category ?? '')}
            onChange={(e) => set('category', e.target.value)}
          />
        </label>
        <label style={field}>
          Element{' '}
          <input
            style={input}
            value={String(draft.element ?? '')}
            onChange={(e) => set('element', e.target.value)}
          />
        </label>
        <label style={field}>
          Tags{' '}
          <input
            style={input}
            value={Array.isArray(draft.tags) ? draft.tags.join(', ') : ''}
            onChange={(e) =>
              set(
                'tags',
                e.target.value
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean),
              )
            }
          />
        </label>
        <label style={field}>
          Inherits{' '}
          <input
            style={input}
            value={String(draft.inherits ?? '')}
            onChange={(e) => set('inherits', e.target.value || undefined)}
            placeholder="skill_fireball"
          />
        </label>
      </section>
      <section>
        <h3>Costs</h3>
        <label style={field}>
          MP Cost{' '}
          <input
            style={input}
            type="number"
            value={Number(draft.mpCost ?? 0)}
            onChange={(e) => set('mpCost', Number(e.target.value))}
          />
        </label>
        <label style={field}>
          Cooldown{' '}
          <input
            style={input}
            type="number"
            value={Number(draft.cooldown ?? 0)}
            onChange={(e) => set('cooldown', Number(e.target.value))}
          />
        </label>
      </section>
      <section>
        <h3>Targeting</h3>
        <label style={field}>
          Type{' '}
          <select
            style={input}
            value={targeting.type}
            onChange={(e) => {
              const t = e.target.value;
              if (t === 'self') set('targeting', { type: 'self' });
              else if (t === 'single_enemy') set('targeting', { type: 'single_enemy', range: 1 });
              else if (t === 'single_ally') set('targeting', { type: 'single_ally', range: 1 });
              else if (t === 'tile') set('targeting', { type: 'tile', range: 1 });
              else
                set('targeting', {
                  type: 'area',
                  range: 2,
                  radius: 1,
                  filter: 'enemy',
                  center: 'unit',
                });
            }}
          >
            {['single_enemy', 'single_ally', 'self', 'tile', 'area'].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        {'range' in targeting && (
          <label style={field}>
            Range{' '}
            <input
              style={input}
              type="number"
              value={targeting.range}
              onChange={(e) => set('targeting', { ...targeting, range: Number(e.target.value) })}
            />
          </label>
        )}
      </section>
      <section>
        <h3>Effects</h3>
        <EffectBuilder effects={effects} onChange={(e: SkillEffect[]) => set('effects', e)} />
      </section>
      <section>
        <h3>Assets</h3>
        <label style={field}>
          iconId{' '}
          <input
            style={input}
            value={String(draft.iconId ?? '')}
            onChange={(e) => set('iconId', e.target.value)}
          />
        </label>
        <label style={field}>
          vfxId{' '}
          <input
            style={input}
            value={String(draft.vfxId ?? '')}
            onChange={(e) => set('vfxId', e.target.value)}
          />
        </label>
        <label style={field}>
          sfxId{' '}
          <input
            style={input}
            value={String(draft.sfxId ?? '')}
            onChange={(e) => set('sfxId', e.target.value)}
          />
        </label>
      </section>
    </div>
  );
}
