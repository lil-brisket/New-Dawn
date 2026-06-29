export interface GuildMember {
  playerId: string;
  displayName: string;
  role: 'leader' | 'officer' | 'member';
  joinedAt: number;
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  emblemId: string;
  level: number;
  members: GuildMember[];
  maxMembers: number;
}
