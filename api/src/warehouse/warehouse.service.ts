import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService) {}

  async listWarehouses() {
    return this.prisma.warehouse.findMany({});
  }
}
