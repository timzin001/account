import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { now, Document } from 'mongoose';
import { User } from './user.schema';
@Schema()
export class Media extends Document {
  @Prop({ required: true })
  dbName: string;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: (() => User).name,
  })
  user: User;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;

  @Prop({})
  filename: string;

  @Prop({})
  location: string;

  @Prop({})
  key: string;
  @Prop({})
  etag: string;

  @Prop({})
  serverSideEncryption: string;

  @Prop({})
  mimetype: string;
}

export const MediaUserSchema = SchemaFactory.createForClass(Media);
