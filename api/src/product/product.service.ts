import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductStockFilterDto,
} from './dto/product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    // Check if a product with similar name already exists
    const existingProduct = await this.prisma.product.findFirst({
      where: { name: dto.name },
    });

    if (existingProduct) {
      throw new ConflictException('A product with this name already exists');
    }

    // Generate a unique SKU
    const sku = this.generateSKU(dto.name);

    return this.prisma.product.create({
      data: {
        ...dto,
        sku,
        inventoryItems: {
          create: [], // Placeholder for future warehouse associations
        },
      },
    });
  }

  async updateProduct(productId: string, dto: UpdateProductDto) {
    // Verify product exists
    await this.getProductById(productId);

    return this.prisma.product.update({
      where: { id: productId },
      data: dto,
    });
  }

  async getProductById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        defaultSupplier: true,
        inventoryItems: {
          include: {
            warehouse: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return product;
  }

  async listProducts(
    filters: {
      search?: string;
      minReorderThreshold?: number;
    } = {},
  ) {
    const where: Prisma.ProductWhereInput = {
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
      ...(filters.minReorderThreshold !== undefined && {
        reorderThreshold: { gte: filters.minReorderThreshold },
      }),
    };

    return this.prisma.product.findMany({
      where,
      include: {
        defaultSupplier: true,
        inventoryItems: {
          include: {
            warehouse: true,
          },
        },
      },
    });
  }

  async getProductStockLevels(filters: ProductStockFilterDto = {}) {
    const where: Prisma.ProductWarehouseWhereInput = {
      ...(filters.warehouseId && { warehouseId: filters.warehouseId }),
    };

    const stockLevels = await this.prisma.productWarehouse.findMany({
      where,
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: {
        quantityInStock: 'asc',
      },
    });

    return stockLevels.map((stock) => ({
      productId: stock.productId,
      productName: stock.product.name,
      warehouseId: stock.warehouseId,
      warehouseName: stock.warehouse.name,
      quantityInStock: stock.quantityInStock,
      reorderThreshold: stock.product.reorderThreshold,
      needsReorder: stock.quantityInStock <= stock.product.reorderThreshold,
    }));
  }

  private generateSKU(productName: string): string {
    // Generate a unique SKU based on product name and timestamp
    const timestamp = new Date().getTime().toString().slice(-6);
    const namePrefix = productName
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 3);

    return `${namePrefix}-${timestamp}`;
  }

  async deleteProduct(productId: string) {
    // Check if product exists first
    await this.getProductById(productId);

    return this.prisma.product.delete({
      where: { id: productId },
    });
  }
}
