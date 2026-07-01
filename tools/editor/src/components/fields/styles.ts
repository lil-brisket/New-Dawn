import type { CSSProperties } from 'react';

export const field: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  marginBottom: 0,
};

export const input: CSSProperties = {
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid #3a3a48',
  background: '#16161e',
  color: '#eee',
  width: '100%',
};

export const labelRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  flexWrap: 'wrap',
};

export const sectionTitle: CSSProperties = {
  margin: '0 0 12px',
  fontSize: 12,
  fontWeight: 600,
  color: '#9aa0b4',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

export const sectionCard: CSSProperties = {
  background: '#1e1e28',
  border: '1px solid #2e2e3a',
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
};

export const fieldGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: 12,
};

export const btnSecondary: CSSProperties = {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #3a3a48',
  background: '#252530',
  color: '#e8e6e3',
  fontSize: 13,
};

export const btnGhost: CSSProperties = {
  ...btnSecondary,
  background: 'transparent',
  color: '#8ab4f8',
};

export const hint: CSSProperties = {
  fontSize: 11,
  color: '#6b7280',
  marginTop: 2,
};
