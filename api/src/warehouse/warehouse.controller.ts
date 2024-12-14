import { Controller, Get } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';

@Controller('warehouse')
export class WarehouseController {
  constructor(private productService: WarehouseService) {}

  @Get()
  listWarehouses() {
    return this.productService.listWarehouses();
  }
}
