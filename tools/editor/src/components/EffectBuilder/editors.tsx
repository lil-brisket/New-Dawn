import type { ApplyTagEffect, ElementType, TagBehaviorOverrides } from '@dawn/types';
import { NumberField } from '../fields/NumberField';
import { ContentRefSelect } from '../fields/ContentRefSelect';
import { FormulaEditor } from '../fields/FormulaEditor';
import { EnumSelect } from '../fields/EnumSelect';
import { EFFECT_ELEMENT_OPTIONS } from '../fields/constants';
import { field } from '../fields/styles';
import { useTagOptions } from '../../hooks/useContentOptions';

const DEFAULT_DAMAGE_VALUE = {
  base: 0,
  terms: [{ source: 'stat' as const, key: 'attack', ratio: 1 }],
};

export function ApplyTagEffectEditor({
  effect,
  onChange,
}: {
  effect: ApplyTagEffect;
  onChange: (e: ApplyTagEffect) => void;
}) {
  const tagOptions = useTagOptions();
  const overrides = effect.overrides ?? {};
  const tagLabel = tagOptions.find((t) => t.id === effect.tagId)?.name ?? effect.tagId;

  const setOverrides = (next: TagBehaviorOverrides) => onChange({ ...effect, overrides: next });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={field}>
        Tag
        <ContentRefSelect
          value={effect.tagId}
          options={tagOptions}
          onChange={(id) => id && onChange({ ...effect, tagId: id })}
        />
      </label>
      <NumberField
        label="Chance"
        value={effect.chance}
        min={0}
        max={1}
        step={0.05}
        onChange={(chance) => onChange({ ...effect, chance })}
      />
      <NumberField
        label="Duration override (turns, optional)"
        value={effect.duration ?? 0}
        min={0}
        onChange={(duration) =>
          onChange({ ...effect, duration: duration > 0 ? duration : undefined })
        }
      />

      {(effect.tagId === 'tag_damage' ||
        effect.tagId === 'tag_pierce' ||
        overrides.instant_damage) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={field}>
            Element override
            <EnumSelect
              value={overrides.instant_damage?.element ?? ''}
              options={EFFECT_ELEMENT_OPTIONS}
              onChange={(v) =>
                setOverrides({
                  ...overrides,
                  instant_damage: {
                    ...overrides.instant_damage,
                    element: (v || 'physical') as ElementType,
                  },
                })
              }
            />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <input
              type="checkbox"
              checked={overrides.instant_damage?.pierce === true}
              onChange={(e) =>
                setOverrides({
                  ...overrides,
                  instant_damage: {
                    ...overrides.instant_damage,
                    pierce: e.target.checked ? true : undefined,
                  },
                })
              }
            />
            Pierce
          </label>
          <FormulaEditor
            label="Damage formula override"
            value={overrides.instant_damage?.value ?? DEFAULT_DAMAGE_VALUE}
            onChange={(value) =>
              setOverrides({
                ...overrides,
                instant_damage: { ...overrides.instant_damage, value },
              })
            }
          />
        </div>
      )}

      {(effect.tagId === 'tag_instant_heal' || overrides.instant_heal) && (
        <FormulaEditor
          label="Heal formula override"
          value={
            overrides.instant_heal?.value ?? {
              base: 0,
              terms: [{ source: 'stat', key: 'willpower', ratio: 1 }],
            }
          }
          onChange={(value) =>
            setOverrides({ ...overrides, instant_heal: { ...overrides.instant_heal, value } })
          }
        />
      )}

      {(effect.tagId === 'tag_move' || overrides.move || overrides.teleport) && (
        <>
          <NumberField
            label="Range override"
            value={overrides.move?.range ?? overrides.teleport?.range ?? 1}
            min={0}
            onChange={(range) =>
              setOverrides({
                ...overrides,
                move: { ...overrides.move, range, teleport: overrides.move?.teleport },
              })
            }
          />
          {effect.tagId === 'tag_move' ? (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <input
                type="checkbox"
                checked={overrides.move?.teleport === true}
                onChange={(e) =>
                  setOverrides({
                    ...overrides,
                    move: { ...overrides.move, teleport: e.target.checked ? true : undefined },
                  })
                }
              />
              Teleport (tile targeting)
            </label>
          ) : null}
        </>
      )}

      <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>Applying: {tagLabel}</p>
    </div>
  );
}

export function createDefaultEffect(_type?: string, skillElement?: ElementType): ApplyTagEffect {
  void skillElement;
  return {
    type: 'apply_tag',
    tagId: 'tag_damage',
    chance: 1,
    overrides: {
      instant_damage: {
        element: 'physical',
        value: DEFAULT_DAMAGE_VALUE,
      },
    },
  };
}
