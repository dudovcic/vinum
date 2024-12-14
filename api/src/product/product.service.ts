import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

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
}
