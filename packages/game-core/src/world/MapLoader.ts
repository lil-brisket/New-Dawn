import type { MapData } from '@dawn/types';
import type { DefinitionRegistry } from '@dawn/game-data';

export class MapLoader {
  constructor(private definitions: DefinitionRegistry) {}

  load(mapId: string): MapData | undefined {
    return this.definitions.getMap(mapId);
  }
}
