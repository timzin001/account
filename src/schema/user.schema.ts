import { Media } from './media.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { now } from 'mongoose';
import { I18nString } from './common/i18nstring.schema';
import { I18nDate } from './common/i18ndate.schema';
import { I18nBool } from './common/i18nbool.schema';

@Schema()
export class User {
  @Prop({ required: true, default: '' })
  code: string;
  @Prop({ required: true })
  phoneNumber: string;
  @Prop({ required: true })
  fullName: I18nString;
  @Prop({ required: true })
  password: string;
  @Prop({ default: '' })
  nickName: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: (() => Media).name,
  })
  avatar: Media;

  @Prop({})
  address: I18nString;

  @Prop({
    ///value: male, female, other
  })
  gender: I18nString;

  @Prop({
    default: [],
    required: true,
  })
  orgs: string[];

  @Prop({ default: true })
  active: I18nBool;

  @Prop({ required: true })
  dateOfBirth: I18nDate;

  @Prop()
  description: I18nString;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: (() => Media).name,
  })
  imgDescription: Media;

  @Prop({ default: now() })
  createdAt: I18nDate;

  @Prop({ default: now() })
  updatedAt: I18nDate;
}
export const UserSchema = SchemaFactory.createForClass(User);
