import { mockCharacters } from '@/mocks/characters';

export interface PlayerRepository {
  getDisplayName(): Promise<string>;
  getCharacters(): Promise<typeof mockCharacters>;
}

export class MockPlayerRepository implements PlayerRepository {
  async getDisplayName() {
    return 'Adventurer';
  }

  async getCharacters() {
    return mockCharacters;
  }
}

export const playerRepository: PlayerRepository = new MockPlayerRepository();
