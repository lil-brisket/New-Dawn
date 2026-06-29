import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../../../theme';
import { Avatar } from './Avatar';

function wrap(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Avatar', () => {
  it('renders initials', () => {
    const { getByText } = wrap(<Avatar initials="AB" />);
    expect(getByText('A')).toBeTruthy();
  });

  it('renders with rarity border', () => {
    const { getByLabelText } = wrap(
      <Avatar initials="X" rarity="epic" accessibilityLabel="Player" />,
    );
    expect(getByLabelText('Player')).toBeTruthy();
  });
});
