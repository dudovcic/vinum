import { Warehouse } from './warehouse';

export interface InventoryItem {
  productId: string;
  warehouseId: string;
  quantityInStock: number;
  warehouse: Warehouse;
}
