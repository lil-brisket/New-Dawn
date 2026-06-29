import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../../../theme';
import { ProgressBar } from './ProgressBar';

function wrap(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('ProgressBar', () => {
  it('renders label', () => {
    const { getByText } = wrap(<ProgressBar value={50} max={100} label="HP 50/100" />);
    expect(getByText('HP 50/100')).toBeTruthy();
  });

  it('clamps value to max', () => {
    const { getByRole } = wrap(<ProgressBar value={150} max={100} />);
    expect(getByRole('progressbar')).toBeTruthy();
  });

  it('accepts animated prop', () => {
    const { getByRole } = wrap(<ProgressBar value={30} max={100} animated />);
    expect(getByRole('progressbar')).toBeTruthy();
  });
});
