import { useEffect, useState } from 'react';
import { getReferences } from '../api/contentApi';

const panel: React.CSSProperties = {
  width: 220,
  borderLeft: '1px solid #2a2a35',
  padding: 16,
  background: '#16161d',
  fontSize: 13,
};

export function ReferencedByPanel({ id }: { id: string | null }) {
  const [refs, setRefs] = useState<{ usedBy: string[]; uses: string[] } | null>(null);

  useEffect(() => {
    if (!id) {
      setRefs(null);
      return;
    }
    getReferences(id).then(setRefs).catch(console.error);
  }, [id]);

  if (!id)
    return (
      <div style={panel}>
        <p style={{ color: '#666' }}>Select an item</p>
      </div>
    );

  return (
    <div style={panel}>
      <h3 style={{ margin: '0 0 12px', fontSize: 14 }}>Referenced By</h3>
      {refs?.usedBy.length ? (
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {refs.usedBy.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#666', margin: 0 }}>Nothing references this</p>
      )}
      <h3 style={{ margin: '16px 0 12px', fontSize: 14 }}>Uses</h3>
      {refs?.uses.length ? (
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {refs.uses.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#666', margin: 0 }}>No outgoing refs</p>
      )}
    </div>
  );
}
