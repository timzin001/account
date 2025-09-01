// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class ProductService {}

import { Injectable, Inject, Scope, Logger } from '@nestjs/common';
import { ClientSession, Connection, Model } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { CONNECTIONS_PROVIDER, TENANT_CONNECTIONS } from 'src/constants/tokens';
import { Auth } from 'src/schema/auth.schema';

@Injectable({ scope: Scope.REQUEST })
export class ProductService {
  private readonly mapModel: Map<string, Model<Product>> = new Map();

  constructor(
    @Inject(CONNECTIONS_PROVIDER)
    private readonly connections: Map<string, Connection>,
  ) {
    for (const [key, value] of connections) {
      Logger.log(`${key}: ${value}`);
      const conn = this.connections.get(key);
      let model = conn.model(Product.name, ProductSchema);
      this.mapModel.set(key, model);
    }
  }

  async findAll(): Promise<any[]> {
    let request = [];
    for (const [key, value] of this.mapModel) {
      request.push(value.find().exec());
    }
    return Promise.all(request);
  }

  async create(productData: any): Promise<any[]> {
    // let mapSession: Map<string, ClientSession> = new Map();
    // for (const [key, value] of this.connections) {
    //   const session = await value.startSession();
    //   mapSession.set(key, session);
    //   session.startTransaction();
    // }

    let auth = {};

    let request = [];
    for (const [key, value] of this.mapModel) {
      const newProduct = new value(productData);
      request.push(newProduct.save());
    }
    return await Promise.all(request);
  }
}
