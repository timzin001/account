import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { now } from 'mongoose';
import { User } from './user.schema';
@Schema()
export class Auth {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: (() => User).name,
  })
  user: User;

  @Prop({
    required: true,
  })
  token: string;

  @Prop({ required: true })
  type: string; /// ios, android, web

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
