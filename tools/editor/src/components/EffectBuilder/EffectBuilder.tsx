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
import type { ApplyTagEffect } from '@dawn/types';
import { btnGhost } from '../fields/styles';
import { ApplyTagEffectEditor, createDefaultEffect } from './editors';
import { useTagOptions } from '../../hooks/useContentOptions';

const block: React.CSSProperties = {
  background: '#252530',
  borderRadius: 10,
  marginBottom: 10,
  border: '1px solid #2e2e3a',
};

function SortableBlock({
  effect,
  index,
  collapsed,
  onToggle,
  onChange,
  onDuplicate,
  onDelete,
  tagLabel,
}: {
  effect: ApplyTagEffect;
  index: number;
  collapsed: boolean;
  onToggle: () => void;
  onChange: (e: ApplyTagEffect) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  tagLabel: string;
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
          padding: '10px 14px',
          borderBottom: collapsed ? undefined : '1px solid #2e2e3a',
        }}
      >
        <span {...attributes} {...listeners} style={{ cursor: 'grab', color: '#666' }}>
          ⠿
        </span>
        <strong>{index + 1}.</strong>
        <span style={{ flex: 1 }}>{tagLabel}</span>
        <button type="button" style={btnGhost} onClick={onToggle}>
          {collapsed ? '▸' : '▾'}
        </button>
        <button type="button" style={btnGhost} onClick={onDuplicate}>
          Duplicate
        </button>
        <button type="button" style={btnGhost} onClick={onDelete}>
          Delete
        </button>
      </div>
      {!collapsed && (
        <div style={{ padding: 14 }}>
          <ApplyTagEffectEditor effect={effect} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

export function EffectBuilder({
  effects,
  onChange,
  single = false,
}: {
  effects: ApplyTagEffect[];
  onChange: (effects: ApplyTagEffect[]) => void;
  single?: boolean;
}) {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const tagOptions = useTagOptions();
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

  const labelFor = (effect: ApplyTagEffect) =>
    tagOptions.find((t) => t.id === effect.tagId)?.name ?? effect.tagId;

  return (
    <div>
      {effects.length > 1 && !single && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button
            type="button"
            style={btnGhost}
            onClick={() => {
              const next: Record<number, boolean> = {};
              effects.forEach((_, i) => {
                next[i] = true;
              });
              setCollapsed(next);
            }}
          >
            Collapse all
          </button>
          <button type="button" style={btnGhost} onClick={() => setCollapsed({})}>
            Expand all
          </button>
        </div>
      )}
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
              tagLabel={labelFor(effect)}
              collapsed={collapsed[index] ?? false}
              onToggle={() => setCollapsed((c) => ({ ...c, [index]: !c[index] }))}
              onChange={(e) => {
                const next = [...effects];
                next[index] = e;
                onChange(next);
              }}
              onDuplicate={() => {
                if (single) return;
                onChange([
                  ...effects.slice(0, index + 1),
                  structuredClone(effect),
                  ...effects.slice(index + 1),
                ]);
              }}
              onDelete={() => onChange(single ? [] : effects.filter((_, i) => i !== index))}
            />
          ))}
        </SortableContext>
      </DndContext>
      {!single && (
        <button
          type="button"
          onClick={() => onChange([...effects, createDefaultEffect()])}
          style={btnGhost}
        >
          + Add Tag Effect
        </button>
      )}
      {single && effects.length === 0 && (
        <button type="button" style={btnGhost} onClick={() => onChange([createDefaultEffect()])}>
          + Add trigger tag
        </button>
      )}
    </div>
  );
}
