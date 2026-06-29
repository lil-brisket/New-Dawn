import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, useTheme } from '../ThemeProvider';

describe('ThemeProvider', () => {
  it('resolves theme from setMode', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider initialPreference="dark">{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.resolvedMode).toBe('dark');
    expect(result.current.theme.colors.background).toBe(result.current.theme.colors.background);

    act(() => {
      result.current.setMode('light');
    });

    expect(result.current.mode).toBe('light');
    expect(result.current.resolvedMode).toBe('light');
  });
});
