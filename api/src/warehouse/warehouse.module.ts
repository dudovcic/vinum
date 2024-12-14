import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { DatabaseModule } from 'src/database';

@Module({
  imports: [DatabaseModule],
  providers: [WarehouseService],
  controllers: [WarehouseController],
})
export class WarehouseModule {}
