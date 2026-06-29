import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../../../theme';
import { TopBar } from './TopBar';

function wrap(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('TopBar', () => {
  it('renders title and subtitle', () => {
    const { getByText } = wrap(<TopBar title="Main" subtitle="Sub" />);
    expect(getByText('Main')).toBeTruthy();
    expect(getByText('Sub')).toBeTruthy();
  });
});
