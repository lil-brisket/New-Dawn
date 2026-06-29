import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../../../theme';
import { Window } from './Window';

function wrap(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Window', () => {
  it('renders compound sections', () => {
    const { getByText } = wrap(
      <Window>
        <Window.Header title="Quest" />
        <Window.Body>Body content</Window.Body>
        <Window.Footer>Footer actions</Window.Footer>
      </Window>,
    );
    expect(getByText('Quest')).toBeTruthy();
    expect(getByText('Body content')).toBeTruthy();
    expect(getByText('Footer actions')).toBeTruthy();
  });

  it('renders scrollable body', () => {
    const { getByText } = wrap(
      <Window>
        <Window.Body scrollable>Scroll content</Window.Body>
      </Window>,
    );
    expect(getByText('Scroll content')).toBeTruthy();
  });
});
