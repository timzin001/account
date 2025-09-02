import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { getConnections, getConnProviders } from 'src/helper/database';

@Module({
  imports: [...getConnections()],
  controllers: [ProductController],
  providers: [ProductService, getConnProviders()],
})
export class ProductModule {}
