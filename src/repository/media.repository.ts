import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Media } from 'src/schema/media.schema';

@Injectable()
export class MediaUserRepository {
  constructor(@InjectModel(Media.name) private model: Model<Media>) {}

  async create(media: Media) {
    const createMedia = new this.model(media);
    return await createMedia.save();
  }

  async findOneBy(obj: any) {
    return await this.model.findOne(obj).exec();
  }
}
