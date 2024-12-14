import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { DatabaseModule } from 'src/database';
import { InventoryScheduler } from './inventory.scheduler';

@Module({
  imports: [DatabaseModule, ScheduleModule.forRoot()],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryScheduler],
})
export class InventoryModule {}
