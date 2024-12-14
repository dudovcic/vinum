import { Module } from '@nestjs/common';
import { ProductsModule } from './product/product.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-order.module';
import { InventoryModule } from './inventory/inventory.module';
import { WarehouseModule } from './warehouse/warehouse.module';

@Module({
  imports: [
    WarehouseModule,
    InventoryModule,
    ProductsModule,
    PurchaseOrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
