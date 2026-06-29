/** Border width tokens */
export const border = {
  hairline: 0.5,
  thin: 1,
  normal: 2,
  thick: 3,
  focus: 2,
} as const;

export type Border = typeof border;
