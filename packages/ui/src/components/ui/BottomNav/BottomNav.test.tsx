import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Text } from 'react-native';
import { ThemeProvider } from '../../../theme';
import { BottomNav } from './BottomNav';

function wrap(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('BottomNav', () => {
  it('calls onPress for items', () => {
    const onPress = vi.fn();
    const { getByLabelText } = wrap(
      <BottomNav items={[{ label: 'Home', active: true, icon: <Text>H</Text>, onPress }]} />,
    );
    fireEvent.click(getByLabelText('Home'));
    expect(onPress).toHaveBeenCalledOnce();
  });

  it('renders active state label', () => {
    const { getByText } = wrap(
      <BottomNav
        items={[
          { label: 'Active', active: true, icon: <Text>A</Text>, onPress: () => {} },
          { label: 'Inactive', active: false, icon: <Text>I</Text>, onPress: () => {} },
        ]}
      />,
    );
    expect(getByText('Active')).toBeTruthy();
    expect(getByText('Inactive')).toBeTruthy();
  });
});
