import { describe, expect, it, vi } from 'vitest';
import { EventBus } from './EventBus';

describe('EventBus', () => {
  it('subscribes and emits events', () => {
    const bus = new EventBus<{ type: 'test'; value: number }>();
    const handler = vi.fn();
    bus.subscribe('test', handler);
    bus.emit({ type: 'test', value: 42 });
    expect(handler).toHaveBeenCalledWith({ type: 'test', value: 42 });
  });

  it('unsubscribes via returned function', () => {
    const bus = new EventBus<{ type: 'test'; value: number }>();
    const handler = vi.fn();
    const unsub = bus.subscribe('test', handler);
    unsub();
    bus.emit({ type: 'test', value: 1 });
    expect(handler).not.toHaveBeenCalled();
  });
});
