import type { ContentDomain } from '@dawn/content-pipeline/domains';
import { ID_PATTERN_HINTS, ID_PATTERNS } from './constants';
import { ValidationMessage } from './ValidationMessage';
import { field, hint, input } from './styles';

export function validateContentId(domain: 'skills' | 'statuses', id: string): string | undefined {
  const trimmed = id.trim();
  if (!trimmed) return 'ID is required';
  if (!ID_PATTERNS[domain].test(trimmed)) {
    return `Must match ${ID_PATTERN_HINTS[domain]}`;
  }
  return undefined;
}

export function IdField({
  domain,
  value,
  readOnly = true,
  onChange,
}: {
  domain: ContentDomain;
  value: string;
  readOnly?: boolean;
  onChange?: (id: string) => void;
}) {
  if (domain !== 'skills' && domain !== 'statuses') {
    return (
      <label style={field}>
        ID
        <input style={input} value={value} readOnly />
      </label>
    );
  }

  const error = validateContentId(domain, value);

  return (
    <label style={field}>
      ID
      <input
        style={{
          ...input,
          borderColor: error && value ? '#c0392b' : undefined,
        }}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={ID_PATTERN_HINTS[domain]}
      />
      <span style={hint}>{ID_PATTERN_HINTS[domain]}</span>
      {error && value && <ValidationMessage message={error} />}
    </label>
  );
}
