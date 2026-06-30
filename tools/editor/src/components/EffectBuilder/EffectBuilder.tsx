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
import { EFFECT_TYPES } from '../fields/constants';
import { EnumSelect } from '../fields/EnumSelect';
import {
  ApplyStatusEffectEditor,
  DamageEffectEditor,
  HealEffectEditor,
  RangeEffectEditor,
  SummonEffectEditor,
  createDefaultEffect,
} from './editors';

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
    return <DamageEffectEditor effect={effect} onChange={onChange} />;
  }
  if (effect.type === 'heal') {
    return <HealEffectEditor effect={effect} onChange={onChange} />;
  }
  if (effect.type === 'apply_status') {
    return <ApplyStatusEffectEditor effect={effect} onChange={onChange} />;
  }
  if (effect.type === 'move' || effect.type === 'teleport') {
    return <RangeEffectEditor effect={effect} onChange={onChange} />;
  }
  if (effect.type === 'summon') {
    return <SummonEffectEditor effect={effect} onChange={onChange} />;
  }
  return <span>{(effect as SkillEffect).type}</span>;
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
          Duplicate
        </button>
        <button type="button" onClick={onDelete}>
          Delete
        </button>
      </div>
      {!collapsed && (
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>
            Type{' '}
            <EnumSelect
              value={effect.type}
              options={[...EFFECT_TYPES]}
              onChange={(t) => t && onChange(createDefaultEffect(t))}
            />
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
  single = false,
}: {
  effects: SkillEffect[];
  onChange: (effects: SkillEffect[]) => void;
  single?: boolean;
}) {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const [addType, setAddType] = useState<SkillEffect['type']>('damage');
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

  const collapseAll = () => {
    const next: Record<number, boolean> = {};
    effects.forEach((_, i) => {
      next[i] = true;
    });
    setCollapsed(next);
  };

  const expandAll = () => setCollapsed({});

  return (
    <div>
      {effects.length > 1 && !single && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button type="button" onClick={collapseAll} style={{ fontSize: 12 }}>
            Collapse all
          </button>
          <button type="button" onClick={expandAll} style={{ fontSize: 12 }}>
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
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
          <EnumSelect
            value={addType}
            options={[...EFFECT_TYPES]}
            onChange={(t) => t && setAddType(t)}
          />
          <button
            type="button"
            onClick={() => onChange([...effects, createDefaultEffect(addType)])}
            style={{
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
      )}
      {single && effects.length === 0 && (
        <button type="button" onClick={() => onChange([createDefaultEffect('damage')])}>
          + Add trigger effect
        </button>
      )}
    </div>
  );
}
