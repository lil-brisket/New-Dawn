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
import type { ElementType, SkillEffect } from '@dawn/types';
import { EFFECT_TYPES } from '../fields/constants';
import { EnumSelect } from '../fields/EnumSelect';
import { btnGhost } from '../fields/styles';
import {
  ApplyStatusEffectEditor,
  DamageEffectEditor,
  HealEffectEditor,
  RangeEffectEditor,
  SummonEffectEditor,
  ShieldEffectEditor,
  createDefaultEffect,
} from './editors';

const block: React.CSSProperties = {
  background: '#252530',
  borderRadius: 10,
  marginBottom: 10,
  border: '1px solid #2e2e3a',
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
  if (effect.type === 'move') {
    return <RangeEffectEditor effect={effect} onChange={onChange} />;
  }
  if (effect.type === 'summon') {
    return <SummonEffectEditor effect={effect} onChange={onChange} />;
  }
  if (effect.type === 'shield') {
    return <ShieldEffectEditor effect={effect} onChange={onChange} />;
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

  const typeLabel = EFFECT_TYPES.find((t) => t.value === effect.type)?.label ?? effect.type;

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
        <span style={{ flex: 1 }}>{typeLabel}</span>
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
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            Type
            <EnumSelect
              value={effect.type === 'teleport' ? 'move' : effect.type}
              options={[...EFFECT_TYPES]}
              onChange={(t) => t && onChange(createDefaultEffect(t, skillElement))}
            />
          </label>
          <EffectFields
            effect={effect.type === 'teleport' ? { type: 'move', range: effect.range } : effect}
            onChange={onChange}
          />
        </div>
      )}
    </div>
  );
}

export function EffectBuilder({
  effects,
  onChange,
  single = false,
  skillElement,
}: {
  effects: SkillEffect[];
  onChange: (effects: SkillEffect[]) => void;
  single?: boolean;
  skillElement?: ElementType;
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
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 }}>
          <EnumSelect
            value={addType}
            options={[...EFFECT_TYPES]}
            onChange={(t) => t && setAddType(t)}
          />
          <button
            type="button"
            onClick={() => onChange([...effects, createDefaultEffect(addType, skillElement)])}
            style={btnGhost}
          >
            + Add Effect
          </button>
        </div>
      )}
      {single && effects.length === 0 && (
        <button
          type="button"
          style={btnGhost}
          onClick={() => onChange([createDefaultEffect('damage', skillElement)])}
        >
          + Add trigger effect
        </button>
      )}
    </div>
  );
}
