export type EventHandler<T> = (event: T) => void;

export class EventBus<TEvent extends { type: string }> {
  private handlers = new Map<string, Set<EventHandler<TEvent>>>();

  subscribe<E extends TEvent['type']>(
    type: E,
    handler: EventHandler<Extract<TEvent, { type: E }>>,
  ): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    const set = this.handlers.get(type)!;
    set.add(handler as EventHandler<TEvent>);

    return () => {
      set.delete(handler as EventHandler<TEvent>);
    };
  }

  emit(event: TEvent): void {
    const handlers = this.handlers.get(event.type);
    if (!handlers) return;
    for (const handler of handlers) {
      handler(event);
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}
