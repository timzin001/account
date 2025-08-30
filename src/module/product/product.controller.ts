import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Post()
  async create(@Body() createProductDto: any) {
    return this.productService.create(createProductDto);
  }
}
