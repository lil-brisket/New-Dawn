import type { CSSProperties } from 'react';

export const field: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  marginBottom: 12,
};

export const input: CSSProperties = {
  padding: '6px 8px',
  borderRadius: 4,
  border: '1px solid #444',
  background: '#1a1a22',
  color: '#eee',
};

export const labelRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
};

export const sectionTitle: CSSProperties = {
  margin: '16px 0 8px',
  fontSize: 14,
  color: '#aaa',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};
