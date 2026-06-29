import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../../theme';
import { Modal } from './Modal';
import { Button } from '../Button';

function wrap(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Modal', () => {
  it('renders when visible', () => {
    const { getByText } = wrap(
      <Modal visible onOpenChange={() => {}}>
        <Modal.Content>
          <Modal.Header title="Test Modal" />
        </Modal.Content>
      </Modal>,
    );
    expect(getByText('Test Modal')).toBeTruthy();
  });

  it('calls onOpenChange when dismissed', () => {
    const onOpenChange = vi.fn();
    const { getByText } = wrap(
      <Modal visible onOpenChange={onOpenChange} dismissible>
        <Modal.Content>
          <Modal.Header title="Close me" />
          <Modal.Footer>
            <Button title="Close" onPress={() => onOpenChange(false)} />
          </Modal.Footer>
        </Modal.Content>
      </Modal>,
    );
    fireEvent.click(getByText('Close'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
