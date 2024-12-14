import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
} from './dto/purchase-order.dto';
import { PurchaseOrderStatus } from '@prisma/client';
import { addDays } from 'date-fns';

@Injectable()
export class PurchaseOrderService {
  private readonly logger = new Logger(PurchaseOrderService.name);

  constructor(private prisma: PrismaService) {}

  async createPurchaseOrder(dto: CreatePurchaseOrderDto) {
    // Validate product exists
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${dto.productId} not found`);
    }

    // Validate supplier exists
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: dto.supplierId || product.defaultSupplierId },
    });

    if (!supplier) {
      throw new NotFoundException(
        `Supplier with ID ${dto.supplierId} not found`,
      );
    }

    // Validate warehouse exists and has capacity
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: dto.warehouseId },
    });
    if (!warehouse) {
      throw new NotFoundException(
        `Warehouse with ID ${dto.warehouseId} not found`,
      );
    }

    // Check warehouse capacity
    const currentProductStock = await this.prisma.productWarehouse.findUnique({
      where: {
        productId_warehouseId: {
          productId: dto.productId,
          warehouseId: dto.warehouseId,
        },
      },
    });

    const proposedTotalStock =
      (currentProductStock?.quantityInStock || 0) + dto.quantityOrdered;
    if (proposedTotalStock > warehouse.capacity) {
      throw new BadRequestException('Order would exceed warehouse capacity');
    }

    // Set default expected arrival date if not provided

    console.log('date is...', dto.expectedArrivalDate);
    const expectedArrivalDate =
      dto.expectedArrivalDate || addDays(new Date(), 3); // Default 3-day lead time

    // Create purchase order
    return this.prisma.purchaseOrder.create({
      data: {
        productId: dto.productId,
        supplierId: dto.supplierId || product.defaultSupplierId,
        warehouseId: dto.warehouseId,
        quantityOrdered: dto.quantityOrdered,
        expectedArrivalDate: expectedArrivalDate,
        status: PurchaseOrderStatus.PENDING,
      },
      include: {
        product: true,
        supplier: true,
        warehouse: true,
      },
    });
  }

  async updatePurchaseOrder(
    purchaseOrderId: string,
    dto: UpdatePurchaseOrderDto,
  ) {
    // Ensure purchase order exists
    const existingOrder = await this.prisma.purchaseOrder.findUnique({
      where: { id: purchaseOrderId },
    });

    if (!existingOrder) {
      throw new NotFoundException(
        `Purchase Order with ID ${purchaseOrderId} not found`,
      );
    }

    // Prevent updates to completed or cancelled orders
    if (
      existingOrder.status === PurchaseOrderStatus.COMPLETED ||
      existingOrder.status === PurchaseOrderStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Cannot modify completed or cancelled orders',
      );
    }

    // Optional: Add capacity check if quantity is being modified
    if (dto.quantityOrdered) {
      const warehouse = await this.prisma.warehouse.findUnique({
        where: { id: existingOrder.warehouseId },
      });

      const currentProductStock = await this.prisma.productWarehouse.findUnique(
        {
          where: {
            productId_warehouseId: {
              productId: existingOrder.productId,
              warehouseId: existingOrder.warehouseId,
            },
          },
        },
      );

      const proposedTotalStock =
        (currentProductStock?.quantityInStock || 0) + dto.quantityOrdered;
      if (proposedTotalStock > warehouse.capacity) {
        throw new BadRequestException(
          'Updated order would exceed warehouse capacity',
        );
      }
    }

    // Update purchase order
    return this.prisma.purchaseOrder.update({
      where: { id: purchaseOrderId },
      data: {
        ...(dto.quantityOrdered && { quantityOrdered: dto.quantityOrdered }),
        ...(dto.expectedArrivalDate && {
          expectedArrivalDate: dto.expectedArrivalDate,
        }),
      },
      include: {
        product: true,
        supplier: true,
        warehouse: true,
      },
    });
  }

  async cancelPurchaseOrder(purchaseOrderId: string) {
    // Ensure purchase order exists
    const existingOrder = await this.prisma.purchaseOrder.findUnique({
      where: { id: purchaseOrderId },
    });

    if (!existingOrder) {
      throw new NotFoundException(
        `Purchase Order with ID ${purchaseOrderId} not found`,
      );
    }

    // Prevent cancelling completed orders
    if (existingOrder.status === PurchaseOrderStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed order');
    }

    // Cancel the order
    return this.prisma.purchaseOrder.update({
      where: { id: purchaseOrderId },
      data: {
        status: PurchaseOrderStatus.CANCELLED,
      },
    });
  }

  async getPurchaseOrderById(purchaseOrderId: string) {
    const purchaseOrder = await this.prisma.purchaseOrder.findUnique({
      where: { id: purchaseOrderId },
      include: {
        product: true,
        supplier: true,
        warehouse: true,
      },
    });

    if (!purchaseOrder) {
      throw new NotFoundException(
        `Purchase Order with ID ${purchaseOrderId} not found`,
      );
    }

    return purchaseOrder;
  }

  async listPurchaseOrders(
    filters: {
      status?: PurchaseOrderStatus;
      supplierId?: string;
      productId?: string;
      warehouseId?: string;
    } = {},
  ) {
    return this.prisma.purchaseOrder.findMany({
      where: {
        ...(filters.status && { status: filters.status }),
        ...(filters.supplierId && { supplierId: filters.supplierId }),
        ...(filters.productId && { productId: filters.productId }),
        ...(filters.warehouseId && { warehouseId: filters.warehouseId }),
      },
      include: {
        product: true,
        supplier: true,
        warehouse: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
