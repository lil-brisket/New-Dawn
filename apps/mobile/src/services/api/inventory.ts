import { mockInventory } from '@/mocks/inventory';

export interface InventoryRepository {
  getInventory(): Promise<{ items: typeof mockInventory; gold: number }>;
}

export class MockInventoryRepository implements InventoryRepository {
  async getInventory() {
    return { items: mockInventory, gold: 12450 };
  }
}

export const inventoryRepository: InventoryRepository = new MockInventoryRepository();
