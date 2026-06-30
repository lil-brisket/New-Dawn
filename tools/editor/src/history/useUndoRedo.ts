import { useCallback, useEffect, useRef, useState } from 'react';

export function useUndoRedo<T>(initial: T) {
  const [state, setState] = useState(initial);
  const past = useRef<T[]>([]);
  const future = useRef<T[]>([]);
  const skipHistory = useRef(false);
  const [historyTick, setHistoryTick] = useState(0);

  const bump = () => setHistoryTick((n) => n + 1);

  const set = useCallback((next: T | ((prev: T) => T)) => {
    setState((prev) => {
      const value = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
      if (!skipHistory.current) {
        past.current.push(structuredClone(prev));
        future.current = [];
        bump();
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
    bump();
  }, [state]);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (next === undefined) return;
    past.current.push(structuredClone(state));
    skipHistory.current = true;
    setState(next);
    bump();
  }, [state]);

  const reset = useCallback((value: T) => {
    past.current = [];
    future.current = [];
    skipHistory.current = true;
    setState(value);
    bump();
  }, []);

  const clearHistory = useCallback(() => {
    past.current = [];
    future.current = [];
    bump();
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

  void historyTick;

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
