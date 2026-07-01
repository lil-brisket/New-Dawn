import { useEffect, useState } from 'react';
import { listAssets } from '../../api/contentApi';
import { EnumSelect } from './EnumSelect';
import { btnGhost, btnSecondary, field, fieldGrid, hint, input, labelRow } from './styles';

type IconSource = 'library' | 'manual' | 'url';

export function IconField({
  iconId,
  onChange,
}: {
  iconId: string;
  onChange: (iconId: string) => void;
}) {
  const [source, setSource] = useState<IconSource>(
    iconId.startsWith('http') ? 'url' : iconId ? 'manual' : 'library',
  );
  const [library, setLibrary] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (source !== 'library') return;
    setLoading(true);
    listAssets('icons')
      .then(setLibrary)
      .catch(() => setLibrary([]))
      .finally(() => setLoading(false));
  }, [source]);

  return (
    <div style={field}>
      <span>Icon</span>
      <div style={fieldGrid}>
        <label style={field}>
          Source
          <EnumSelect
            value={source}
            options={[
              { value: 'library', label: 'Asset library' },
              { value: 'manual', label: 'Manual ID' },
              { value: 'url', label: 'Link / URL' },
            ]}
            onChange={(v) => v && setSource(v)}
          />
        </label>

        {source === 'library' && (
          <label style={field}>
            Asset
            {loading ? (
              <span style={hint}>Loading library…</span>
            ) : library.length === 0 ? (
              <span style={hint}>No icons in assets/icons yet</span>
            ) : (
              <EnumSelect
                value={iconId.startsWith('http') ? '' : iconId}
                options={library.map((id) => ({ value: id, label: id }))}
                allowEmpty
                emptyLabel="Select icon…"
                onChange={(v) => onChange(v ?? '')}
              />
            )}
          </label>
        )}

        {source === 'manual' && (
          <label style={field}>
            Icon ID
            <input
              style={input}
              value={iconId.startsWith('http') ? '' : iconId}
              placeholder="icon_skill_name"
              onChange={(e) => onChange(e.target.value)}
            />
          </label>
        )}

        {source === 'url' && (
          <label style={field}>
            Image URL
            <input
              style={input}
              value={iconId.startsWith('http') ? iconId : ''}
              placeholder="https://…"
              onChange={(e) => onChange(e.target.value)}
            />
          </label>
        )}
      </div>

      <div style={{ ...labelRow, marginTop: 8 }}>
        <button
          type="button"
          style={btnSecondary}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = () => {
              const file = input.files?.[0];
              if (!file) return;
              onChange(file.name.replace(/\.[^.]+$/, ''));
              setSource('manual');
            };
            input.click();
          }}
        >
          Upload file
        </button>
        <button type="button" style={btnGhost} onClick={() => setSource('library')}>
          Browse library
        </button>
      </div>
      {iconId && !iconId.startsWith('http') && (
        <img
          src={`/api/assets/icons/${iconId}`}
          alt=""
          style={{ marginTop: 8, width: 48, height: 48, objectFit: 'contain', borderRadius: 8 }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
    </div>
  );
}
