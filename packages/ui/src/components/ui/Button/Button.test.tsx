import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../../theme';
import { Button } from './Button';

function wrap(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Button', () => {
  it('renders title', () => {
    const { getByText } = wrap(<Button title="Press me" onPress={() => {}} />);
    expect(getByText('Press me')).toBeTruthy();
  });

  it('fires onPress', () => {
    const onPress = vi.fn();
    const { getByLabelText } = wrap(
      <Button title="Tap" onPress={onPress} accessibilityLabel="Tap" />,
    );
    fireEvent.click(getByLabelText('Tap'));
    expect(onPress).toHaveBeenCalledOnce();
  });

  it('does not fire onPress when disabled', () => {
    const onPress = vi.fn();
    const { getByLabelText } = wrap(
      <Button title="Tap" disabled onPress={onPress} accessibilityLabel="Tap" />,
    );
    fireEvent.click(getByLabelText('Tap'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('hides title when loading', () => {
    const { queryByText } = wrap(<Button title="Load" loading onPress={() => {}} />);
    expect(queryByText('Load')).toBeNull();
  });

  it('has accessibilityRole button', () => {
    const { getByRole } = wrap(<Button title="Action" onPress={() => {}} />);
    expect(getByRole('button')).toBeTruthy();
  });

  it('renders primary variant', () => {
    const { getByText } = wrap(<Button title="Primary" variant="primary" onPress={() => {}} />);
    expect(getByText('Primary')).toBeTruthy();
  });
});
