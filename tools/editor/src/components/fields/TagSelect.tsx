import { useState } from 'react';
import { COMMON_TAGS, TAG_COLORS } from './constants';
import { field, input } from './styles';

function tagColor(tag: string): string {
  return TAG_COLORS[tag.toLowerCase()] ?? '#6a6a7a';
}

export function TagSelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [custom, setCustom] = useState('');
  const selected = new Set(value.map((t) => t.toLowerCase()));

  const toggle = (tag: string) => {
    const lower = tag.toLowerCase();
    if (selected.has(lower)) {
      onChange(value.filter((t) => t.toLowerCase() !== lower));
    } else {
      onChange([...value, lower]);
    }
  };

  const addCustom = () => {
    const t = custom.trim().toLowerCase();
    if (!t || selected.has(t)) return;
    onChange([...value, t]);
    setCustom('');
  };

  const allTags = [
    ...COMMON_TAGS.map((t) => t.tag),
    ...value.filter((t) => !COMMON_TAGS.some((c) => c.tag === t.toLowerCase())),
  ];
  const uniqueTags = [...new Set(allTags.map((t) => t.toLowerCase()))];

  return (
    <div style={field}>
      <span>Tags</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {uniqueTags.map((tag) => {
          const active = selected.has(tag);
          const color = tagColor(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              style={{
                padding: '4px 10px',
                borderRadius: 12,
                border: `1px solid ${active ? color : '#444'}`,
                background: active ? `${color}33` : 'transparent',
                color: active ? color : '#888',
                fontSize: 12,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        <input
          style={{ ...input, flex: 1 }}
          value={custom}
          placeholder="Add custom tag…"
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())}
        />
        <button type="button" onClick={addCustom} style={{ padding: '6px 10px' }}>
          Add
        </button>
      </div>
    </div>
  );
}
