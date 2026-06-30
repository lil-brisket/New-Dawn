import { useCallback, useEffect, useRef, useState } from 'react';

export function useUndoRedo<T>(initial: T) {
  const [state, setState] = useState(initial);
  const past = useRef<T[]>([]);
  const future = useRef<T[]>([]);
  const skipHistory = useRef(false);

  const set = useCallback((next: T | ((prev: T) => T)) => {
    setState((prev) => {
      const value = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
      if (!skipHistory.current) {
        past.current.push(structuredClone(prev));
        future.current = [];
      }
      skipHistory.current = false;
      return value;
    });
  }, []);

  const undo = useCallback(() => {
    const prev = past.current.pop();
    if (prev === undefined) return;
    future.current.push(structuredClone(state));
    skipHistory.current = true;
    setState(prev);
  }, [state]);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (next === undefined) return;
    past.current.push(structuredClone(state));
    skipHistory.current = true;
    setState(next);
  }, [state]);

  const reset = useCallback((value: T) => {
    past.current = [];
    future.current = [];
    skipHistory.current = true;
    setState(value);
  }, []);

  const clearHistory = useCallback(() => {
    past.current = [];
    future.current = [];
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (e.ctrlKey && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  return {
    state,
    set,
    undo,
    redo,
    reset,
    clearHistory,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
  };
}
