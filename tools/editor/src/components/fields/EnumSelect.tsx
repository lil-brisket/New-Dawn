import { input } from './styles';

export function EnumSelect<T extends string>({
  value,
  options,
  onChange,
  allowEmpty,
  emptyLabel = '(none)',
}: {
  value: T | '';
  options: readonly T[] | readonly { value: T; label: string }[];
  onChange: (value: T | undefined) => void;
  allowEmpty?: boolean;
  emptyLabel?: string;
}) {
  const normalized = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));

  return (
    <select
      style={input}
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === '' ? undefined : (v as T));
      }}
    >
      {allowEmpty && <option value="">{emptyLabel}</option>}
      {normalized.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
