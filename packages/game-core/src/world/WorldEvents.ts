import { EventBus } from '../events/EventBus';
import type { WorldEvent } from '@dawn/types';

export class WorldEventBus extends EventBus<WorldEvent> {}
