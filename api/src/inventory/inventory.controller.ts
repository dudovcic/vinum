import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../database';

@Controller('inventory')
export class InventoryController {
  constructor(
    private inventoryService: InventoryService,
    private prisma: PrismaService,
  ) {}

  @Get('products')
  async getAllProducts() {
    return this.prisma.product.findMany({
      include: {
        inventoryItems: {
          include: {
            warehouse: true,
          },
        },
      },
    });
  }

  @Get('purchase-orders')
  async getPurchaseOrders() {
    return this.prisma.purchaseOrder.findMany({
      include: {
        product: true,
        supplier: true,
        warehouse: true,
      },
    });
  }

  @Post('adjust-stock')
  async adjustStock(
    @Body()
    body: {
      productId: string;
      warehouseId: string;
      quantityChange: number;
    },
  ) {
    return this.prisma.productWarehouse.update({
      where: {
        productId_warehouseId: {
          productId: body.productId,
          warehouseId: body.warehouseId,
        },
      },
      data: {
        quantityInStock: body.quantityChange,
      },
    });
  }

  @Post('process-delivery/:purchaseOrderId')
  async processDelivery(@Param('purchaseOrderId') purchaseOrderId: string) {
    return this.inventoryService.updateStockUponDelivery(purchaseOrderId);
  }
}
