import type { Clock, RandomSource } from '@dawn/utils';
import type { DefinitionRegistry } from '@dawn/game-data';

export interface EngineContext {
  clock: Clock;
  random: RandomSource;
  definitions: DefinitionRegistry;
}
