/** Semantic color tokens — surfaces, borders, text, effects */
export const semantic = {
  surface: '#0F0B1E',
  surfaceElevated: '#1A1530',
  surfaceGlass: 'rgba(35, 29, 58, 0.72)',
  surfacePressed: '#2E2648',
  surfaceDisabled: 'rgba(35, 29, 58, 0.5)',
  border: '#3D3560',
  borderStrong: '#524A78',
  textPrimary: '#F5F0FF',
  textSecondary: '#A89EC8',
  textMuted: '#6B6088',
  overlay: 'rgba(15, 11, 30, 0.85)',
  glow: 'rgba(107, 78, 255, 0.35)',
} as const;

export type SemanticColors = typeof semantic;
