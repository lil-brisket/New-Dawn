export interface RandomSource {
  next(): number;
  nextInt(min: number, max: number): number;
  chance(probability: number): boolean;
}

export class SeededRandom implements RandomSource {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  chance(probability: number): boolean {
    return this.next() < probability;
  }
}

export function createSeededRandom(seed: number): RandomSource {
  return new SeededRandom(seed);
}
