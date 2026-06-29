import { mockGuild } from '@/mocks/guild';

export interface GuildRepository {
  getGuild(): Promise<typeof mockGuild | null>;
}

export class MockGuildRepository implements GuildRepository {
  async getGuild() {
    return mockGuild;
  }
}

export const guildRepository: GuildRepository = new MockGuildRepository();
