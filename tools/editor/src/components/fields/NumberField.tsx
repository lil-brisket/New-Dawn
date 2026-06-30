import { field, input } from './styles';
import { ValidationMessage } from './ValidationMessage';

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  warning,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  warning?: string;
}) {
  return (
    <label style={field}>
      {label}
      <input
        style={input}
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {warning && <ValidationMessage message={warning} />}
    </label>
  );
}
