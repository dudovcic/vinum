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
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Put(':id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.updateProduct(id, dto);
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Get()
  listProducts(
    @Query('search') search?: string,
    @Query('minReorderThreshold') minReorderThreshold?: number,
  ) {
    return this.productService.listProducts({
      search,
      minReorderThreshold: minReorderThreshold
        ? Number(minReorderThreshold)
        : undefined,
    });
  }

  @Get('stock-levels')
  getProductStockLevels(@Query('warehouseId') warehouseId?: string) {
    return this.productService.getProductStockLevels({
      warehouseId,
    });
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
