export const NavigationConstants = {
  TAB_LABELS: {
    home: 'Home',
    world: 'World',
    characters: 'Heroes',
    inventory: 'Bag',
    guild: 'Guild',
    profile: 'Profile',
  },
  HIDDEN_TABS: ['shop', 'summon', 'quests', 'settings', 'developer'] as const,
} as const;
