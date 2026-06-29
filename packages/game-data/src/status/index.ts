import type { StatusDefinition } from '@dawn/types';

export const burn: StatusDefinition = {
  id: 'status_burn',
  name: 'Burn',
  description: 'Takes fire damage each turn.',
  duration: 3,
  stackable: true,
  maxStacks: 3,
  iconId: 'icon_burn',
};

export const stun: StatusDefinition = {
  id: 'status_stun',
  name: 'Stun',
  description: 'Cannot act while stunned.',
  duration: 1,
  stackable: false,
  maxStacks: 1,
  iconId: 'icon_stun',
};
