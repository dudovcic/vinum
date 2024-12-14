import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
} from './dto/purchase-order.dto';
import { PurchaseOrderStatus } from '@prisma/client';

@Controller('purchase-orders')
export class PurchaseOrderController {
  constructor(private purchaseOrderService: PurchaseOrderService) {}

  @Post()
  createPurchaseOrder(@Body() dto: CreatePurchaseOrderDto) {
    console.log('dto is', dto);
    return this.purchaseOrderService.createPurchaseOrder(dto);
  }

  @Put(':id')
  updatePurchaseOrder(
    @Param('id') id: string,
    @Body() dto: UpdatePurchaseOrderDto,
  ) {
    return this.purchaseOrderService.updatePurchaseOrder(id, dto);
  }

  @Delete(':id')
  cancelPurchaseOrder(@Param('id') id: string) {
    return this.purchaseOrderService.cancelPurchaseOrder(id);
  }

  @Get(':id')
  getPurchaseOrderById(@Param('id') id: string) {
    return this.purchaseOrderService.getPurchaseOrderById(id);
  }

  @Get()
  listPurchaseOrders(
    @Query('status') status?: PurchaseOrderStatus,
    @Query('supplierId') supplierId?: string,
    @Query('productId') productId?: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.purchaseOrderService.listPurchaseOrders({
      status,
      supplierId,
      productId,
      warehouseId,
    });
  }
}
