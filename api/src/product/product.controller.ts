import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

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
}
