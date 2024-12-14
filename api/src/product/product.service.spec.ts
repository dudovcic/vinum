import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../database/prisma.service';
import { createMock } from '@golevelup/ts-jest';

describe('ProductService', () => {
  let sut: ProductService;
  let mockPrismaService = createMock<PrismaService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    sut = module.get<ProductService>(ProductService);
    mockPrismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('listProducts', () => {
    it('should return a list of products with no filters', async () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          reorderThreshold: 10,
          defaultSupplier: { id: 1, name: 'Supplier 1' },
          inventoryItems: [{ warehouse: { id: 1, name: 'Warehouse 1' } }],
        },
      ];

      mockPrismaService.product.findMany = jest
        .fn()
        .mockResolvedValue(mockProducts);

      const result = await sut.listProducts({});
      expect(result).toEqual(mockProducts);
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          defaultSupplier: true,
          inventoryItems: {
            include: {
              warehouse: true,
            },
          },
        },
      });
    });

    it('should filter products by search', async () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          reorderThreshold: 10,
          defaultSupplier: { id: 1, name: 'Supplier 1' },
          inventoryItems: [{ warehouse: { id: 1, name: 'Warehouse 1' } }],
        },
      ];

      const filters = { search: 'Product' };
      mockPrismaService.product.findMany = jest
        .fn()
        .mockResolvedValue(mockProducts);

      const result = await sut.listProducts(filters);

      expect(result).toEqual(mockProducts);
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'Product', mode: 'insensitive' } },
            { description: { contains: 'Product', mode: 'insensitive' } },
          ],
        },
        include: {
          defaultSupplier: true,
          inventoryItems: {
            include: {
              warehouse: true,
            },
          },
        },
      });
    });

    it('should filter products by minReorderThreshold', async () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          reorderThreshold: 10,
          defaultSupplier: { id: 1, name: 'Supplier 1' },
          inventoryItems: [{ warehouse: { id: 1, name: 'Warehouse 1' } }],
        },
      ];

      const filters = { minReorderThreshold: 5 };
      mockPrismaService.product.findMany = jest
        .fn()
        .mockResolvedValue(mockProducts);

      const result = await sut.listProducts(filters);

      expect(result).toEqual(mockProducts);
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          reorderThreshold: { gte: 5 },
        },
        include: {
          defaultSupplier: true,
          inventoryItems: {
            include: {
              warehouse: true,
            },
          },
        },
      });
    });

    it('should apply both search and minReorderThreshold filters', async () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          reorderThreshold: 10,
          defaultSupplier: { id: 1, name: 'Supplier 1' },
          inventoryItems: [{ warehouse: { id: 1, name: 'Warehouse 1' } }],
        },
      ];

      const filters = { search: 'Product', minReorderThreshold: 5 };
      mockPrismaService.product.findMany = jest
        .fn()
        .mockResolvedValue(mockProducts);

      const result = await sut.listProducts(filters);

      expect(result).toEqual(mockProducts);
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'Product', mode: 'insensitive' } },
            { description: { contains: 'Product', mode: 'insensitive' } },
          ],
          reorderThreshold: { gte: 5 },
        },
        include: {
          defaultSupplier: true,
          inventoryItems: {
            include: {
              warehouse: true,
            },
          },
        },
      });
    });
  });

  describe('generateSKU', () => {
    it('should generate SKU correctly based on product name', () => {
      const productName = 'Test Product';
      const sku = sut['generateSKU'](productName);

      // SKU should be of format: 'T-<timestamp>'
      console.log('sku', sku);
      expect(sku).toMatch(/\d{6}$/); // Assuming timestamp slice returns 6 digits
    });
  });
});
