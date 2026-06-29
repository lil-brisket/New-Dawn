export interface Clock {
  now(): number;
}

export const systemClock: Clock = {
  now: () => Date.now(),
};

export function createTestClock(startTime = 0): Clock & { advance: (ms: number) => void } {
  let current = startTime;
  return {
    now: () => current,
    advance: (ms: number) => {
      current += ms;
    },
  };
}
