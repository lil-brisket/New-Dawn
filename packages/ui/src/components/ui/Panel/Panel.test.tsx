import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../../../theme';
import { Panel } from './Panel';
import { Icon } from '../Icon';

function wrap(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Panel', () => {
  it('renders title and subtitle in header', () => {
    const { getByText } = wrap(
      <Panel>
        <Panel.Header title="Title" subtitle="Subtitle" icon={<Icon name="P" />} />
      </Panel>,
    );
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Subtitle')).toBeTruthy();
  });
});
