import type { TargetSelector } from '@dawn/types';
import { useMemo } from 'react';
import { AREA_CENTERS, AREA_FILTERS, TARGET_TYPES } from './constants';
import { EnumSelect } from './EnumSelect';
import { NumberField } from './NumberField';
import { field, labelRow, sectionTitle } from './styles';
import { ValidationMessage } from './ValidationMessage';

/** Axial hex distance from center (0,0). */
function hexDistance(q: number, r: number): number {
  return (Math.abs(q) + Math.abs(q + r) + Math.abs(r)) / 2;
}

function hexTilesInRange(maxRange: number): { q: number; r: number }[] {
  const tiles: { q: number; r: number }[] = [];
  for (let q = -maxRange; q <= maxRange; q++) {
    for (let r = -maxRange; r <= maxRange; r++) {
      if (hexDistance(q, r) <= maxRange) tiles.push({ q, r });
    }
  }
  return tiles;
}

function HexPreview({ range, radius, isArea }: { range: number; radius: number; isArea: boolean }) {
  const maxR = Math.max(range, isArea ? radius : 0, 1);
  const tiles = useMemo(() => hexTilesInRange(maxR + 1), [maxR]);

  const inCastRange = (q: number, r: number) => hexDistance(q, r) <= range && !(q === 0 && r === 0);
  const inEffectArea = (q: number, r: number) => isArea && hexDistance(q, r) <= radius;

  const size = 18;
  const positions = tiles.map(({ q, r }) => ({
    q,
    r,
    x: size * (q + r / 2) * 1.15,
    y: size * r * 0.98,
  }));
  const xs = positions.map((p) => p.x);
  const ys = positions.map((p) => p.y);
  const pad = size;
  const width = Math.max(...xs) - Math.min(...xs) + pad * 2;
  const height = Math.max(...ys) - Math.min(...ys) + pad * 2;
  const ox = -Math.min(...xs) + pad;
  const oy = -Math.min(...ys) + pad;

  return (
    <svg width={width} height={height} style={{ display: 'block', margin: '8px auto' }}>
      {positions.map(({ q, r, x, y }) => {
        const isCenter = q === 0 && r === 0;
        const cast = inCastRange(q, r);
        const effect = inEffectArea(q, r);
        let fill = '#2a2a36';
        if (isCenter) fill = '#f0c674';
        else if (effect) fill = '#c0392b';
        else if (cast) fill = '#3d5a80';
        return (
          <polygon
            key={`${q},${r}`}
            points={hexPoints(x + ox, y + oy, size * 0.45)}
            fill={fill}
            stroke="#444"
            strokeWidth={1}
            opacity={isCenter ? 1 : 0.85}
          />
        );
      })}
    </svg>
  );
}

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
}

export function TargetingEditor({
  targeting,
  onChange,
}: {
  targeting: TargetSelector;
  onChange: (t: TargetSelector) => void;
}) {
  const setType = (type: TargetSelector['type']) => {
    if (type === 'self') onChange({ type: 'self' });
    else if (type === 'single_enemy') {
      const range = 'range' in targeting ? targeting.range : 1;
      onChange({ type: 'single_enemy', range });
    } else if (type === 'single_ally') {
      const range = 'range' in targeting ? targeting.range : 1;
      onChange({ type: 'single_ally', range });
    } else if (type === 'tile') {
      const range = 'range' in targeting ? targeting.range : 1;
      onChange({ type: 'tile', range });
    } else {
      const range = 'range' in targeting ? targeting.range : 2;
      const radius = targeting.type === 'area' ? targeting.radius : 1;
      const filter = targeting.type === 'area' ? targeting.filter : 'enemy';
      const center = targeting.type === 'area' ? targeting.center : 'unit';
      onChange({ type: 'area', range, radius, filter, center });
    }
  };

  const rangeWarning =
    targeting.type === 'area' && targeting.radius < 1
      ? 'Radius must be >= 1 for area skills'
      : undefined;

  return (
    <div>
      <h4 style={sectionTitle}>Targeting</h4>
      <div style={field}>
        <span>Target</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {TARGET_TYPES.map((t) => (
            <label key={t.value} style={labelRow}>
              <input
                type="radio"
                name="targetType"
                checked={targeting.type === t.value}
                onChange={() => setType(t.value)}
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      {'range' in targeting && (
        <NumberField
          label="Range"
          value={targeting.range}
          min={0}
          onChange={(range) => onChange({ ...targeting, range })}
        />
      )}

      {targeting.type === 'area' && (
        <>
          <NumberField
            label="Radius"
            value={targeting.radius}
            min={0}
            onChange={(radius) => onChange({ ...targeting, radius })}
            warning={rangeWarning}
          />
          <label style={field}>
            Center
            <EnumSelect
              value={targeting.center}
              options={[...AREA_CENTERS]}
              onChange={(center) => center && onChange({ ...targeting, center })}
            />
          </label>
          <label style={field}>
            Filter
            <EnumSelect
              value={targeting.filter}
              options={[...AREA_FILTERS]}
              onChange={(filter) => filter && onChange({ ...targeting, filter })}
            />
          </label>
        </>
      )}

      <div style={{ background: '#1e1e28', borderRadius: 8, padding: 8 }}>
        <div style={{ fontSize: 11, color: '#666', textAlign: 'center' }}>Hex preview</div>
        <HexPreview
          range={'range' in targeting ? targeting.range : 0}
          radius={targeting.type === 'area' ? targeting.radius : 0}
          isArea={targeting.type === 'area'}
        />
        <div style={{ fontSize: 10, color: '#555', textAlign: 'center' }}>
          Gold = caster · Blue = cast range · Red = effect area
        </div>
      </div>
      {rangeWarning && <ValidationMessage message={rangeWarning} />}
    </div>
  );
}
