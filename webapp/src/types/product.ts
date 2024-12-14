import { InventoryItem } from './inventory';
import { Supplier } from './supplier';

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  reorderThreshold: number;
  defaultSupplierId: string;
  createdAt: string;
  updatedAt: string;
  defaultSupplier: Supplier;
  inventoryItems: InventoryItem[];
}
