import { Injectable, Logger } from '@nestjs/common';
import { PurchaseOrderStatus } from '@prisma/client';
import { addDays } from 'date-fns';
import { PrismaService } from 'src/database';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(private prisma: PrismaService) {}

  async checkInventoryLevels() {
    // Find all product-warehouse combinations
    const productWarehouses = await this.prisma.productWarehouse.findMany({
      include: {
        product: true,
        warehouse: true,
      },
    });

    for (const pw of productWarehouses) {
      // Check if stock is below reorder threshold
      if (pw.quantityInStock <= pw.product.reorderThreshold) {
        await this.generatePurchaseOrder(pw);
      }
    }
  }

  async generatePurchaseOrder(productWarehouse) {
    const { product, warehouse } = productWarehouse;

    // Calculate order quantity
    const reorderQuantity = this.calculateReorderQuantity(
      productWarehouse.quantityInStock,
      product.reorderThreshold,
      warehouse.capacity,
    );

    if (reorderQuantity <= 0) {
      this.logger.warn(
        `Cannot reorder for product ${product.name} - insufficient warehouse capacity`,
      );
      return null;
    }

    try {
      return await this.prisma.purchaseOrder.create({
        data: {
          productId: product.id,
          supplierId: product.defaultSupplierId,
          warehouseId: warehouse.id,
          quantityOrdered: reorderQuantity,
          expectedArrivalDate: addDays(new Date(), 3), // 3-day lead time
          status: PurchaseOrderStatus.PENDING,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create purchase order: ${error.message}`);
      return null;
    }
  }

  private calculateReorderQuantity(
    currentStock: number,
    reorderThreshold: number,
    warehouseCapacity: number,
  ): number {
    // Calculate basic reorder quantity
    const baseReorderQuantity = reorderThreshold * 2 - currentStock;

    // Ensure we don't exceed warehouse capacity
    const availableCapacity = warehouseCapacity - currentStock;

    return Math.min(baseReorderQuantity, availableCapacity);
  }

  async updateStockUponDelivery(purchaseOrderId: string) {
    const purchaseOrder = await this.prisma.purchaseOrder.findUnique({
      where: { id: purchaseOrderId },
      include: { product: true, warehouse: true },
    });

    if (!purchaseOrder) {
      throw new Error('Purchase order not found');
    }

    // Update product warehouse stock
    await this.prisma.productWarehouse.update({
      where: {
        productId_warehouseId: {
          productId: purchaseOrder.productId,
          warehouseId: purchaseOrder.warehouseId,
        },
      },
      data: {
        quantityInStock: {
          increment: purchaseOrder.quantityOrdered,
        },
      },
    });

    // Update warehouse occupancy
    await this.prisma.warehouse.update({
      where: { id: purchaseOrder.warehouseId },
      data: {
        currentOccupancy: {
          increment: purchaseOrder.quantityOrdered,
        },
      },
    });

    // Mark purchase order as completed
    await this.prisma.purchaseOrder.update({
      where: { id: purchaseOrderId },
      data: { status: PurchaseOrderStatus.COMPLETED },
    });
  }
}
