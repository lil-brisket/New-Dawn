import type { ContentDomain } from '@dawn/content-pipeline';
import type { ElementType } from '@dawn/types';
import { ELEMENTS, SKILL_CATEGORIES } from './constants';
import { ContentRefSelect } from './ContentRefSelect';
import { EnumSelect } from './EnumSelect';
import { TagSelect } from './TagSelect';
import { field, input, sectionTitle } from './styles';
import type { ContentRefOption } from './ContentRefSelect';

export function MetadataSection({
  draft,
  onChange,
  inheritOptions,
  inheritDomain,
}: {
  draft: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
  inheritOptions?: ContentRefOption[];
  inheritDomain?: ContentDomain;
}) {
  const set = (key: string, value: unknown) => onChange({ ...draft, [key]: value });
  const tags = (draft.tags as string[] | undefined) ?? [];

  return (
    <section>
      <h3 style={sectionTitle}>Metadata</h3>
      <label style={field}>
        Category
        <EnumSelect
          value={String(draft.category ?? '')}
          options={[...SKILL_CATEGORIES]}
          allowEmpty
          onChange={(v) => set('category', v)}
        />
      </label>
      <label style={field}>
        Element
        <EnumSelect
          value={String(draft.element ?? '')}
          options={[...ELEMENTS]}
          allowEmpty
          onChange={(v) => set('element', v)}
        />
      </label>
      <TagSelect value={tags} onChange={(t) => set('tags', t)} />
      <label style={field}>
        Icon
        <input
          style={input}
          value={String(draft.iconId ?? '')}
          onChange={(e) => set('iconId', e.target.value)}
          placeholder="icon_skill_name (Select Asset… later)"
        />
      </label>
      {inheritOptions && inheritDomain && (
        <ContentRefSelect
          value={String(draft.inherits ?? '')}
          options={inheritOptions}
          allowEmpty
          emptyLabel="(no inheritance)"
          onChange={(id) => set('inherits', id)}
        />
      )}
      {inheritOptions && !inheritDomain && (
        <label style={field}>
          Inherits
          <input
            style={input}
            value={String(draft.inherits ?? '')}
            onChange={(e) => set('inherits', e.target.value || undefined)}
          />
        </label>
      )}
    </section>
  );
}

export type { ElementType };
