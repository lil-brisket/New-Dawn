import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, act, fireEvent } from '@testing-library/react';
import { Text } from 'react-native';
import { ThemeProvider } from '../../../theme';
import { ToastProvider, useToast } from './Toast';

function ToastConsumer() {
  const t = useToast();
  return <Text onPress={() => t.success('Saved')}>trigger</Text>;
}

describe('Toast', () => {
  it('useToast enqueues success toast', () => {
    const { getByText } = render(
      <ThemeProvider>
        <ToastProvider>
          <ToastConsumer />
        </ToastProvider>
      </ThemeProvider>,
    );
    act(() => {
      fireEvent.click(getByText('trigger'));
    });
    expect(getByText('Saved')).toBeTruthy();
  });
});
