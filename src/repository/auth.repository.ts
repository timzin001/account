import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import mongoose, { Document } from 'mongoose';
import { Auth } from 'src/schema/auth.schema';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(Auth.name)
    private model: Model<Auth>,
  ) {}

  /**
   * Create
   * @param data
   * @param session
   * @returns
   */
  async create(data: any, session: ClientSession): Promise<Auth> {
    let client = new this.model(data);
    return await client.save({ session });
  }
  async findOneBy(obj: any) {
    let result = this.model.findOne(obj);
    return await result.exec();
  }

  async update(id: string, userAuth: Auth): Promise<Auth> {
    return await this.model
      .findByIdAndUpdate(new mongoose.Types.ObjectId(id), userAuth, {
        new: true,
      })
      .exec();
  }

  async deleteOneBy(obj: any) {
    let result = this.model.deleteOne(obj);
    return await result.exec();
  }
}
