import { IsString, IsInt, IsDate, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseOrderDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  supplierId?: string;

  @IsString()
  warehouseId: string;

  @IsInt()
  @Min(1)
  quantityOrdered: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expectedArrivalDate?: Date;
}

export class UpdatePurchaseOrderDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  quantityOrdered?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expectedArrivalDate?: Date;
}
