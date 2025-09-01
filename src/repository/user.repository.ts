import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema/user.schema';
import { ClientSession, Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import mongoose, { Document } from 'mongoose';
import { Media } from 'src/schema/media.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private model: Model<User>) {}
  async findBy(obj: any) {
    return await this.model.find(obj).exec();
  }
  async createNoSession(data: any): Promise<User> {
    let client = new this.model(data);
    return await client.save();
  }
  async create(data: any, session: ClientSession): Promise<User> {
    let client = new this.model(data);
    return await client.save({ session });
  }

  async findUserCount() {
    // Condition get employees
    let condition = [
      // {
      //   $match: {
      //     $and: [{ active: true }],
      //   },
      // },
      {
        $count: 'total',
      },
    ];

    let result = this.model.aggregate(condition);
    const resCount = await result.exec();

    if (resCount && resCount.length) {
      return resCount[0].total;
    }
    return 0;
  }

  async findOneBy(obj: any) {
    let result = this.model.findOne(obj);
    let res = await result.exec();
    return res;
  }

  async findByIds(listIds: [String], avatar: boolean = false) {
    let result = this.model.find({ _id: { $in: listIds } });
    if (avatar) {
      result.populate({ path: 'avatar', model: Media.name });
    }
    return await result.exec();
  }

  async update(id: string, user: User, session: ClientSession): Promise<User> {
    return await this.model
      .findByIdAndUpdate(new mongoose.Types.ObjectId(id), user, { new: true })
      .session(session)
      .exec();
  }
  async updateNoSession(id: string, user: User): Promise<User> {
    return await this.model
      .findByIdAndUpdate(new mongoose.Types.ObjectId(id), user, { new: true })
      .exec();
  }
}
