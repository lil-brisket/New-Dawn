import type { TargetSelector } from '@dawn/types';
import { useMemo } from 'react';
import { SHAPE_TYPES, TARGET_TYPES, type ShapeType } from './constants';
import { EnumSelect } from './EnumSelect';
import { NumberField } from './NumberField';
import { field, fieldGrid, sectionCard, sectionTitle } from './styles';

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

function inShape(q: number, r: number, shape: ShapeType, range: number): boolean {
  const dist = hexDistance(q, r);
  if (dist === 0 || dist > range) return false;
  if (shape === 'aoe') return true;
  if (shape === 'line') return r === 0 && q > 0;
  if (shape === 'cone') return r <= 0 && r >= -q && q > 0;
  return false;
}

function HexPreview({ range, shape }: { range: number; shape: ShapeType }) {
  const maxR = Math.max(range, 1);
  const tiles = useMemo(() => hexTilesInRange(maxR + 1), [maxR]);

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
        const inRange = hexDistance(q, r) <= range && !isCenter;
        const effect = inShape(q, r, shape, range);
        let fill = '#2a2a36';
        if (isCenter) fill = '#f0c674';
        else if (effect) fill = '#c0392b';
        else if (inRange) fill = '#3d5a80';
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
  shapeType,
  onChange,
  onShapeChange,
}: {
  targeting: TargetSelector;
  shapeType: ShapeType;
  onChange: (t: TargetSelector) => void;
  onShapeChange: (shape: ShapeType) => void;
}) {
  const setType = (type: TargetSelector['type']) => {
    if (type === 'self') onChange({ type: 'self' });
    else {
      const range = 'range' in targeting ? targeting.range : 1;
      onChange({ type, range } as TargetSelector);
    }
  };

  return (
    <section style={sectionCard}>
      <h3 style={sectionTitle}>Targeting</h3>
      <div style={fieldGrid}>
        <label style={field}>
          Target
          <EnumSelect
            value={targeting.type}
            options={[...TARGET_TYPES]}
            onChange={(v) => v && setType(v)}
          />
        </label>
        <label style={field}>
          Type
          <EnumSelect
            value={shapeType}
            options={[...SHAPE_TYPES]}
            onChange={(v) => v && onShapeChange(v)}
          />
        </label>
        {'range' in targeting && (
          <NumberField
            label="Range"
            value={targeting.range}
            min={0}
            onChange={(range) => onChange({ ...targeting, range } as TargetSelector)}
          />
        )}
      </div>

      <div
        style={{
          background: '#16161e',
          borderRadius: 10,
          padding: 12,
          marginTop: 12,
          border: '1px solid #2e2e3a',
        }}
      >
        <div style={{ fontSize: 11, color: '#6b7280', textAlign: 'center' }}>Hex preview</div>
        <HexPreview range={'range' in targeting ? targeting.range : 0} shape={shapeType} />
        <div style={{ fontSize: 10, color: '#555', textAlign: 'center' }}>
          Gold = caster · Blue = range · Red = effect shape
        </div>
      </div>
    </section>
  );
}
