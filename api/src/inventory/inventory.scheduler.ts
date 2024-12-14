import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InventoryService } from './inventory.service';

@Injectable()
export class InventoryScheduler {
  private readonly logger = new Logger(InventoryScheduler.name);

  constructor(private inventoryService: InventoryService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleInventoryCheck() {
    this.logger.log('Starting daily inventory check...');
    try {
      await this.inventoryService.checkInventoryLevels();
      this.logger.log('Inventory check completed successfully');
    } catch (error) {
      this.logger.error('Failed to perform inventory check', error);
    }
  }
}
