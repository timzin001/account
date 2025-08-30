import { Module, FactoryProvider, Logger } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TENANT_CONNECTIONS } from 'src/constants/tokens';
import { Connection } from 'mongoose';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { getConnections, getConnectionProviders } from 'src/helper/database';

@Module({
  imports: [
    // Import the dynamic modules for each year.
    // This makes their named connections available for injection.
    ...getConnections(),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    // tenantConnectionsProvider
    getConnectionProviders(),
  ],
})
export class ProductModule {}
