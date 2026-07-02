import type { ContentListItem } from '../api/contentApi';

const panel: React.CSSProperties = {
  width: 240,
  borderRight: '1px solid #2a2a35',
  display: 'flex',
  flexDirection: 'column',
  background: '#16161d',
};

const search: React.CSSProperties = {
  margin: 12,
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid #333',
  background: '#1a1a22',
  color: '#eee',
};

const list: React.CSSProperties = { flex: 1, overflow: 'auto', padding: '0 8px 8px' };

const itemBtn = (active: boolean): React.CSSProperties => ({
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '8px 10px',
  marginBottom: 4,
  border: 'none',
  borderRadius: 6,
  background: active ? '#353545' : 'transparent',
  color: active ? '#fff' : '#bbb',
});

export function ContentList({
  items,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelect,
  onNew,
  showItemId = true,
  showNewButton = true,
}: {
  items: ContentListItem[];
  selectedId: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelect: (id: string) => void;
  onNew: () => void;
  showItemId?: boolean;
  showNewButton?: boolean;
}) {
  return (
    <div style={panel}>
      <input
        style={search}
        placeholder="Search id, name, tag…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {showNewButton ? (
        <button
          type="button"
          style={{
            margin: '0 12px 8px',
            padding: '8px',
            borderRadius: 6,
            border: '1px dashed #555',
            background: 'transparent',
            color: '#8ab4f8',
          }}
          onClick={onNew}
        >
          + New
        </button>
      ) : null}
      <div style={list}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            style={itemBtn(item.id === selectedId)}
            onClick={() => onSelect(item.id)}
          >
            <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
            {showItemId ? <div style={{ fontSize: 11, color: '#777' }}>{item.id}</div> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
