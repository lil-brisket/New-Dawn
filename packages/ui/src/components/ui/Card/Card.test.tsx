import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Text } from 'react-native';
import { ThemeProvider } from '../../../theme';
import { Card } from './Card';

function wrap(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Card', () => {
  it('renders compound subcomponents', () => {
    const { getByText } = wrap(
      <Card variant="elevated">
        <Card.Header>Header</Card.Header>
        <Card.Body>Body</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>,
    );
    expect(getByText('Header')).toBeTruthy();
    expect(getByText('Body')).toBeTruthy();
    expect(getByText('Footer')).toBeTruthy();
  });

  it('renders default variant', () => {
    const { getByText } = wrap(
      <Card>
        <Card.Body>
          <Text>Content</Text>
        </Card.Body>
      </Card>,
    );
    expect(getByText('Content')).toBeTruthy();
  });
});
