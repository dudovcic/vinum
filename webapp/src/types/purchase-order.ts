import { Product } from './product';
import { Supplier } from './supplier';
import { Warehouse } from './warehouse';

export type PurchaseOrder = {
  id: string;
  productId: string;
  supplierId: string;
  warehouseId: string;
  quantityOrdered: number;
  orderDate: string;
  expectedArrivalDate: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  product: Product;
  supplier: Supplier;
  warehouse: Warehouse;
};

export interface CreatePurchaseOrderRequest {
  productId: string;
  supplierId?: string;
  warehouseId: string;
  quantityOrdered: number;
  expectedArrivalDate?: Date;
}
