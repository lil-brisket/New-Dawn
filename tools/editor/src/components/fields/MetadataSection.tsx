import type { ContentDomain } from '@dawn/content-pipeline/domains';
import type { ElementType } from '@dawn/types';
import type { SkillEffect } from '@dawn/types';
import { EFFECT_ELEMENT_OPTIONS } from './constants';
import { skillElementToDamageElement } from './elementUtils';
import { EnumSelect } from './EnumSelect';
import { IconField } from './IconField';
import { field, fieldGrid, sectionCard, sectionTitle } from './styles';

export function MetadataSection({
  draft,
  onChange,
}: {
  draft: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const set = (key: string, value: unknown) => onChange({ ...draft, [key]: value });

  return (
    <section style={sectionCard}>
      <h3 style={sectionTitle}>Properties</h3>
      <div style={fieldGrid}>
        <label style={field}>
          Element
          <EnumSelect
            value={String(draft.element ?? '')}
            options={EFFECT_ELEMENT_OPTIONS}
            onChange={(v) => {
              const element = (v || undefined) as ElementType | undefined;
              const damageElement = skillElementToDamageElement(v as ElementType | '');
              const effects = Array.isArray(draft.effects)
                ? (draft.effects as SkillEffect[]).map((effect) =>
                    effect.type === 'damage' ? { ...effect, element: damageElement } : effect,
                  )
                : draft.effects;
              onChange({ ...draft, element, effects });
            }}
          />
        </label>
      </div>
      <IconField iconId={String(draft.iconId ?? '')} onChange={(iconId) => set('iconId', iconId)} />
    </section>
  );
}

// Keep domain in signature for call-site compatibility.
export type MetadataSectionProps = {
  draft: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
  inheritOptions?: unknown;
  inheritDomain?: ContentDomain;
};
