import { Prop } from '@nestjs/mongoose'
import { now } from 'mongoose'
export class I18nBool {
  @Prop({ required: false })
  en: string
  @Prop({ required: false })
  vi: string
  @Prop({ default: now() })
  value: boolean
}
