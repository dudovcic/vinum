import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../database/prisma.service';
import { createMock } from '@golevelup/ts-jest';

import { PurchaseOrderStatus } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { addDays } from 'date-fns';

describe('InventoryService', () => {
  let sut = createMock<InventoryService>();
  let mockPrismaService = createMock<PrismaService>();
  let mockLogger = createMock<Logger>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    sut = module.get(InventoryService);
    mockPrismaService = module.get(PrismaService);
    mockLogger = module.get(Logger);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('checkInventoryLevels', () => {
    it('should create a purchase order when stock is below reorder threshold', async () => {
      const mockProductWarehouse = {
        product: {
          id: 1,
          name: 'Product 1',
          reorderThreshold: 10,
          defaultSupplierId: 1,
        },
        warehouse: { id: 1, capacity: 100 },
        quantityInStock: 5,
      };

      mockPrismaService.productWarehouse.findMany = jest
        .fn()
        .mockResolvedValueOnce([mockProductWarehouse]);
      mockPrismaService.purchaseOrder.create = jest.fn().mockResolvedValueOnce({
        id: '1',
        productId: mockProductWarehouse.product.id,
        supplierId: mockProductWarehouse.product.defaultSupplierId,
        warehouseId: mockProductWarehouse.warehouse.id,
        quantityOrdered: 15,
        expectedArrivalDate: addDays(new Date(), 3),
        status: PurchaseOrderStatus.PENDING,
      });

      await sut.checkInventoryLevels();

      expect(mockPrismaService.productWarehouse.findMany).toHaveBeenCalled();
      expect(mockPrismaService.purchaseOrder.create).toHaveBeenCalledWith({
        data: {
          productId: mockProductWarehouse.product.id,
          supplierId: mockProductWarehouse.product.defaultSupplierId,
          warehouseId: mockProductWarehouse.warehouse.id,
          quantityOrdered: 15,
          expectedArrivalDate: addDays(new Date(), 3),
          status: PurchaseOrderStatus.PENDING,
        },
      });
    });
  });

  describe('generatePurchaseOrder', () => {
    it('should generate purchase order correctly', async () => {
      const mockProductWarehouse = {
        product: {
          id: 1,
          name: 'Product 1',
          reorderThreshold: 10,
          defaultSupplierId: 1,
        },
        warehouse: { id: 1, capacity: 100 },
        quantityInStock: 5,
      };

      const reorderQuantity = 15;

      mockPrismaService.purchaseOrder.create = jest.fn().mockResolvedValueOnce({
        id: '1',
        productId: mockProductWarehouse.product.id,
        supplierId: mockProductWarehouse.product.defaultSupplierId,
        warehouseId: mockProductWarehouse.warehouse.id,
        quantityOrdered: reorderQuantity,
        expectedArrivalDate: addDays(new Date(), 3),
        status: PurchaseOrderStatus.PENDING,
      });

      const result = await sut.generatePurchaseOrder(mockProductWarehouse);

      expect(result).toEqual({
        id: '1',
        productId: mockProductWarehouse.product.id,
        supplierId: mockProductWarehouse.product.defaultSupplierId,
        warehouseId: mockProductWarehouse.warehouse.id,
        quantityOrdered: reorderQuantity,
        expectedArrivalDate: addDays(new Date(), 3),
        status: PurchaseOrderStatus.PENDING,
      });
    });

    it('should return null if reorder quantity is 0 or negative', async () => {
      const mockProductWarehouse = {
        product: {
          id: 1,
          name: 'Product 1',
          reorderThreshold: 10,
          defaultSupplierId: 1,
        },
        warehouse: { id: 1, capacity: 10 },
        quantityInStock: 10,
      };

      const result = await sut.generatePurchaseOrder(mockProductWarehouse);

      expect(result).toBeNull();
    });
  });

  describe('updateStockUponDelivery', () => {
    it('should update stock and mark purchase order as completed', async () => {
      const mockPurchaseOrder = {
        id: '1',
        productId: 1,
        supplierId: 1,
        warehouseId: 1,
        quantityOrdered: 15,
        expectedArrivalDate: addDays(new Date(), 3),
        status: PurchaseOrderStatus.PENDING,
        product: { id: 1, name: 'Product 1' },
        warehouse: { id: 1, name: 'Warehouse 1' },
      };

      const mockProductWarehouse = {
        productId: 1,
        warehouseId: 1,
        quantityInStock: 5,
      };

      mockPrismaService.purchaseOrder.findUnique = jest
        .fn()
        .mockResolvedValueOnce(mockPurchaseOrder);
      mockPrismaService.productWarehouse.update = jest
        .fn()
        .mockResolvedValueOnce(mockProductWarehouse);
      mockPrismaService.warehouse.update = jest.fn();
      mockPrismaService.purchaseOrder.update = jest.fn();

      await sut.updateStockUponDelivery(mockPurchaseOrder.id);

      expect(mockPrismaService.productWarehouse.update).toHaveBeenCalledWith({
        where: {
          productId_warehouseId: {
            productId: mockPurchaseOrder.productId,
            warehouseId: mockPurchaseOrder.warehouseId,
          },
        },
        data: {
          quantityInStock: { increment: mockPurchaseOrder.quantityOrdered },
        },
      });

      expect(mockPrismaService.warehouse.update).toHaveBeenCalledWith({
        where: { id: mockPurchaseOrder.warehouseId },
        data: {
          currentOccupancy: { increment: mockPurchaseOrder.quantityOrdered },
        },
      });

      expect(mockPrismaService.purchaseOrder.update).toHaveBeenCalledWith({
        where: { id: mockPurchaseOrder.id },
        data: { status: PurchaseOrderStatus.COMPLETED },
      });
    });

    it('should throw an error if purchase order not found', async () => {
      mockPrismaService.purchaseOrder.findUnique = jest
        .fn()
        .mockResolvedValueOnce(null);

      await expect(
        sut.updateStockUponDelivery('non-existing-id'),
      ).rejects.toThrow('Purchase order not found');
    });
  });
});
