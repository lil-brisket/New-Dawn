import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import type { SkillEffect } from '@dawn/types';

const block: React.CSSProperties = {
  background: '#252530',
  borderRadius: 8,
  marginBottom: 8,
  border: '1px solid #333',
};

function EffectFields({
  effect,
  onChange,
}: {
  effect: SkillEffect;
  onChange: (e: SkillEffect) => void;
}) {
  if (effect.type === 'damage') {
    return (
      <>
        <label>
          Element{' '}
          <select
            value={effect.element}
            onChange={(e) => onChange({ ...effect, element: e.target.value as never })}
          >
            {['physical', 'fire', 'ice', 'lightning', 'wind', 'earth', 'light', 'dark'].map(
              (el) => (
                <option key={el} value={el}>
                  {el}
                </option>
              ),
            )}
          </select>
        </label>
        <label>
          Multiplier{' '}
          <input
            type="number"
            step="0.1"
            value={effect.multiplier}
            onChange={(e) => onChange({ ...effect, multiplier: Number(e.target.value) })}
          />
        </label>
      </>
    );
  }
  if (effect.type === 'heal') {
    return (
      <label>
        Multiplier{' '}
        <input
          type="number"
          step="0.1"
          value={effect.multiplier}
          onChange={(e) => onChange({ ...effect, multiplier: Number(e.target.value) })}
        />
      </label>
    );
  }
  if (effect.type === 'apply_status') {
    return (
      <>
        <label>
          Status{' '}
          <input
            value={effect.statusId}
            onChange={(e) => onChange({ ...effect, statusId: e.target.value })}
          />
        </label>
        <label>
          Chance{' '}
          <input
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={effect.chance}
            onChange={(e) => onChange({ ...effect, chance: Number(e.target.value) })}
          />
        </label>
      </>
    );
  }
  if (effect.type === 'move' || effect.type === 'teleport') {
    return (
      <label>
        Range{' '}
        <input
          type="number"
          value={effect.range}
          onChange={(e) => onChange({ ...effect, range: Number(e.target.value) })}
        />
      </label>
    );
  }
  return <span>{effect.type}</span>;
}

function SortableBlock({
  effect,
  index,
  collapsed,
  onToggle,
  onChange,
  onDuplicate,
  onDelete,
}: {
  effect: SkillEffect;
  index: number;
  collapsed: boolean;
  onToggle: () => void;
  onChange: (e: SkillEffect) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: String(index),
  });
  const style = {
    ...block,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          borderBottom: collapsed ? undefined : '1px solid #333',
        }}
      >
        <span {...attributes} {...listeners} style={{ cursor: 'grab', color: '#666' }}>
          ⠿
        </span>
        <strong>{index + 1}.</strong>
        <span style={{ flex: 1, textTransform: 'capitalize' }}>
          {effect.type.replace('_', ' ')}
        </span>
        <button type="button" onClick={onToggle}>
          {collapsed ? '▸' : '▾'}
        </button>
        <button type="button" onClick={onDuplicate}>
          ⧉
        </button>
        <button type="button" onClick={onDelete}>
          ✕
        </button>
      </div>
      {!collapsed && (
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>
            Type{' '}
            <select
              value={effect.type}
              onChange={(e) => {
                const t = e.target.value;
                if (t === 'damage')
                  onChange({ type: 'damage', element: 'physical', multiplier: 1 });
                else if (t === 'heal') onChange({ type: 'heal', multiplier: 1 });
                else if (t === 'apply_status')
                  onChange({ type: 'apply_status', statusId: 'status_burn', chance: 0.3 });
                else if (t === 'move') onChange({ type: 'move', range: 1 });
                else if (t === 'teleport') onChange({ type: 'teleport', range: 1 });
              }}
            >
              {['damage', 'heal', 'apply_status', 'move', 'teleport'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <EffectFields effect={effect} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

export function EffectBuilder({
  effects,
  onChange,
}: {
  effects: SkillEffect[];
  onChange: (effects: SkillEffect[]) => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);
    onChange(arrayMove(effects, oldIndex, newIndex));
  };

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext
          items={effects.map((_, i) => String(i))}
          strategy={verticalListSortingStrategy}
        >
          {effects.map((effect, index) => (
            <SortableBlock
              key={index}
              index={index}
              effect={effect}
              collapsed={collapsed[index] ?? false}
              onToggle={() => setCollapsed((c) => ({ ...c, [index]: !c[index] }))}
              onChange={(e) => {
                const next = [...effects];
                next[index] = e;
                onChange(next);
              }}
              onDuplicate={() =>
                onChange([
                  ...effects.slice(0, index + 1),
                  structuredClone(effect),
                  ...effects.slice(index + 1),
                ])
              }
              onDelete={() => onChange(effects.filter((_, i) => i !== index))}
            />
          ))}
        </SortableContext>
      </DndContext>
      <button
        type="button"
        onClick={() =>
          onChange([...effects, { type: 'damage', element: 'physical', multiplier: 1 }])
        }
        style={{
          marginTop: 8,
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px dashed #555',
          background: 'transparent',
          color: '#8ab4f8',
        }}
      >
        + Add Effect
      </button>
    </div>
  );
}
