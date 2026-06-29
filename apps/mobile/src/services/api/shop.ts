import { mockShop } from '@/mocks/shop';

export interface ShopRepository {
  getItems(): Promise<typeof mockShop>;
}

export class MockShopRepository implements ShopRepository {
  async getItems() {
    return mockShop;
  }
}

export const shopRepository: ShopRepository = new MockShopRepository();
