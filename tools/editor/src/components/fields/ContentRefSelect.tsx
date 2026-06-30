import type { ElementType } from '@dawn/types';
import { ELEMENT_EMOJI } from './constants';
import { EnumSelect } from './EnumSelect';
import { field } from './styles';

export type ContentRefOption = {
  id: string;
  name: string;
  element?: ElementType;
};

function formatLabel(opt: ContentRefOption): string {
  const prefix = opt.element ? `${ELEMENT_EMOJI[opt.element]} ` : '';
  return `${prefix}${opt.name}`;
}

export function ContentRefSelect({
  value,
  options,
  onChange,
  allowEmpty,
  emptyLabel = '(none)',
}: {
  value: string;
  options: ContentRefOption[];
  onChange: (id: string | undefined) => void;
  allowEmpty?: boolean;
  emptyLabel?: string;
}) {
  const selectOptions = options.map((o) => ({
    value: o.id,
    label: formatLabel(o),
  }));

  return (
    <label style={field}>
      <EnumSelect
        value={value}
        options={selectOptions}
        allowEmpty={allowEmpty}
        emptyLabel={emptyLabel}
        onChange={(v) => onChange(v)}
      />
    </label>
  );
}

export function ContentRefMultiSelect({
  value,
  options,
  onChange,
}: {
  value: string[];
  options: ContentRefOption[];
  onChange: (ids: string[]) => void;
}) {
  const available = options.filter((o) => !value.includes(o.id));

  return (
    <div style={field}>
      <span>Selected</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {value.map((id) => {
          const opt = options.find((o) => o.id === id);
          return (
            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ flex: 1 }}>{opt ? formatLabel(opt) : id}</span>
              <button type="button" onClick={() => onChange(value.filter((x) => x !== id))}>
                ✕
              </button>
            </div>
          );
        })}
      </div>
      {available.length > 0 && (
        <select
          style={{ marginTop: 4 }}
          value=""
          onChange={(e) => {
            if (e.target.value) onChange([...value, e.target.value]);
          }}
        >
          <option value="">+ Add…</option>
          {available.map((o) => (
            <option key={o.id} value={o.id}>
              {formatLabel(o)}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
