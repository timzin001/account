import { Module, FactoryProvider, Logger } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TENANT_CONNECTIONS } from 'src/constants/tokens';
import { Connection } from 'mongoose';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { getConnections, getConnProviders } from 'src/helper/database';
import { Auth, AuthSchema } from 'src/schema/auth.schema';

@Module({
  imports: [...getConnections()],
  controllers: [ProductController],
  providers: [
    ProductService,
    // tenantConnectionsProvider
    getConnProviders(),
  ],
})
export class ProductModule {}
